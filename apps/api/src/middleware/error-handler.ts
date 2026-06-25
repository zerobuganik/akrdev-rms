import { Request, Response, NextFunction } from 'express'
import { AppError } from '../lib/errors.js'
import logger from '../lib/logger.js'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn({ message: err.message, statusCode: err.statusCode, path: req.path })
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
      },
    })
    return
  }

  logger.error({ message: err.message, stack: err.stack, path: req.path })

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      statusCode: 500,
    },
  })
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
    },
  })
}
