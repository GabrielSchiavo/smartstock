import { ClientHistory } from "@/components/history/client-history";

export const SectionTablesHistory = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-12 w-full md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Entradas</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <ClientHistory
              history={[
                {
                  id: "m5gr84i9",
                  userId: "316",
                  recordChangedId: "545",
                  actionType: "DELETE",
                  actionCategory: "PRODUCT",
                  createdAt: new Date(),
                  observation: "EXCLUSÃO DE PRODUTO",
                  value: "10 KG"
                },
                {
                  id: "mgr84i9",
                  userId: "316",
                  recordChangedId: "545",
                  actionType: "CREATE",
                  actionCategory: "USER",
                  createdAt: new Date(),
                  observation: "EXCLUSÃO DE PRODUTO",
                  value: "10 KG"
                },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Saídas</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <p>Tabela</p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Diverso</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <p>Tabela</p>
          </div>
        </div>
      </div>
    </div>
  );
};
