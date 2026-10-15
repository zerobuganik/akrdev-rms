import { prisma } from '../../lib/prisma.js'

export class SettingsService {
  async get() {
    const settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } })
    return settings
  }

  async update(data: Partial<{
    companyName: string
    address: string
    phone: string
    email: string
    website: string
    fssai: string
    gstin: string
    logoUrl: string
    printLogoUrl: string
    headerText: string
    footerText: string
    notePresets: string | null
    taxType: 'Inclusive' | 'Exclusive'
  }>) {
    return prisma.storeSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data, companyName: data.companyName ?? 'Default' },
    })
  }
}

export const settingsService = new SettingsService()
