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
import { ROUTES } from "@/config/routes";
import {
  BoxesIcon,
  PackageIcon,
  PackageMinusIcon,
  PackagePlusIcon,
  WrenchIcon,
} from "lucide-react";

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
                tooltip={"Estoque"}
                className={`${pathname === ROUTES.PAGE_STOCK ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCK}>
                  <BoxesIcon />
                  <span>Estoque</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Produto Mestre"}
                className={`${pathname === ROUTES.PAGE_STOCK_MASTER_PRODUCT ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCK_MASTER_PRODUCT}>
                  <PackageIcon />
                  <span>Produto Mestre</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Entradas"}
                className={`${pathname === ROUTES.PAGE_STOCK_IN ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCK_IN}>
                  <PackagePlusIcon />
                  <span>Entradas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Saídas"}
                className={`${pathname === ROUTES.PAGE_STOCK_OUT ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCK_OUT}>
                  <PackageMinusIcon />
                  <span>Saídas</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={"Ajustes"}
                className={`${pathname === ROUTES.PAGE_STOCK_ADJUSTMENT ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={ROUTES.PAGE_STOCK_ADJUSTMENT}>
                  <WrenchIcon />
                  <span>Ajustes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGate>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
