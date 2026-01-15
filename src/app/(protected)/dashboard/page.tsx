import { RoleGate } from "@/components/auth/role-gate";
import { SectionCardsDashboard } from "@/components/dashboard/section-cards-dashboard";
import { SectionChartsDashboard } from "@/components/dashboard/section-charts-dashboard";
import { SectionTablesDashboard } from "@/components/dashboard/section-tables-dashboard";
import { ROUTES } from "@/config/routes";
import { UserType } from "@/types";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SmartStock",
  description:
    "Acompanhe as principais métricas do estoque da sua empresa na dashboard.",
  alternates: {
    canonical: `${ROUTES.PAGE_DASHBOARD}`,
  },
};

const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-12">
          <SectionCardsDashboard />
          <SectionChartsDashboard />
          <RoleGate
            isPage={true}
            allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
          >
            <SectionTablesDashboard />
          </RoleGate>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
