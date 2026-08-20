import { model, Schema } from 'mongoose'
import { IMenu } from '../types/menu'

const schema = new Schema<IMenu>({
  name: {
    type: String,
    required: [true, 'Name can not be empty'],
    unique: true,
    trim: true,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    ref: 'menu',
    default: null,
    index: true,
  },
})

export default model<IMenu>('menu', schema, 'menus')
