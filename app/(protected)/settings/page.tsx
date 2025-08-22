import { FormSetting } from "@/components/setting/form-setting";
import { ToolTipHelpSetting } from "@/components/setting/tool-tip-help-setting";
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
          <div className="flex flex-col gap-3">
            <h1 className="text-lg leading-none font-semibold">
              <span className="flex gap-3 items-center">
                Editar Configurações da Conta
                <ToolTipHelpSetting />
              </span>
            </h1>
            <p className="text-muted-foreground text-sm w-full md:max-w-md">
              {
                "Edite as informações da sua conta aqui. Clique em 'Salvar' Alterações quando terminar."
              }
            </p>
          </div>
          <FormSetting />
        </div>
      </div>
    </div>
  );
}
