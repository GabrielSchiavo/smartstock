"use client";

import { ROUTES } from "@/routes";
import { LoginButtonProps } from "@/types";
import { useRouter } from "next/navigation";

export const LoginButton = ({
    children,
    mode = "redirect",
    // asChild
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push(ROUTES.AUTH_LOGIN);
    }

    if(mode === "modal") {
        return (
            <span>
                TODO: Implemets modal
            </span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};