import { Metadata } from "next";
import { DataTableUsers } from "@/components/data-table/data-table-users";
import { MessageSuccess } from "@/components/message-success";
import { RoleGate } from "@/components/auth/role-gate";
import { getUsers } from "@/actions/user";
import { columnsTableUsers } from "@/components/data-table/_columns/columns-users";
import { UserType } from "@/types";

export const metadata: Metadata = {
  title: "Cadastro de Usuários - SmartStock",
  description: "Vizualize e cadastre os usuários do sistema",
};

export default async function UserRegistrationPage() {
  const users = await getUsers();

  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 pt-4">
              <MessageSuccess message="Você tem permissão para ver este conteúdo!" />
            </div>
            <h1 className="text-base font-medium px-4 lg:px-6">
              Cadastro de Usuários
            </h1>
            <div className="px-4 md:px-6 ">
              <DataTableUsers addButton={true} data={users} columns={columnsTableUsers} />
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
