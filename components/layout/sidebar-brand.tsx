"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogoWithText } from "@/components/shared/logo-with-text";
import Link from "next/link";
import { ROUTES } from "@/config/routes";

export function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href={ROUTES.PAGE_DASHBOARD}>
            <LogoWithText
              imageSize="size-6 min-w-6"
              textSize="text-base"
              containerClasses="gap-2! flex-nowrap!"
              containerImageClasses="text-sidebar-primary-foreground flex aspect-square items-center justify-center size-8 rounded-lg"
              containerTextClasses="grid flex-1 text-left text-sm leading-tight"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
