import { RoleGate } from "@/components/auth/role-gate";
import { Metadata } from "next";
import { ReportsFormAndResultView } from "@/components/report/reports-form-and-result-view";
import { UserType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Relatórios - SmartStock",
  description: "Gere relatórios de estoque",
};

export default function ReportsPage() {
  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.REPORT]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h1 className="text-base font-medium px-4 lg:px-6">Relatórios</h1>
            <div className="px-4 md:px-6">
              <ReportsFormAndResultView />
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}