import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { FormAddAdjustment } from "@/components/stock/adjustment/form-add-adjustment";

export const metadata: Metadata = {
  title: "Ajustes - SmartStock",
  description: "Faça os ajustes de estoque necessários.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK_ADJUSTMENT}`,
  },
};

export default async function AdjustmentPage() {
  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg leading-none font-semibold">
                <span className="flex gap-3 items-center">
                  Ajuste de Estoque
                </span>
              </h1>
              <p className="text-muted-foreground text-sm w-full md:max-w-md">
                {"Faça ajustes positivos ou negativos no estoque. Clique em 'Salvar' quando terminar."}
              </p>
            </div>
            <FormAddAdjustment />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
