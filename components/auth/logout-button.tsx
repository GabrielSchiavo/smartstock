"use client";

import { logout } from "@/actions";
import { clearSessionStorage } from "@/hooks/use-alert-watcher";
import { LogoutButtonProps } from "@/types";

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        clearSessionStorage();
        logout();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};