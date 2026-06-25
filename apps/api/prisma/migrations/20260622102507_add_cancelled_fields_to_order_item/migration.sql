-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "cancelled_at" TIMESTAMP(3),
ADD COLUMN     "cancelled_by" UUID;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
