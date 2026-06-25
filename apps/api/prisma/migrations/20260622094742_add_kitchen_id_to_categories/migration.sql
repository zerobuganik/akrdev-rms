-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "kitchen_id" UUID;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "store_settings" ALTER COLUMN "tax_type" SET DEFAULT 'Exclusive';
