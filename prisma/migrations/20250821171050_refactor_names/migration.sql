/*
  Warnings:

  - The values [RECEIPTS,ISSUES] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `movementType` on the `StockMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."MovementType" AS ENUM ('ADJUSTMENTS', 'INPUTS', 'OUTPUTS');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActionType_new" AS ENUM ('ADJUSTMENTS', 'INPUTS', 'OUTPUTS', 'CREATE', 'UPDATE', 'DELETE');
ALTER TABLE "public"."AuditLog" ALTER COLUMN "actionType" TYPE "public"."ActionType_new" USING ("actionType"::text::"public"."ActionType_new");
ALTER TYPE "public"."ActionType" RENAME TO "ActionType_old";
ALTER TYPE "public"."ActionType_new" RENAME TO "ActionType";
DROP TYPE "public"."ActionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."StockMovement" DROP COLUMN "movementType",
ADD COLUMN     "movementType" "public"."MovementType" NOT NULL;

-- DropEnum
DROP TYPE "public"."OutputType";

-- CreateIndex
CREATE INDEX "StockMovement_productId_movementType_idx" ON "public"."StockMovement"("productId", "movementType");
