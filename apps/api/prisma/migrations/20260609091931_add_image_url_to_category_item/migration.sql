-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "dietary_type" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "kitchen_id" UUID;
