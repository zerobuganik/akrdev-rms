import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma.js'

const LOGGABLE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

const MODEL_MAP: Record<string, { model: string; idField: string }> = {
  areas: { model: 'area', idField: 'id' },
  tables: { model: 'table', idField: 'id' },
  categories: { model: 'category', idField: 'id' },
  items: { model: 'item', idField: 'id' },
  employees: { model: 'employee', idField: 'id' },
  orders: { model: 'order', idField: 'id' },
  settings: { model: 'storeSettings', idField: 'id' },
  customers: { model: 'customer', idField: 'id' },
}

const SINGLE_INSTANCE_MODULES = ['settings']

export function activityLogger(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res)

  res.json = function (body: unknown) {
    if (LOGGABLE_METHODS.includes(req.method) && req.user && res.statusCode < 400) {
      const module = req.path.split('/')[3] ?? 'unknown'

      const log = async () => {
        let oldValue: string | null = null

        try {
          const mapping = MODEL_MAP[module]
          if (mapping && (req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE')) {
            const id = SINGLE_INSTANCE_MODULES.includes(module)
              ? undefined
              : req.params[mapping.idField] ?? req.params.id
            if (id || SINGLE_INSTANCE_MODULES.includes(module)) {
              const model = (prisma as unknown as Record<string, unknown>)[mapping.model] as {
                findUnique?: (args: { where: unknown }) => Promise<unknown>
                findFirst?: (args: { where?: unknown }) => Promise<unknown>
              } | undefined
              if (model?.findUnique && id) {
                const record = await model.findUnique({ where: { id } })
                oldValue = record ? JSON.stringify(record) : null
              } else if (model?.findFirst && SINGLE_INSTANCE_MODULES.includes(module)) {
                const record = await model.findFirst({})
                oldValue = record ? JSON.stringify(record) : null
              }
            }
          }
        } catch {}

        await prisma.activityLog.create({
          data: {
            userId: req.user!.userId,
            module,
            action: req.method,
            oldValue,
            newValue: JSON.stringify(body),
          },
        })
      }

      log().catch(() => {})
    }
    return originalJson(body)
  }

  next()
}
