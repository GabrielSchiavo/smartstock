"use client";

import * as React from "react";

import { NavSidebarPrimary } from "@/components/layout/nav-sidebar-primary";
import { SidebarUserMenu } from "@/components/layout/sidebar-user-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavSidebarQuaternary } from "@/components/layout/nav-sidebar-quaternary";
import { NavSidebarSecondary } from "@/components/layout/nav-sidebar-secondary";
import { NavSidebarTertiary } from "@/components/layout/nav-sidebar-tertiary";
import { SidebarBrand } from "@/components/layout/sidebar-brand";

export function SidebarMain({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-0!">
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden overflow-y-auto">
        <NavSidebarPrimary />
        <NavSidebarSecondary />
        <NavSidebarTertiary />
        <NavSidebarQuaternary />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
