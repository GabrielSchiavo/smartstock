import { getStockMovementInputs } from '@/actions';
import { ClientDataTableStockMovements } from '@/components/tables/_clients/client-data-table-stock-movements';

export const SectionTablesInputs = async ({}) => {
  const stockMovementInputs = await getStockMovementInputs();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-12 md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Entradas do Dia</h1>
          </div>
          <div className="flex flex-col gap-6 rounded-xl border p-10 shadow">
            <ClientDataTableStockMovements movements={stockMovementInputs} />
          </div>
        </div>
      </div>
    </div>
  );
};
