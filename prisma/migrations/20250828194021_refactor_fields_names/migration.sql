/*
  Warnings:

  - You are about to drop the column `observation` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `StockMovement` table. All the data in the column will be lost.
  - Added the required column `details` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `StockMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "observation",
DROP COLUMN "value",
ADD COLUMN     "changedValue" VARCHAR(150),
ADD COLUMN     "details" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "public"."StockMovement" DROP COLUMN "observation",
ADD COLUMN     "details" VARCHAR(200) NOT NULL;
