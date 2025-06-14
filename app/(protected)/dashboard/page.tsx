import { RoleGate } from "@/components/auth/role-gate";
import { SectionCards } from "@/components/dashboard/section-cards";
import { SectionDataTables } from "@/components/dashboard/section-data-tables";
import { UserType } from "@/types";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SmartStock",
  description:
    "Acompanhe as principais métricas do estoque da sua empresa na dashboard",
};

const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
          <RoleGate
            isPage={true}
            allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
          >
            <SectionDataTables />
          </RoleGate>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
