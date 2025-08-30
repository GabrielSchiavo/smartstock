/*
  Warnings:

  - Changed the type of `baseUnit` on the `MasterProduct` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."UnitBaseType" AS ENUM ('KG', 'UN', 'L');

-- AlterTable
ALTER TABLE "public"."MasterProduct" DROP COLUMN "baseUnit",
ADD COLUMN     "baseUnit" "public"."UnitBaseType" NOT NULL;

-- CreateIndex
CREATE INDEX "MasterProduct_name_baseUnit_idx" ON "public"."MasterProduct"("name", "baseUnit");
