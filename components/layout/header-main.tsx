"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeModeButton } from "@/components/shared/theme-mode-button";
import { AlertButton } from "@/components/alerts/alert-button";
import { pageTitles } from "@/config/routes";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function HeaderMain() {
  const pathname = usePathname();
  const headerTitle = pageTitles[pathname] || "SmartStock";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent>
              <p>Abrir/Fechar Menu</p>
            </TooltipContent>
          </Tooltip>
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium ml-2">{headerTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          <AlertButton />
          <ThemeModeButton />
        </div>
      </div>
    </header>
  );
}
