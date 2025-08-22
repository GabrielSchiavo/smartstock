import { getExpiredProducts, getProductsToExpire } from "@/actions";
import { ClientProduct } from "@/components/stock/product/client-product";

export async function SectionDataTables() {
  const productsToExpire = await getProductsToExpire();
  const expiredProducts = await getExpiredProducts();

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
        <h2 className="text-base font-medium">Produtos à vencer</h2>
        <div className="overflow-x-auto scroll-container">
          <ClientProduct products={productsToExpire} addButton={false} groupBy="" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
        <h2 className="text-base font-medium">Produtos vencidos</h2>
        <div className="overflow-x-auto scroll-container">
          <ClientProduct products={expiredProducts} addButton={false} groupBy="" />
        </div>
      </div>
    </div>
  );
}
