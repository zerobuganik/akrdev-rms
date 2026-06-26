import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { config } from 'dotenv'
import path from 'path'
import { validateEnv } from './env.js'
import logger from './lib/logger.js'
import { errorHandler, notFoundHandler } from './middleware/error-handler.js'
import { rateLimit } from './middleware/rate-limit.js'
import authRoutes from './modules/auth/auth.routes.js'
import settingsRoutes from './modules/settings/settings.routes.js'
import employeeRoutes from './modules/employees/employee.routes.js'
import areaRoutes from './modules/areas/area.routes.js'
import tableRoutes from './modules/tables/table.routes.js'
import categoryRoutes from './modules/categories/category.routes.js'
import itemRoutes from './modules/items/item.routes.js'
import customerRoutes from './modules/customers/customer.routes.js'
import orderRoutes from './modules/orders/order.routes.js'
import cartRoutes from './modules/cart/cart.routes.js'
import kotRoutes from './modules/kot/kot.routes.js'
import settlementRoutes from './modules/settlement/settlement.routes.js'
import activityLogRoutes from './modules/activity-log/activity-log.routes.js'
import taxSlabRoutes from './modules/tax-slabs/tax-slab.routes.js'

config()

validateEnv()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)
app.use(
  cors({
    origin: process.env.CORS_ORIGINS === '*' ? '*' : (process.env.CORS_ORIGINS?.split(',') ?? '*'),
  }),
)
app.use(express.json())
app.use(rateLimit())
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/settings', settingsRoutes)
app.use('/api/v1/employees', employeeRoutes)
app.use('/api/v1/areas', areaRoutes)
app.use('/api/v1/tables', tableRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/items', itemRoutes)
app.use('/api/v1/customers', customerRoutes)
app.use('/api/v1/orders', orderRoutes)
app.use('/api/v1/cart', cartRoutes)
app.use('/api/v1/kot', kotRoutes)
app.use('/api/v1/settlement', settlementRoutes)
app.use('/api/v1/activity-log', activityLogRoutes)
app.use('/api/v1/tax-slabs', taxSlabRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`API server running on http://localhost:${PORT}`)
})
