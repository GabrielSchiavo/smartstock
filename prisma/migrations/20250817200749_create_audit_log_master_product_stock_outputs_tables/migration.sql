/*
  Warnings:

  - Added the required column `masterProductId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ActionType" AS ENUM ('ADJUSTMENTS', 'RECEIPTS', 'ISSUES', 'CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "public"."OutputType" AS ENUM ('ADJUSTMENTS', 'RECEIPTS', 'ISSUES');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "masterProductId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "actionType" "public"."ActionType" NOT NULL,
    "oldValue" VARCHAR(50) NOT NULL,
    "newValue" VARCHAR(50) NOT NULL,
    "changeSummary" VARCHAR(150) NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MasterProduct" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "unit" "public"."UnitType" NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "group" VARCHAR(50) NOT NULL,
    "subgroup" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StockOutputs" (
    "id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" REAL NOT NULL,
    "unit" "public"."UnitType" NOT NULL,
    "outputType" "public"."OutputType" NOT NULL,
    "observation" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockOutputs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterProduct_name_unit_idx" ON "public"."MasterProduct"("name", "unit");

-- CreateIndex
CREATE INDEX "StockOutputs_productId_outputType_idx" ON "public"."StockOutputs"("productId", "outputType");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "public"."PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "public"."User"("id", "email");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "public"."VerificationToken"("token");

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_masterProductId_fkey" FOREIGN KEY ("masterProductId") REFERENCES "public"."MasterProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StockOutputs" ADD CONSTRAINT "StockOutputs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
