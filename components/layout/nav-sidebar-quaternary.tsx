"use client";

import * as React from "react";
import { SettingsIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarThemeSelector } from "@/components/layout/sidebar-theme-selector";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarAboutButton } from "@/components/layout/sidebar-about-button";
import { ROUTES } from "@/config/routes";

export function NavSidebarQuaternary() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarThemeSelector></SidebarThemeSelector>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={"Configurações"}
              className={`${pathname === ROUTES.PAGE_SETTINGS ? "min-w-8 bg-primary text-primary-foreground font-medium duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
            >
              <Link href={ROUTES.PAGE_SETTINGS}>
                <SettingsIcon />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarAboutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
