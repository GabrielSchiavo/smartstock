import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { FormAddInput } from "@/components/stock/input/form-add-input";

export const metadata: Metadata = {
  title: "Entradas - SmartStock",
  description: "Visualize, cadastre e gerencie as Entradas do estoque.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK_IN}`,
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
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg leading-none font-semibold">
                Cadastrar Entrada
              </h1>
              <p className="text-muted-foreground text-sm">
                {"Clique em 'Salvar' quando terminar."}
              </p>
            </div>
            <FormAddInput />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
