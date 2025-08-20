/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `subgroup` on the `Product` table. All the data in the column will be lost.
  - Made the column `masterProductId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "category",
DROP COLUMN "group",
DROP COLUMN "subgroup",
ALTER COLUMN "masterProductId" SET NOT NULL;
