-- DropForeignKey
ALTER TABLE "public"."StockMovement" DROP CONSTRAINT "StockMovement_productId_fkey";

-- AddForeignKey
ALTER TABLE "public"."StockMovement" ADD CONSTRAINT "StockMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
