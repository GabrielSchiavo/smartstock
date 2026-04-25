'use client';

import * as React from 'react';
import { SettingsIcon } from 'lucide-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SidebarThemeSelector } from '@/components/layout/sidebar-theme-selector';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarAboutButton } from '@/components/layout/sidebar-about-button';
import { ROUTES } from '@/config/routes';

export function NavSidebarQuaternary() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarThemeSelector />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={'Configurações'}
              className={`${pathname === ROUTES.PAGE_SETTINGS ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 font-medium duration-200 ease-linear' : ''}`}
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
