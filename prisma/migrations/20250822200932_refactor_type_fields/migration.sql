/*
  Warnings:

  - Changed the type of `movementType` on the `StockMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."StockMovement" DROP COLUMN "movementType",
ADD COLUMN     "movementType" VARCHAR(30) NOT NULL;

-- CreateIndex
CREATE INDEX "StockMovement_productId_movementType_idx" ON "public"."StockMovement"("productId", "movementType");
