import * as argon2 from 'argon2'
import { prisma } from '../lib/prisma.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt.js'
import { UnauthorizedError, ValidationError } from '../lib/errors.js'
import { NotFoundError } from '../lib/errors.js'
import fs from 'fs'
import path from 'path'

export class AuthService {
  /**
   * Password login — first-time or full authentication.
   */
  async login(phone: string, password: string) {
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) throw new UnauthorizedError('Invalid credentials')

    if (!user.passwordHash) throw new UnauthorizedError('No password set')

    const valid = await argon2.verify(user.passwordHash, password)
    if (!valid) throw new UnauthorizedError('Invalid credentials')

    if (!user.active) throw new UnauthorizedError('Account deactivated')

    const tokens = await this.issueTokens(user.id, user.role)

    return {
      ...tokens,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role, imageUrl: user.imageUrl },
      needsPinSetup: !user.pinHash,
    }
  }

  /**
   * PIN login — quick access for terminal unlock.
   */
  async loginWithPin(phone: string, pin: string) {
    const user = await prisma.user.findUnique({ where: { phone } })
    if (!user) throw new UnauthorizedError('Invalid credentials')

    if (!user.pinHash) throw new UnauthorizedError('PIN not set — use password login')

    const valid = await argon2.verify(user.pinHash, pin)
    if (!valid) throw new UnauthorizedError('Invalid PIN')

    if (!user.active) throw new UnauthorizedError('Account deactivated')

    const tokens = await this.issueTokens(user.id, user.role)

    return {
      ...tokens,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role, imageUrl: user.imageUrl },
    }
  }

  /**
   * Set or update PIN (requires auth).
   */
  async setPin(userId: string, pin: string) {
    if (!/^\d{4}$/.test(pin)) throw new ValidationError('PIN must be exactly 4 digits')

    const hash = await argon2.hash(pin)
    await prisma.user.update({ where: { id: userId }, data: { pinHash: hash } })

    return { message: 'PIN set successfully' }
  }

  private async issueTokens(userId: string, role: string) {
    const payload = { userId, role }
    const accessToken = signAccessToken(payload)
    const refreshToken = signRefreshToken(payload)

    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    await prisma.session.create({ data: { userId } })

    return { accessToken, refreshToken }
  }

  async refresh(token: string) {
    let payload
    try {
      payload = verifyRefreshToken(token)
    } catch {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const storedToken = await prisma.refreshToken.findUnique({ where: { token } })
    if (!storedToken) throw new UnauthorizedError('Token not found')

    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.deleteMany({ where: { id: storedToken.id } })
      throw new UnauthorizedError('Token expired')
    }

    await prisma.refreshToken.deleteMany({ where: { id: storedToken.id } })

    const newRefreshToken = signRefreshToken({ userId: payload.userId, role: payload.role })
    const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role })

    await prisma.refreshToken.create({
      data: {
        userId: payload.userId,
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(refreshToken: string, userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } })
    await prisma.session.updateMany({
      where: { userId, logoutAt: null },
      data: { logoutAt: new Date() },
    })
  }

  async verifyPin(userId: string, pin: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || !user.pinHash) return false
    return argon2.verify(user.pinHash, pin)
  }

  async checkPhone(phone: string) {
    const user = await prisma.user.findUnique({ where: { phone }, select: { id: true } })
    return { exists: !!user }
  }

  async updateProfile(userId: string, data: { name?: string; phone?: string; imageUrl?: string }) {
    if (data.phone) {
      const existing = await prisma.user.findUnique({ where: { phone: data.phone } })
      if (existing && existing.id !== userId) {
        throw new ValidationError('Phone number already in use by another account')
      }
    }

    const updateData: Record<string, unknown> = {}
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, phone: true, role: true, imageUrl: true },
    })

    return user
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('User')

    if (!user.passwordHash) {
      throw new ValidationError('No password set for this account')
    }

    const valid = await argon2.verify(user.passwordHash, currentPassword)
    if (!valid) throw new ValidationError('Current password is incorrect')

    const passwordHash = await argon2.hash(newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })

    return { message: 'Password changed successfully' }
  }

  async uploadImage(userId: string, image: string) {
    const matches = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/)
    if (!matches) throw new ValidationError('Invalid image format. Provide a base64 data URL.')

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { imageUrl: true } })
    if (user?.imageUrl) {
      const oldPath = path.join('public', user.imageUrl)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const ext = matches[1]!
    const data = matches[2]!

    const dir = 'public/uploads'
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    const filename = `avatar-${userId}-${Date.now()}.${ext}`
    fs.writeFileSync(path.join(dir, filename), Buffer.from(data, 'base64'))

    const imageUrl = `/uploads/${filename}`
    await prisma.user.update({ where: { id: userId }, data: { imageUrl } })

    return { imageUrl }
  }
}

export const authService = new AuthService()
