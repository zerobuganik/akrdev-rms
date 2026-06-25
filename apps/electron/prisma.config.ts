import { defineConfig } from 'prisma/config'
import path from 'path'

const dbPath = process.env.SQLITE_DB_PATH ?? path.join(process.cwd(), 'data', 'local.db')

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `file:${dbPath}`,
  },
})
