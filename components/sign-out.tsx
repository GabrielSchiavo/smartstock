"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignOut = () => {
    return (
        <Button  className="flex items-center gap-2" variant="ghost" size="sm">
            <LogOut />
            Sign Out
        </Button>
    )
}

export { SignOut }