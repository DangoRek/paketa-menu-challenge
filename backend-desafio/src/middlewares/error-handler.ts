import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { HttpError } from '../errors/http-error'

const isDuplicateKeyError = (err: unknown): boolean =>
  typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000

// Se é erro conhecido, retorno com status e mensagem, se nao vira erro generico.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message })
  }

  if (isDuplicateKeyError(err)) {
    return res.status(StatusCodes.CONFLICT).json({ message: 'Name already exists' })
  }

  console.error('[Unhandled error]', err)
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error' })
}
