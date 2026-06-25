import { z } from 'zod'

const envSchema = z.object({
  CLOUD_API_URL: z.string().url().default('https://api.akrdev-rms.example.com/api/v1'),
  LOCAL_API_PORT: z.coerce.number().int().positive().default(3001),
  SQLITE_DB_PATH: z.string().default('./data/local.db'),
  MDNS_SERVICE_NAME: z.string().default('akrdev-rms'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors)
    process.exit(1)
  }
  return result.data
}
