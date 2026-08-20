import express from 'express'
import controller from '../controllers/menu'
import validation from '../validation/menu'
import { asyncHandler } from '../middlewares/async-handler'

const routes = express.Router()

routes.post('/', validation.create, asyncHandler(controller.create))
routes.get('/', asyncHandler(controller.getAll))
routes.delete('/:id', validation.objectId, asyncHandler(controller.delete))

export default routes
