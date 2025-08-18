/*
  Warnings:

  - The primary key for the `MasterItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MasterItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `masterProductId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_masterProductId_fkey";

-- AlterTable
ALTER TABLE "public"."MasterItem" DROP CONSTRAINT "MasterItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MasterItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "masterProductId",
ADD COLUMN     "masterProductId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_masterProductId_fkey" FOREIGN KEY ("masterProductId") REFERENCES "public"."MasterItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
