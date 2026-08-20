import mongoose, { ObjectId } from 'mongoose'
import Menu from '../models/menu'
import { IMenu, MenuTreeNode } from '../types/menu'
import { StatusCodes } from 'http-status-codes'
import { HttpError } from '../errors/http-error'

interface CreateMenuInput {
  name: string
  relatedId?: string
}

export function buildMenuTree(menus: IMenu[]): MenuTreeNode[] {
  const nodes = new Map<string, MenuTreeNode>()
  const roots: MenuTreeNode[] = []

  for (const menu of menus) {
    nodes.set(menu._id!.toString(), {
      id: menu._id!.toString(),
      name: menu.name,
      submenus: [],
    })
  }

  for (const menu of menus) {
    const node = nodes.get(menu._id!.toString())!
    const parent = menu.relatedId ? nodes.get(menu.relatedId.toString()) : undefined

    if (parent) parent.submenus!.push(node)
    else roots.push(node)
  }

  for (const node of nodes.values()) {
    if (node.submenus!.length === 0) delete node.submenus
  }

  return roots
}

export default {
  create: async ({ name, relatedId }: CreateMenuInput): Promise<string> => {
    if (relatedId) {
      const parentExists = await Menu.exists({ _id: relatedId })
      if (!parentExists)
        throw new HttpError(StatusCodes.NOT_FOUND, 'Parent menu (relatedId) not found')
    }

    const existing = await Menu.exists({ name })
    if (existing) throw new HttpError(StatusCodes.CONFLICT, 'Name already exists')

    const { id } = await Menu.create({ name, relatedId })
    return id
  },

  getTree: async (): Promise<MenuTreeNode[]> => {
    const menus = await Menu.find().lean()
    return buildMenuTree(menus as IMenu[])
  },

  remove: async (id: string): Promise<number> => {
    const target = await Menu.exists({ _id: id })
    if (!target) throw new HttpError(StatusCodes.NOT_FOUND, 'Menu not found')

    const [result] = await Menu.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $graphLookup: {
          from: 'menus',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'relatedId',
          as: 'descendants',
        },
      },
      { $project: { 'descendants._id': 1 } },
    ])

    const idsToDelete = [
      id,
      ...result.descendants.map((d: { _id: ObjectId }) => d._id),
    ]

    const { deletedCount } = await Menu.deleteMany({ _id: { $in: idsToDelete } })
    return deletedCount
  },
}
