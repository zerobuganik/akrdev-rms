import { z } from 'zod'

export const createOrderSchema = z.object({
  tableId: z.string().uuid().optional(),
  tableName: z.string().max(50).optional(),
  guestCount: z.number().int().min(1).max(100).default(2),
  orderType: z.enum(['DineIn', 'Takeaway']).default('DineIn'),
})

export const takeawayOrderSchema = z.object({
  guestCount: z.number().int().min(1).max(100).default(1),
})

export const updateOrderSchema = z.object({
  status: z.enum(['KOT_Sent', 'Ready', 'Bill_Printed', 'Settled']).optional(),
  note: z.string().max(500).optional(),
  guestCount: z.number().int().min(1).max(100).optional(),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type TakeawayOrderInput = z.infer<typeof takeawayOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
