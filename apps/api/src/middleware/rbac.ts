import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js'

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required')
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`)
    }
    next()
  }
}
