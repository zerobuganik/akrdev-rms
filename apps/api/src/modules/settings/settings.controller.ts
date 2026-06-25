import { Request, Response, NextFunction } from 'express'
import { settingsService } from './settings.service.js'

export const settingsController = {
  async get(_req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.get()
      res.json(settings)
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsService.update(req.body)
      res.json(settings)
    } catch (err) {
      next(err)
    }
  },
}
