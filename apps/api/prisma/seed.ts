import { PrismaClient } from '../src/generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import * as argon2 from 'argon2'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres:akrdev_rms_dev@localhost:5432/akrdev_rms'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
})

async function main() {
  console.log('Seeding database...')

  const passwordHash = await argon2.hash('admin123')
  const pinHash = await argon2.hash('1234')

  const admin = await prisma.user.upsert({
    where: { phone: '7001181474' },
    update: { passwordHash, pinHash, role: 'Admin', active: true },
    create: {
      name: 'Admin',
      phone: '7001181474',
      passwordHash,
      pinHash,
      role: 'Admin',
      active: true,
    },
  })
  console.log(`Admin user ready: ${admin.name} (${admin.phone})`)

  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      companyName: 'AKRDev Restaurant',
      address: 'Your Restaurant Address',
      phone: '7001181474',
      email: 'info@akrdev-rms.example.com',
      fssai: '',
      gstin: '',
      taxType: 'Inclusive',
    },
  })
  console.log('Store settings created.')

  await prisma.taxSlab.upsert({
    where: { name: 'GST 5%' },
    update: {},
    create: { name: 'GST 5%', percent: 5, isDefault: true, isActive: true },
  })
  console.log('Default tax slab created.')

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
