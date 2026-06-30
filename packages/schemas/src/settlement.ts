import { z } from 'zod'

export const settlementSchema = z.object({
  orderId: z.string().uuid(),
  discountType: z.enum(['Percentage', 'Flat']).optional(),
  discountValue: z.number().min(0).max(100).optional(),
  discountReason: z.string().max(200).optional(),
  payments: z.object({
    cash: z.number().min(0).default(0),
    card: z.number().min(0).default(0),
    upi: z.number().min(0).default(0),
  }),
})

export const paymentUpdateSchema = z.object({
  cash: z.number().min(0).optional(),
  card: z.number().min(0).optional(),
  upi: z.number().min(0).optional(),
})

export type SettleInput = z.infer<typeof settlementSchema>
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>
