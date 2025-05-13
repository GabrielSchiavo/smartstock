"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";

interface RoleGateHideComponentProps {
    children: React.ReactNode;
    allowedRole: UserRole;
}

export const RoleGateHideComponent = ({
    children,
    allowedRole
}: RoleGateHideComponentProps) => {
    const role = useCurrentRole();

    if (role !== allowedRole) {
        return (
            <>
            </>
        )
    }

    return (
        <>
            {children}
        </>
    )
}