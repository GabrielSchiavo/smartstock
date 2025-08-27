/*
  Warnings:

  - You are about to drop the column `actionCategory` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `entity` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "actionCategory",
ADD COLUMN     "entity" VARCHAR(30) NOT NULL,
ALTER COLUMN "value" DROP NOT NULL;
