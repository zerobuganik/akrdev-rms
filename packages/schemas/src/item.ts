import { z } from 'zod'

export const addVariationSchema = z.object({
  name: z.string().min(1).max(50),
  priceAdjustment: z.number().default(0),
})

export const createItemSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(100),
  shortcode: z.string().max(20).optional(),
  basePrice: z.number().min(0),
  taxOverride: z.number().min(0).max(100).optional(),
  inStock: z.boolean().default(true),
  dietaryType: z.string().max(20).optional(),
  kitchenId: z.string().uuid().optional(),
  variations: z.array(addVariationSchema).default([]),
})

export const updateItemSchema = z.object({
  categoryId: z.string().uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  shortcode: z.string().max(20).optional(),
  basePrice: z.number().min(0).optional(),
  taxOverride: z.number().min(0).max(100).optional(),
  inStock: z.boolean().optional(),
  dietaryType: z.string().max(20).optional(),
  kitchenId: z.string().uuid().optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type AddVariationInput = z.infer<typeof addVariationSchema>
