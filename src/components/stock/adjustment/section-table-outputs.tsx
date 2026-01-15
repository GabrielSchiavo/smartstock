import { getStockMovementAdjustments } from "@/actions";
import { ClientDataTableStockMovements } from "@/components/tables/_clients/client-data-table-stock-movements";

export const SectionTablesAdjustments = async ({}) => {
  const stockMovementAdjustments = await getStockMovementAdjustments();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-12 w-full md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Ajustes do Dia</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
            <ClientDataTableStockMovements
              movements={stockMovementAdjustments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
