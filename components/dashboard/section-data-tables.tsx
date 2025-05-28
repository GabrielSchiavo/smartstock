import { getExpiredProducts, getProductsToExpire } from "@/actions";
import { columnsTableProducts } from "@/components/tables/_columns/columns-products";
import { DataTableProducts } from "@/components/tables/data-table-products";

export async function SectionDataTables() {
  const productsToExpire = await getProductsToExpire();
  const expiredProducts = await getExpiredProducts();

  return (
    <div className="flex flex-col lg:flex-row gap-4 px-4 sm:px-6">
      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
        <h2 className="text-base font-medium">Produtos à vencer</h2>
        <div className="overflow-x-auto scroll-container">
          <DataTableProducts
            addButton={false}
            data={productsToExpire}
            columns={columnsTableProducts}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 md:gap-4 min-w-0">
        <h2 className="text-base font-medium">Produtos vencidos</h2>
        <div className="overflow-x-auto scroll-container">
          <DataTableProducts
            addButton={false}
            data={expiredProducts}
            columns={columnsTableProducts}
          />
        </div>
      </div>
    </div>
  );
}
