-- AlterTable
ALTER TABLE "tables" DROP COLUMN "position_x",
DROP COLUMN "position_y",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

