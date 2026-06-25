import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_WS_URL: z.string().url().default('http://localhost:3000'),
  VITE_LOCAL_API_URL: z.string().url().optional(),
  VITE_APP_NAME: z.string().default('AKRDev RMS POS'),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(import.meta.env)
  if (!result.success) {
    throw new Error(`Environment validation failed: ${JSON.stringify(result.error.flatten().fieldErrors)}`)
  }
  return result.data
}
