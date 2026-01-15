"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { MessageError } from "@/components/utils/message-error";
import { RoleGateProps } from "@/types";

export const RoleGate = ({
    children,
    allowedRoles,
    isPage
}: RoleGateProps) => {
    const role = useCurrentRole();

    if (!role || !allowedRoles.includes(role)) {
        if (isPage === true) {
            return (
                <MessageError message="Você não tem permissão para acessar este conteúdo!" />
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