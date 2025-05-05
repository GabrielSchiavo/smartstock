import { Metadata } from "next";
import { DataTableUsers } from "@/components/data-table-users";

export const metadata: Metadata = {
  title: "Cadastro de Usuários - SmartStock",
  description: "Vizualize e cadastre os usuários do sistema",
};

export default function UserRegistrationPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-base font-medium px-4 lg:px-6">Cadastro de Usuários</h1>
          <DataTableUsers />
        </div>
      </div>
    </div>
  );
}
