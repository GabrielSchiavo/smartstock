/*
  Warnings:

  - You are about to drop the column `changeSummary` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `newValue` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `recordId` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `actionCategory` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observation` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordChangedId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `actionType` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_masterProductId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StockMovement" DROP CONSTRAINT "StockMovement_productId_fkey";

-- AlterTable
ALTER TABLE "public"."AuditLog" DROP COLUMN "changeSummary",
DROP COLUMN "newValue",
DROP COLUMN "oldValue",
DROP COLUMN "recordId",
ADD COLUMN     "actionCategory" VARCHAR(30) NOT NULL,
ADD COLUMN     "observation" VARCHAR(200) NOT NULL,
ADD COLUMN     "recordChangedId" TEXT NOT NULL,
ADD COLUMN     "value" VARCHAR(150) NOT NULL,
DROP COLUMN "actionType",
ADD COLUMN     "actionType" VARCHAR(30) NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_masterProductId_fkey" FOREIGN KEY ("masterProductId") REFERENCES "public"."MasterProduct"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
