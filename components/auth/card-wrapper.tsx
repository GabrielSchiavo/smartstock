"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HeaderAuth } from "@/components/auth/header-auth";
import { BackButton } from "@/components/auth/back-button";
import { CardWrapperProps } from "@/types";

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md rounded-xl">
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