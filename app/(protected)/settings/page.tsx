import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings - SmartStock",
  description: "Vizualize e cadastre os usuários do sistema",
};

export default function SettingsPage() {
  return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h1 className="text-base font-medium px-4 lg:px-6">
              Settings
            </h1>
          </div>
        </div>
      </div>
  );
}
