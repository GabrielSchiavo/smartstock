/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the column `donor` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Receiver` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Subgroup` table. All the data in the column will be lost.
  - You are about to drop the `Donor` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Group" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "donor",
ADD COLUMN     "supplier" VARCHAR(150);

-- AlterTable
ALTER TABLE "public"."Receiver" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "public"."Subgroup" DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "public"."Donor";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Supplier" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "public"."Supplier"("name");
