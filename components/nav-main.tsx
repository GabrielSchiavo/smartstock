"use client"

import { AppleIcon, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RoleGate } from "@/components/auth/role-gate"
import { UserType } from "@/types"

export function NavMain({
  items,
}: {
  items: {
    label: string
    href: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarGroupLabel>Estoques</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild tooltip={item.label} className={`${pathname === item.href ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}>
              <Link href={item.href}>
                {item.icon && <item.icon />}
                <span>{item.label}</span>
              </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <RoleGate isPage={false} allowedRoles={[UserType.ADMIN, UserType.DEFAULT, UserType.CADASTRE]}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${pathname === "/stocks/food" ? "min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground" : ""}`}
              >
                <Link href={"/stocks/food"}>
                  <AppleIcon />
                  <span>Estoque de Alimentos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </RoleGate>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
