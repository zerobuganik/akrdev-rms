import { prisma } from '../../lib/prisma.js'

export const customerService = {
  async searchByPhone(phone: string) {
    const customers = await prisma.customer.findMany({
      where: { phone: { contains: phone } },
      take: 10,
    })
    return customers
  },
  async findOrCreate(phone: string, name?: string) {
    let customer = await prisma.customer.findUnique({ where: { phone } })
    if (!customer) {
      customer = await prisma.customer.create({ data: { phone, name } })
    }
    return customer
  },
}
