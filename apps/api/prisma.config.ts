import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:akrdev_rms_dev@localhost:5432/akrdev_rms',
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL ?? 'postgresql://postgres:akrdev_rms_dev@localhost:5432/akrdev_rms_shadow',
  },
  migrations: {
    seed: 'tsx ./prisma/seed.ts',
  },
})
