"use client";

import { logout } from "@/actions";
import { clearAlertsStorage } from "@/hooks/use-alerts";
import { LogoutButtonProps } from "@/types";

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        clearAlertsStorage();
        logout();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};