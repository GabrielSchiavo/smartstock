"use client";

import { ROUTES } from "@/config/routes";
import { HomeLoginButtonProps } from "@/types";
import { useRouter } from "next/navigation";

export const HomeLoginButton = ({
    children,
}: HomeLoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push(ROUTES.AUTH_LOGIN);
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};