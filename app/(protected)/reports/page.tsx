import { RoleGate } from "@/components/auth/role-gate";
import { Metadata } from "next";
import { UserType } from "@/types";
import { FormReportsResultView } from "@/components/report/form-reports-result-view";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Relatórios - SmartStock",
  description: "Gere relatórios de estoque.",
  alternates: {
    canonical: `${ROUTES.PAGE_REPORTS}`,
  },
};

export default function ReportsPage() {
  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.REPORT]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg leading-none font-semibold">
                Gerar Relatório
              </h1>
              <p className="text-muted-foreground text-sm">
                {"Clique em 'Gerar Relatório' quando terminar."}
              </p>
            </div>
            <FormReportsResultView />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
