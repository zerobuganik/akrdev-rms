import jwt, { type SignOptions } from 'jsonwebtoken'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`FATAL: Required environment variable ${name} is not set`)
    if (process.env.NODE_ENV !== 'test') process.exit(1)
    return ''
  }
  return value
}

const ACCESS_SECRET = requireEnv('JWT_ACCESS_SECRET')
const REFRESH_SECRET = requireEnv('JWT_REFRESH_SECRET')
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY ?? '15m'
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY ?? '7d'

export interface TokenPayload {
  userId: string
  role: string
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY } as SignOptions)
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY } as SignOptions)
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload
}
