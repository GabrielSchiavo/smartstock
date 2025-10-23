import { FormSetting } from "@/components/setting/form-setting";
import { ToolTipHelp, TooltipItem } from "@/components/shared/tool-tip-help";
import { ROUTES } from "@/config/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações - SmartStock",
  description: "Altere as configurações da sua conta.",
  alternates: {
    canonical: `${ROUTES.PAGE_SETTINGS}`,
  },
};

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center -mt-[7px]">
              <h1 className="text-lg leading-none font-semibold">
                Editar Configurações da Conta
              </h1>
              <ToolTipHelp>
                <TooltipItem>
                  <p className="text-sm">
                    <span className="font-semibold">Alterar Senha</span> - Para
                    alterar sua senha informe a senha atual e a nova senha que
                    deseja usar.
                  </p>
                </TooltipItem>
              </ToolTipHelp>
            </div>
            <p className="text-muted-foreground text-sm w-full md:max-w-md -mt-[7px]">
              {
                "Edite as informações da sua conta. Clique em 'Salvar' quando terminar."
              }
            </p>
          </div>
          <FormSetting />
        </div>
      </div>
    </div>
  );
}
