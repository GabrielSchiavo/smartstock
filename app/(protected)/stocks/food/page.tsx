import { getProducts } from "@/actions/product";
import { DatatableProducts } from "@/components/datatables/datatable-products";
import { columns } from "@/components/datatables/_interfaces/columns-products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estoque de Alimentos - SmartStock",
  description: "Vizualize e cadastre produtos alimentícios",
};

export default async function StockFoodPage() {
    const products = await getProducts()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-base font-medium px-4 lg:px-6">Estoque de Alimentos</h1>
          <DatatableProducts data={products} columns={columns} />
        </div>
      </div>
    </div>
  );
}
