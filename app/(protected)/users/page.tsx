import { Metadata } from "next";
import { DataTableUsers } from "@/components/tables/data-table-users";
import { MessageSuccess } from "@/components/utils/message-success";
import { RoleGate } from "@/components/auth/role-gate";
import { columnsTableUsers } from "@/components/tables/_columns/columns-users";
import { UserType } from "@/types";
import { getUsers } from "@/actions";

export const metadata: Metadata = {
  title: "Gerenciar Usuários - SmartStock",
  description: "Vizualize e cadastre os usuários do sistema",
};

export default async function UserRegistrationPage() {
  const users = await getUsers();

  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="gap-4 md:gap-6">
              <MessageSuccess message="Você tem permissão para acessar este conteúdo!" />
            </div>
            <div className="gap-4 md:gap-6">
              <DataTableUsers addButton={true} data={users} columns={columnsTableUsers} />
            </div>
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
