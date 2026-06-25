-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'Cancelled';

-- DropForeignKey
ALTER TABLE "print_jobs" DROP CONSTRAINT "print_jobs_order_id_fkey";

-- DropForeignKey
ALTER TABLE "print_jobs" DROP CONSTRAINT "print_jobs_printer_id_fkey";

-- DropForeignKey
ALTER TABLE "printer_mappings" DROP CONSTRAINT "printer_mappings_category_id_fkey";

-- DropForeignKey
ALTER TABLE "printer_mappings" DROP CONSTRAINT "printer_mappings_item_id_fkey";

-- DropForeignKey
ALTER TABLE "printer_mappings" DROP CONSTRAINT "printer_mappings_printer_id_fkey";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "default_kot_printer_id";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "kot_printer_override";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "kot_id" UUID;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "display_id" TEXT;

-- AlterTable
ALTER TABLE "store_settings" ADD COLUMN     "print_logo_url" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "password_hash" TEXT;

-- DropTable
DROP TABLE "print_jobs";

-- DropTable
DROP TABLE "printer_groups";

-- DropTable
DROP TABLE "printer_mappings";

-- DropTable
DROP TABLE "printers";

-- DropEnum
DROP TYPE "PrintJobType";

-- DropEnum
DROP TYPE "PrinterStatus";

-- DropEnum
DROP TYPE "PrinterType";

-- CreateTable
CREATE TABLE "tax_slabs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_slabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_counters" (
    "id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_counters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tax_slabs_name_key" ON "tax_slabs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "order_counters_year_key" ON "order_counters"("year");

-- CreateIndex
CREATE UNIQUE INDEX "orders_display_id_key" ON "orders"("display_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_kot_id_fkey" FOREIGN KEY ("kot_id") REFERENCES "kots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
