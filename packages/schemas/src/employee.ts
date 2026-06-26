import { z } from 'zod'

export const createEmployeeSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(10).max(15),
  pin: z.string().length(4),
  password: z.string().min(4).max(100),
  role: z.enum(['Admin', 'Cashier', 'Captain']),
})

export const updateEmployeeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  pin: z.string().length(4).optional(),
  role: z.enum(['Admin', 'Cashier', 'Captain']).optional(),
  active: z.boolean().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(4).max(100),
})

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
