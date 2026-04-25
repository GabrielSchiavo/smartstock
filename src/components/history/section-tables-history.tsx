import {
  getAuditLogsAdjustment,
  getAuditLogsInputOutput,
  getAuditLogsMiscellaneous,
  getAuditLogsSystem,
} from '@/actions';
import { ClientDataTableHistory } from '@/components/tables/_clients/client-data-table-history';
import { RoleGate } from '@/components/auth/role-gate';
import { FiltersGroupType, UserType } from '@/types';

export const SectionTablesHistory = async ({}) => {
  const auditLogsInputOutput = await getAuditLogsInputOutput();
  const auditLogsAdjustment = await getAuditLogsAdjustment();
  const auditLogsMiscellaneous = await getAuditLogsMiscellaneous();
  const auditLogsSystem = await getAuditLogsSystem();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-12 md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Entradas & Saídas</h1>
          </div>
          <div className="flex flex-col gap-6 rounded-xl border p-10 shadow">
            <ClientDataTableHistory
              history={auditLogsInputOutput}
              filterGroup={FiltersGroupType.INPUTS_OUTPUTS_HISTORY}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-md font-medium">Histórico Ajustes</h1>
          </div>
          <div className="flex flex-col gap-6 rounded-xl border p-10 shadow">
            <ClientDataTableHistory
              history={auditLogsAdjustment}
              filterGroup={FiltersGroupType.ADJUSTMENTS_HISTORY}
            />
          </div>
        </div>
        <RoleGate isPage={false} allowedRoles={[UserType.ADMIN]}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-md font-medium">Histórico Sistema</h1>
            </div>
            <div className="flex flex-col gap-6 rounded-xl border p-10 shadow">
              <ClientDataTableHistory
                history={auditLogsSystem}
                filterGroup={FiltersGroupType.SYSTEM_HISTORY}
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-md font-medium">Histórico Diverso</h1>
            </div>
            <div className="flex flex-col gap-6 rounded-xl border p-10 shadow">
              <ClientDataTableHistory
                history={auditLogsMiscellaneous}
                filterGroup={FiltersGroupType.MISCELLANEOUS_HISTORY}
              />
            </div>
          </div>
        </RoleGate>
      </div>
    </div>
  );
};
