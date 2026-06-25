import { Request, Response, NextFunction } from 'express'
import { tableService } from './table.service.js'

export const tableController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const areaId = req.query.areaId as string | undefined
      const tables = areaId ? await tableService.findByArea(areaId) : await tableService.findAll()
      res.json(tables)
    } catch (err) { next(err) }
  },
  async getById(req: Request, res: Response, next: NextFunction) { try { res.json(await tableService.findById(req.params.id as string)) } catch (err) { next(err) } },
  async create(req: Request, res: Response, next: NextFunction) { try { res.status(201).json(await tableService.create(req.body)) } catch (err) { next(err) } },
  async update(req: Request, res: Response, next: NextFunction) { try { res.json(await tableService.update(req.params.id as string, req.body)) } catch (err) { next(err) } },
  async delete(req: Request, res: Response, next: NextFunction) { try { await tableService.delete(req.params.id as string); res.status(204).send() } catch (err) { next(err) } },
}
