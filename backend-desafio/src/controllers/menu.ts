import { Request, Response } from 'express'
import service from '../services/menu'

export default {
  create: async (req: Request, res: Response): Promise<Response> => {
    const id = await service.create(req.body)
    return res.status(201).json({ id })
  },

  getAll: async (_req: Request, res: Response): Promise<Response> => {
    const tree = await service.getTree()
    return res.status(200).json(tree)
  },

  delete: async (req: Request, res: Response): Promise<Response> => {
    const deletedCount = await service.remove(req.params.id)
    return res.status(200).json({ id: req.params.id, deletedCount })
  },
}
