import { z } from 'zod'

export const taxSlabSchema = z.object({
  name: z.string().min(1).max(50),
  percent: z.number().min(0).max(100),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

export type TaxSlabInput = z.infer<typeof taxSlabSchema>
