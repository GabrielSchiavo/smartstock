"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HeaderAuth } from "@/components/auth/header-auth";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <HeaderAuth label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            <CardFooter>
                {backButtonLabel === "" ? <></> : <BackButton label={backButtonLabel} href={backButtonHref}/>}
            </CardFooter>
        </Card>
    );
};