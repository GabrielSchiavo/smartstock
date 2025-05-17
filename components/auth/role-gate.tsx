"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
import { UserRole } from "@prisma/client";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
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
                    <FormError message="You do not have permission to view this content!" />
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