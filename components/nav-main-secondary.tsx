"use client";

import { Users, type LucideIcon } from "lucide-react";

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
import { UserRole } from "@prisma/client";
import { RoleGateHideComponent } from "@/components/auth/role-gate-hide-component";

export function NavMainSecondary({
  items,
}: {
  items: {
    label: string;
    href: string;
    icon?: LucideIcon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Utilities</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                className={`${pathname === item.href ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <RoleGateHideComponent allowedRole={UserRole.ADMIN}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${pathname === "/users" ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={"/users"}>
                  <Users />
                  <span>User Registration</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGateHideComponent>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
