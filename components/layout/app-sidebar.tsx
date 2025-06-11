"use client";

import * as React from "react";
import { SettingsIcon, LayoutDashboardIcon } from "lucide-react";

import { NavTop } from "@/components/layout/nav-top";
import { UserButton } from "@/components/auth/user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavBottom } from "@/components/layout/nav-bottom";
import { NavMain } from "@/components/layout/nav-main";
import { NavMainSecondary } from "@/components/layout/nav-main-secondary";
import Link from "next/link";
import { LogoWithText } from "@/components/shared/logo-with-text";

// This is sample data.
const data = {
  navTop: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navMain: [],
  navMainSecondary: [],
  navBottom: [
    {
      label: "Configurações",
      href: "/settings",
      icon: SettingsIcon,
    },
  ],
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-0!">
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link href="/dashboard">
            <LogoWithText
              imageSize="size-5 min-w-5"
              textSize="text-base"
              containerClasses="justify-around! flex-nowrap!"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavTop items={data.navTop} />
        <NavMain items={data.navMain} />
        <NavMainSecondary items={data.navMainSecondary} />
        <NavBottom items={data.navBottom} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
