/*
  Warnings:

  - You are about to drop the `MasterProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_masterProductId_fkey";

-- DropTable
DROP TABLE "public"."MasterProduct";

-- CreateTable
CREATE TABLE "public"."MasterItem" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "baseUnit" "public"."UnitType" NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "group" VARCHAR(50) NOT NULL,
    "subgroup" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterItem_name_baseUnit_idx" ON "public"."MasterItem"("name", "baseUnit");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_masterProductId_fkey" FOREIGN KEY ("masterProductId") REFERENCES "public"."MasterItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
