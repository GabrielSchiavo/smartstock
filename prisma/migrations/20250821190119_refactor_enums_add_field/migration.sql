/*
  Warnings:

  - The values [ADJUSTMENTS,INPUTS,OUTPUTS] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADJUSTMENTS,INPUTS,OUTPUTS] on the enum `MovementType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."MovementCategoryType" AS ENUM ('PURCHASED', 'DONATED', 'TRANSFER');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ActionType_new" AS ENUM ('CREATE', 'UPDATE', 'DELETE');
ALTER TABLE "public"."AuditLog" ALTER COLUMN "actionType" TYPE "public"."ActionType_new" USING ("actionType"::text::"public"."ActionType_new");
ALTER TYPE "public"."ActionType" RENAME TO "ActionType_old";
ALTER TYPE "public"."ActionType_new" RENAME TO "ActionType";
DROP TYPE "public"."ActionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."MovementType_new" AS ENUM ('INPUT', 'OUTPUT', 'ADJUSTMENT');
ALTER TABLE "public"."StockMovement" ALTER COLUMN "movementType" TYPE "public"."MovementType_new" USING ("movementType"::text::"public"."MovementType_new");
ALTER TYPE "public"."MovementType" RENAME TO "MovementType_old";
ALTER TYPE "public"."MovementType_new" RENAME TO "MovementType";
DROP TYPE "public"."MovementType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."StockMovement" ADD COLUMN     "movementCategory" "public"."MovementCategoryType";
