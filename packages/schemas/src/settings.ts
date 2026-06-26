import { z } from 'zod'

export const storeSettingsSchema = z.object({
  companyName: z.string().min(1).max(100).optional(),
  address: z.string().max(200).optional(),
  phone: z.string().max(15).optional(),
  email: z.string().email().max(100).optional(),
  website: z.string().url().max(200).optional(),
  fssai: z.string().max(50).optional(),
  gstin: z.string().max(20).optional(),
  headerText: z.string().max(200).optional(),
  footerText: z.string().max(200).optional(),
  taxType: z.enum(['Inclusive', 'Exclusive']).default('Exclusive'),
})

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>
