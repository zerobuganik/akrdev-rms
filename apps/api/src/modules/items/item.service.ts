import { prisma } from '../../lib/prisma.js'
import { NotFoundError } from '../../lib/errors.js'

export const itemService = {
  async findAll(categoryId?: string) {
    return prisma.item.findMany({
      where: { ...(categoryId ? { categoryId } : {}), deletedAt: null },
      include: { variations: true, category: true },
      orderBy: { createdAt: 'asc' },
    })
  },
  async findById(id: string) {
    const item = await prisma.item.findUnique({ where: { id }, include: { variations: true, category: true } })
    if (!item) throw new NotFoundError('Item')
    return item
  },
  async create(data: Record<string, unknown>) {
    const { id, variations, categoryId, name, shortcode, basePrice, taxOverride, inStock, dietaryType, kitchenId, imageUrl } = data as {
      id?: string; categoryId: string; name: string; shortcode?: string; basePrice: number;
      taxOverride?: number; inStock?: boolean; dietaryType?: string; kitchenId?: string; imageUrl?: string
      variations?: { name: string; priceAdjustment: number }[]
    }
    return prisma.item.create({
      data: {
        ...(id && { id }),
        categoryId,
        name,
        basePrice: basePrice ?? 0,
        ...(shortcode !== undefined && shortcode !== '' && { shortcode }),
        ...(taxOverride !== undefined && { taxOverride }),
        ...(inStock !== undefined && { inStock }),
        ...(dietaryType && { dietaryType }),
        ...(kitchenId && { kitchenId }),
        ...(imageUrl && { imageUrl }),
        variations: variations ? { create: variations } : undefined,
      },
      include: { variations: true },
    })
  },
  async update(id: string, data: Record<string, unknown>) {
    const existing = await prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Item')
    const { categoryId, name, shortcode, basePrice, taxOverride, inStock, dietaryType, kitchenId, imageUrl, variations } = data as {
      categoryId?: string; name?: string; shortcode?: string; basePrice?: number;
      taxOverride?: number; inStock?: boolean; dietaryType?: string; kitchenId?: string; imageUrl?: string | null
      variations?: { id?: string; name: string; priceAdjustment: number }[]
    }
    if (variations !== undefined) {
      // Delete removed variations
      const keepIds = variations.filter(v => v.id).map(v => v.id!)
      if (keepIds.length > 0) {
        await prisma.itemVariation.deleteMany({ where: { itemId: id, id: { notIn: keepIds } } })
      } else {
        await prisma.itemVariation.deleteMany({ where: { itemId: id } })
      }
      // Update existing and create new in a transaction
      await prisma.$transaction(
        variations.map(v =>
          v.id
            ? prisma.itemVariation.update({ where: { id: v.id }, data: { name: v.name, priceAdjustment: v.priceAdjustment } })
            : prisma.itemVariation.create({ data: { name: v.name, priceAdjustment: v.priceAdjustment, itemId: id } })
        )
      )
    }

    // Update item fields
    await prisma.item.update({
      where: { id },
      data: {
        ...(categoryId !== undefined && { categoryId }),
        ...(name !== undefined && { name }),
        ...(shortcode !== undefined && { shortcode }),
        ...(basePrice !== undefined && { basePrice }),
        ...(taxOverride !== undefined && { taxOverride }),
        ...(inStock !== undefined && { inStock }),
        ...(dietaryType !== undefined && { dietaryType }),
        ...(kitchenId !== undefined && { kitchenId }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })

    return prisma.item.findUnique({ where: { id }, include: { variations: true, category: true } })!;
  },
  async delete(id: string) {
    const existing = await prisma.item.findUnique({ where: { id } })
    if (!existing) throw new NotFoundError('Item')
    // Soft-delete to preserve order history
    await prisma.item.update({
      where: { id },
      data: { deletedAt: new Date(), inStock: false },
    })
  },

  async addVariation(itemId: string, data: { name: string; priceAdjustment: number }) {
    return prisma.itemVariation.create({ data: { ...data, itemId } })
  },
  async deleteVariation(id: string) {
    await prisma.itemVariation.delete({ where: { id } })
  },
}
