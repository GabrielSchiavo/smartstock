import { Metadata } from "next";
import { UserType } from "@/types";
import { RoleGate } from "@/components/auth/role-gate";
import { ROUTES } from "@/config/routes";
import { FormAddOutput } from "@/components/stock/output/form-add-output";
import { Separator } from "@/components/ui/separator";
import { SectionTablesOutputs } from "@/components/stock/output/section-table-outputs";

export const metadata: Metadata = {
  title: "Saídas - SmartStock",
  description: "Visualize, cadastre e gerencie as Saídas do estoque.",
  alternates: {
    canonical: `${ROUTES.PAGE_STOCK_OUT}`,
  },
};

export default async function OutputPage() {
  return (
    <RoleGate
      isPage={true}
      allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
    >
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg leading-none font-semibold">
                <span className="flex gap-3 items-center">Cadastrar Saída</span>
              </h1>
              <p className="text-muted-foreground text-sm w-full md:max-w-md">
                {
                  "Cadastre as saídas do estoque. Clique em 'Salvar' quando terminar."
                }
              </p>
            </div>
            <FormAddOutput />
            <Separator className="-mx-6 w-auto!" />
            <SectionTablesOutputs />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
