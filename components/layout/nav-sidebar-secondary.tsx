"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleGate } from "@/components/auth/role-gate";
import { UserType } from "@/types";
import { ROUTES } from "@/routes";
import { AppleIcon } from "lucide-react";

export function NavSidebarSecondary() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Estoque</SidebarGroupLabel>
        <SidebarMenu>
          <RoleGate
            isPage={false}
            allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Estoque de Alimentos"}
                className={`${pathname === ROUTES.PAGE_STOCKS_FOOD ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCKS_FOOD}>
                  <AppleIcon />
                  <span>Alimentos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGate>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
