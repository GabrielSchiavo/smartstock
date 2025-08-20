/*
  Warnings:

  - You are about to drop the `MasterItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_masterProductId_fkey";

-- DropTable
DROP TABLE "public"."MasterItem";

-- CreateTable
CREATE TABLE "public"."MasterProduct" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "baseUnit" "public"."UnitType" NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "group" VARCHAR(50) NOT NULL,
    "subgroup" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterProduct_name_baseUnit_idx" ON "public"."MasterProduct"("name", "baseUnit");

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_masterProductId_fkey" FOREIGN KEY ("masterProductId") REFERENCES "public"."MasterProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
