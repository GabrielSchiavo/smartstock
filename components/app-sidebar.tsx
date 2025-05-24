"use client";

import * as React from "react";
import LogoSmartstock from "@/public/assets/images/logos/smartstock-logo.png";
import {
  HelpCircleIcon,
  SettingsIcon,
  LayoutDashboardIcon,
} from "lucide-react";

import { NavTop } from "@/components/nav-top";
import { UserButton } from "@/components/auth/user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { NavBottom } from "@/components/nav-bottom";
import Image from "next/image";
import { NavMain } from "@/components/nav-main";
import { NavMainSecondary } from "@/components/nav-main-secondary";
import Link from "next/link";

// This is sample data.
const data = {
  navTop: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navMain: [

  ],
  navMainSecondary: [

  ],
  navBottom: [
    {
      label: "Configurações",
      href: "/settings",
      icon: SettingsIcon,
    },
    {
      label: "Obter Ajuda",
      href: "#",
      icon: HelpCircleIcon,
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <Link href="/dashboard">
            <Image
              className="size-5"
              src={LogoSmartstock}
              alt="Logo SmartStock"
            />
            <span className="text-base fontAlbertSans font-extralight">
              <span className="font-semibold">Smart</span>stock
            </span>
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
      <SidebarRail />
    </Sidebar>
  );
}
