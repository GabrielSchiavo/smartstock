/*
  Warnings:

  - You are about to drop the column `unit` on the `MasterProduct` table. All the data in the column will be lost.
  - Added the required column `baseUnit` to the `MasterProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."MasterProduct_name_unit_idx";

-- AlterTable
ALTER TABLE "public"."MasterProduct" DROP COLUMN "unit",
ADD COLUMN     "baseUnit" "public"."UnitType" NOT NULL;

-- CreateIndex
CREATE INDEX "MasterProduct_name_baseUnit_idx" ON "public"."MasterProduct"("name", "baseUnit");
