import { Request, Response, NextFunction } from 'express'
import { authService } from '../../services/auth.service.js'

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, password, pin } = req.body
      if (password) {
        const result = await authService.login(phone, password)
        res.json(result)
      } else if (pin) {
        const result = await authService.loginWithPin(phone, pin)
        res.json(result)
      } else {
        res.status(400).json({ error: { message: 'Provide password or pin', statusCode: 400 } })
      }
    } catch (err) {
      next(err)
    }
  },

  async setPin(req: Request, res: Response, next: NextFunction) {
    try {
      const { pin } = req.body
      const result = await authService.setPin(req.user!.userId, pin)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      const result = await authService.refresh(refreshToken)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body
      await authService.logout(refreshToken, req.user!.userId)
      res.json({ message: 'Logged out successfully' })
    } catch (err) {
      next(err)
    }
  },

  async verifyPin(req: Request, res: Response, next: NextFunction) {
    try {
      const { pin } = req.body
      const isValid = await authService.verifyPin(req.user!.userId, pin)
      res.json({ valid: isValid })
    } catch (err) {
      next(err)
    }
  },

  async checkPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body
      const result = await authService.checkPhone(phone)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.updateProfile(req.user!.userId, req.body)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body
      const result = await authService.changePassword(req.user!.userId, currentPassword, newPassword)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { image } = req.body
      const result = await authService.uploadImage(req.user!.userId, image)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
}
