import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwt.js'
import { UnauthorizedError } from '../lib/errors.js'
import { prisma } from '../lib/prisma.js'

export interface AuthUser {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header')
  }

  const token = authHeader.slice(7)
  try {
    const payload = verifyAccessToken(token)
    req.user = {
      userId: payload.userId,
      role: payload.role,
    }
  } catch {
    throw new UnauthorizedError('Invalid or expired token')
  }

  // Verify the user still exists in the database (defense against stale/valid JWTs
  // referencing deleted users — e.g. after database reseed or manual user deletion).
  prisma.user
    .findUnique({
      where: { id: req.user.userId },
      select: { id: true, active: true },
    })
    .then((user) => {
      if (!user) throw new UnauthorizedError('User no longer exists')
      if (!user.active) throw new UnauthorizedError('Account deactivated')
      next()
    })
    .catch((err) => {
      if (err instanceof UnauthorizedError) {
        next(err)
        return
      }
      next()
    })
}
