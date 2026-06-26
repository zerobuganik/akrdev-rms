import { z } from 'zod'

export const kotSendSchema = z.object({
  orderId: z.string().uuid(),
})

export type KotSendInput = z.infer<typeof kotSendSchema>
