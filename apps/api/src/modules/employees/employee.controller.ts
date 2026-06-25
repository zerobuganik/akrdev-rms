import { Request, Response, NextFunction } from 'express'
import { employeeService } from './employee.service.js'

export const employeeController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await employeeService.findAll()) } catch (err) { next(err) }
  },
  async getById(req: Request, res: Response, next: NextFunction) {
    try { res.json(await employeeService.findById(req.params.id as string)) } catch (err) { next(err) }
  },
  async create(req: Request, res: Response, next: NextFunction) {
    try { res.status(201).json(await employeeService.create(req.body)) } catch (err) { next(err) }
  },
  async update(req: Request, res: Response, next: NextFunction) {
    try { res.json(await employeeService.update(req.params.id as string, req.body)) } catch (err) { next(err) }
  },
  async delete(req: Request, res: Response, next: NextFunction) {
    try { await employeeService.delete(req.params.id as string); res.status(204).send() } catch (err) { next(err) }
  },
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try { res.json(await employeeService.changePassword(req.params.id as string, req.body.password)) } catch (err) { next(err) }
  },
}
