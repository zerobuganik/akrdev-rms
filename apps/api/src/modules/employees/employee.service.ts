import { prisma } from '../../lib/prisma.js'
import * as argon2 from 'argon2'
import { NotFoundError } from '../../lib/errors.js'

export class EmployeeService {
  async findAll() {
    return prisma.user.findMany({ select: { id: true, name: true, phone: true, role: true, active: true, imageUrl: true, createdAt: true } })
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, phone: true, role: true, active: true, imageUrl: true, createdAt: true } })
    if (!user) throw new NotFoundError('Employee')
    return user
  }

  async create(data: { name: string; phone: string; pin: string; password: string; role: 'Admin' | 'Cashier' | 'Captain' }) {
    const pinHash = await argon2.hash(data.pin)
    const passwordHash = await argon2.hash(data.password)
    return prisma.user.create({
      data: { name: data.name, phone: data.phone, pinHash, passwordHash, role: data.role },
      select: { id: true, name: true, phone: true, role: true, active: true, imageUrl: true },
    })
  }

  async update(id: string, data: { name?: string; phone?: string; pin?: string; password?: string; role?: 'Admin' | 'Cashier' | 'Captain'; active?: boolean }) {
    const updateData: Record<string, unknown> = {}
    if (data.name) updateData.name = data.name
    if (data.phone) updateData.phone = data.phone
    if (data.pin) updateData.pinHash = await argon2.hash(data.pin)
    if (data.password) updateData.passwordHash = await argon2.hash(data.password)
    if (data.role) updateData.role = data.role
    if (data.active !== undefined) updateData.active = data.active

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, phone: true, role: true, active: true, imageUrl: true },
    })
  }

  async delete(id: string) {
    await prisma.user.delete({ where: { id } })
  }

  async changePassword(id: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) throw new NotFoundError('Employee')

    const passwordHash = await argon2.hash(newPassword)
    await prisma.user.update({ where: { id }, data: { passwordHash } })

    return { message: 'Password changed successfully' }
  }
}

export const employeeService = new EmployeeService()
