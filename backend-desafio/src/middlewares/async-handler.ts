import { Request, Response, NextFunction, RequestHandler } from 'express'

// Resolver bugzinho de async de sempre, que não captura exceções lançadas em funções assíncronas.
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(handler(req, res, next)).catch(next)
