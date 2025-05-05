import { Metadata } from "next";

import { DataTableFoodStock } from "@/components/data-table-food-stock";

export const metadata: Metadata = {
  title: "Estoque de Alimentos - SmartStock",
  description: "Vizualize e cadastre produtos alimentícios",
};

export default function StockFoodPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-base font-medium px-4 lg:px-6">Estoque de Alimentos</h1>
          <DataTableFoodStock />
        </div>
      </div>
    </div>
  );
}
