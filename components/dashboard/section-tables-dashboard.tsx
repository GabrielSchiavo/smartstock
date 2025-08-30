import { getExpiredProducts, getProductsToExpire } from "@/actions";
import { ClientDataTableProduct } from "@/components/tables/_clients/client-data-table-product";

export async function SectionTablesDashboard() {
  const productsToExpire = await getProductsToExpire();
  const expiredProducts = await getExpiredProducts();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-12 w-full">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-md font-medium">Produtos à vencer</h1>
            </div>
            <div className="flex flex-col gap-6">
              <ClientDataTableProduct
                products={productsToExpire}
                addButton={false}
                groupBy=""
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-md font-medium">Produtos vencidos</h1>
            </div>
            <div className="flex flex-col gap-6">
              <ClientDataTableProduct
                products={expiredProducts}
                addButton={false}
                groupBy=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
