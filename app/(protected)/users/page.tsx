import { Metadata } from "next";
import { DataTableUsers } from "@/components/tables/data-table-users";
import { MessageSuccess } from "@/components/utils/message-success";
import { RoleGate } from "@/components/auth/role-gate";
import { columnsTableUsers } from "@/components/tables/_columns/columns-table-users";
import { UserType } from "@/types";
import { getUsers } from "@/actions";
import { ROUTES } from "@/config/routes";

export const metadata: Metadata = {
  title: "Gerenciar Usuários - SmartStock",
  description: "Visualize, cadastre e gerencie os usuários do sistema.",
  alternates: {
    canonical: `${ROUTES.PAGE_USERS}`,
  },
};

export default async function UserPage() {
  const users = await getUsers();

  return (
    <RoleGate isPage={true} allowedRoles={[UserType.ADMIN]}>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3">
              <h1 className="text-lg leading-none font-semibold">
                <span className="flex gap-3 items-center">
                  Gerenciar Usuários
                </span>
              </h1>
              <p className="text-muted-foreground text-sm w-full md:max-w-md">
                {"Visualize e gerencie todos os usuários. Clique em 'Cadastrar' para cadastrar um novo usuário."}
              </p>
              <MessageSuccess message="Você tem permissão para acessar este conteúdo!" />
            </div>
            <DataTableUsers
              addButton={true}
              data={users}
              columns={columnsTableUsers}
            />
          </div>
        </div>
      </div>
    </RoleGate>
  );
}
