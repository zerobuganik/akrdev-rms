import { z } from 'zod'

export const orderItemSchema = z.object({
  itemId: z.string().uuid(),
  variationId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(999).default(1),
  note: z.string().max(500).optional(),
})

export const cartAddItemSchema = z.object({
  orderId: z.string().uuid(),
  itemId: z.string().uuid(),
  variationId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(999).default(1),
})

export const cartRemoveItemSchema = z.object({
  orderItemId: z.string().uuid(),
})

export const cartUpdateQtySchema = z.object({
  orderItemId: z.string().uuid(),
  quantity: z.number().int().min(1),
})

export const cartUpdateNoteSchema = z.object({
  orderItemId: z.string().uuid(),
  note: z.string().max(500),
})

export const cartOrderNoteSchema = z.object({
  orderId: z.string().uuid(),
  note: z.string().max(500),
})

export const cartGuestCountSchema = z.object({
  orderId: z.string().uuid(),
  guestCount: z.number().int().min(1).max(100),
})

export const cartAssignCustomerSchema = z.object({
  orderId: z.string().uuid(),
  phone: z.string().min(10).max(15),
  name: z.string().max(100).optional(),
})

export const mergeTablesSchema = z.object({
  sourceTableId: z.string().uuid(),
  destTableId: z.string().uuid(),
})

export type CartAddItemInput = z.infer<typeof cartAddItemSchema>
export type CartRemoveItemInput = z.infer<typeof cartRemoveItemSchema>
export type CartUpdateQtyInput = z.infer<typeof cartUpdateQtySchema>
export type CartUpdateNoteInput = z.infer<typeof cartUpdateNoteSchema>
export type CartOrderNoteInput = z.infer<typeof cartOrderNoteSchema>
export type CartGuestCountInput = z.infer<typeof cartGuestCountSchema>
export type CartAssignCustomerInput = z.infer<typeof cartAssignCustomerSchema>
export type MergeTablesInput = z.infer<typeof mergeTablesSchema>
