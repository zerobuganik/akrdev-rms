import { z } from 'zod'

export const loginSchema = z.object({
  phone: z.string().min(10).max(15),
  password: z.string().optional(),
  pin: z.string().length(4).optional(),
}).refine((data) => data.password || data.pin, {
  message: 'Either password or pin is required',
})

export type LoginInput = z.infer<typeof loginSchema>
