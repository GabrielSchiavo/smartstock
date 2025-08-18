import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Histórico - SmartStock",
  description: "Visualize o histórico completo de alterações do sistema.",
  alternates: {
    canonical: `${ROUTES.PAGE_HISTORY}`,
  },
};

export default async function StockFoodPage() {
  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <h1>Histórico</h1>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
