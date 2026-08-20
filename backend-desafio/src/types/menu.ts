import { ObjectId } from 'mongoose'

export interface IMenu {
  _id?: ObjectId;
  name: string;
  relatedId?: ObjectId;
}

export interface MenuTreeNode {
  id: string;
  name: string;
  submenus?: MenuTreeNode[];
}
