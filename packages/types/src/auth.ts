import type { User, UserRole } from './user.js'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  userId: string
  role: UserRole
}

export interface LoginResponse extends AuthTokens {
  user: User
  needsPinSetup?: boolean
}
