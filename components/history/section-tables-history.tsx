import {
  getAuditLogsAdjustment,
  getAuditLogsInputOutput,
  getAuditLogsSeveral,
} from "@/actions";
import { ClientHistory } from "@/components/history/client-history";
import { RoleGate } from "@/components/auth/role-gate";
import { UserType } from "@/types";

export const SectionTablesHistory = async ({}) => {
  const auditLogsInputOutput = await getAuditLogsInputOutput();
  const auditLogsAdjustment = await getAuditLogsAdjustment();
  const auditLogsSeveral = await getAuditLogsSeveral();

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col gap-12 w-full md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Entradas & Saídas</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
            <ClientHistory history={auditLogsInputOutput} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Ajustes</h1>
          </div>
          <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
            <ClientHistory history={auditLogsAdjustment} />
          </div>
        </div>
        <RoleGate isPage={false} allowedRoles={[UserType.ADMIN]}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-md font-medium">Histórico Diverso</h1>
            </div>
            <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
              <ClientHistory history={auditLogsSeveral} />
            </div>
          </div>
        </RoleGate>
      </div>
    </div>
  );
};
