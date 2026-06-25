-- DropForeignKey
ALTER TABLE "tables" DROP CONSTRAINT "tables_area_id_fkey";

-- AlterTable
ALTER TABLE "tables" ALTER COLUMN "area_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

