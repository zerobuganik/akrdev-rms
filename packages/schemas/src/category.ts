import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  defaultTaxPercent: z.number().min(0).max(100).default(0),
  displayOrder: z.number().int().min(0).default(0),
  kitchenId: z.string().uuid().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>
