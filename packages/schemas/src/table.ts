import { z } from 'zod'

export const tableSchema = z.object({
  areaId: z.string().uuid().optional(),
  name: z.string().min(1).max(50),
  capacity: z.number().int().min(1).max(20).default(4),
  position: z.number().int().min(0).default(0),
})

export type TableInput = z.infer<typeof tableSchema>
