import * as yup from 'yup'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'

const isObjectId = (value?: string) =>
  value === undefined || mongoose.Types.ObjectId.isValid(value)

const createSchema = yup.object({
  name: yup.string().trim().required().min(3),
  relatedId: yup
    .string()
    .optional()
    .test('is-object-id', 'relatedId must be a valid MongoDB ObjectId', isObjectId),
})

export default {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createSchema.validate(req.body, { abortEarly: false })
      return next()
    } catch (err) {
      const { errors } = err as yup.ValidationError
      return res.status(400).json({ messages: errors })
    }
  },

  objectId: (req: Request, res: Response, next: NextFunction) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Id must be a valid MongoDB ObjectId' })

    return next()
  },
}
