import {
  getAuditLogsAdjustment,
  getAuditLogsInputs,
  getAuditLogsOutputs,
  getAuditLogsSeveral,
} from "@/actions";
import { ClientHistory } from "@/components/history/client-history";

export const SectionTablesHistory = async ({}) => {
  const auditLogsInputs = await getAuditLogsInputs();
  const auditLogsOutputs = await getAuditLogsOutputs();
  const auditLogsAdjustment = await getAuditLogsAdjustment();
  const auditLogsSeveral = await getAuditLogsSeveral();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-12 w-full md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Entradas</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <ClientHistory history={auditLogsInputs} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Saídas</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <ClientHistory history={auditLogsOutputs} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Ajustes</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <ClientHistory history={auditLogsAdjustment} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Diverso</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10">
            <ClientHistory history={auditLogsSeveral} />
          </div>
        </div>
      </div>
    </div>
  );
};
