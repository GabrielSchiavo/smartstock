import { getExpiredProducts, getProductsToExpire } from "@/actions/product";
import { columnsTableProducts } from "../data-table/_columns/columns-products";
import { DataTableProducts } from "../data-table/data-table-products";

export async function SectionDataTables() {
  const productsToExpire = await getProductsToExpire();
  const expiredProducts = await getExpiredProducts();

  return (
    <div className="grid flex-row grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-6">
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-base font-medium">Produtos à vencer</h2>
        <DataTableProducts addButton={false} data={productsToExpire} columns={columnsTableProducts} />
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="text-base font-medium">Produtos vencidos</h2>
        <DataTableProducts addButton={false} data={expiredProducts} columns={columnsTableProducts} />
      </div>
    </div>
  );
}
