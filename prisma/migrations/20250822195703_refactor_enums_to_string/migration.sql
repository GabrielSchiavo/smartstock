/*
  Warnings:

  - Added the required column `movementCategory` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."StockMovement" ALTER COLUMN "observation" SET DATA TYPE VARCHAR(200),
DROP COLUMN "movementCategory",
ADD COLUMN     "movementCategory" VARCHAR(30) NOT NULL;

-- DropEnum
DROP TYPE "public"."MovementCategoryType";

-- DropEnum
DROP TYPE "public"."MovementType";
