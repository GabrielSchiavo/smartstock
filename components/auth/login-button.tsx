"use client";

import { ROUTES } from "@/routes";
import { LoginButtonProps } from "@/types";
import { useRouter } from "next/navigation";

export const LoginButton = ({
    children,
}: LoginButtonProps) => {
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