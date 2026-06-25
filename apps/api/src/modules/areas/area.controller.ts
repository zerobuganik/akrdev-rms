import { Request, Response, NextFunction } from 'express'
import { areaService } from './area.service.js'

export const areaController = {
  async list(_req: Request, res: Response, next: NextFunction) { try { res.json(await areaService.findAll()) } catch (err) { next(err) } },
  async getById(req: Request, res: Response, next: NextFunction) { try { res.json(await areaService.findById(req.params.id as string)) } catch (err) { next(err) } },
  async create(req: Request, res: Response, next: NextFunction) { try { res.status(201).json(await areaService.create(req.body)) } catch (err) { next(err) } },
  async update(req: Request, res: Response, next: NextFunction) { try { res.json(await areaService.update(req.params.id as string, req.body)) } catch (err) { next(err) } },
  async delete(req: Request, res: Response, next: NextFunction) { try { await areaService.delete(req.params.id as string); res.status(204).send() } catch (err) { next(err) } },
}
