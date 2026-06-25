import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../lib/errors.js'

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required')
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`)
    }
    next()
  }
}
