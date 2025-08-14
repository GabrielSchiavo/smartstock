"use client";

import { FileChartLineIcon, UsersIcon } from "lucide-react";

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
import { ROUTES } from "@/config/routes";

export function NavSidebarTertiary() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Utilitários</SidebarGroupLabel>
        <SidebarMenu>
          <RoleGate
            isPage={false}
            allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.REPORT]}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Relatórios"}
                className={`${pathname === ROUTES.PAGE_REPORTS ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_REPORTS}>
                  <FileChartLineIcon />
                  <span>Relatórios</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGate>
          <RoleGate isPage={false} allowedRoles={[UserType.ADMIN]}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Gerenciar Usuários"}
                className={`${pathname === ROUTES.PAGE_USERS ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_USERS}>
                  <UsersIcon />
                  <span>Gerenciar Usuários</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGate>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
