"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
import { UserType } from "@/types/index.enums";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserType[];
    isPage: boolean;
}

export const RoleGate = ({
    children,
    allowedRoles,
    isPage
}: RoleGateProps) => {
    const role = useCurrentRole();

    if (!role || !allowedRoles.includes(role)) {
        if (isPage === true) {
            return (
                <div className="px-4 pt-4">
                    <FormError message="Você não tem permissão para visualizar este conteúdo!" />
                </div>
            )
        } else {
            return null
        }
    }

    return (
        <>
            {children}
        </>
    )
}