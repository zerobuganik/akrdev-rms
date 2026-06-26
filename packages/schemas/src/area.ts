import { z } from 'zod'

export const areaSchema = z.object({
  name: z.string().min(1).max(50),
  displayOrder: z.number().int().min(0).default(0),
})

export type AreaInput = z.infer<typeof areaSchema>
