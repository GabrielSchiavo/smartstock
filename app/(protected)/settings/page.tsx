import { SettingForm } from "@/components/setting/setting-form";
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
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex justify-center">
            <div className="grid gap-6 border rounded-xl p-10 w-full md:max-w-[650px]">
              <div className="grid gap-2">
                <h2 className="text-lg font-semibold flex items-center">
                  Editar Configurações da Conta
                  <ToolTipHelpSetting />
                </h2>
                <p className="text-muted-foreground text-sm">
                  Edite as informações da sua conta aqui. Clique em Salvar
                  Alterações quando terminar.
                </p>
              </div>
              <SettingForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
