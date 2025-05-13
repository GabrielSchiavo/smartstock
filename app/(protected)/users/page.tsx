import { Metadata } from "next";
import { DataTableUsers } from "@/components/data-table-users";
import { FormSuccess } from "@/components/form-success";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

export const metadata: Metadata = {
  title: "Cadastro de Usuários - SmartStock",
  description: "Vizualize e cadastre os usuários do sistema",
};

export default function UserRegistrationPage() {
  return (
    <RoleGate allowedRole={UserRole.ADMIN}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 pt-4">
              <FormSuccess message="You are allowed to see this content!" />
            </div>
            <h1 className="text-base font-medium px-4 lg:px-6">
              Cadastro de Usuários
            </h1>
            <DataTableUsers />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
