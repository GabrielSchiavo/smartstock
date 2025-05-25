"use client";

import { LoginButtonProps } from "@/types";
import { useRouter } from "next/navigation";

export const LoginButton = ({
    children,
    mode = "redirect",
    // asChild
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/auth/login");
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