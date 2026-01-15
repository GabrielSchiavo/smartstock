import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

interface ToolTipHelpProps {
  children: React.ReactNode;
}

export function TooltipItem({ children }: ToolTipHelpProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  );
}

export function ToolTipHelp({ children }: ToolTipHelpProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-8! shrink-0"
          >
            <span className="sr-only">Ajuda</span>
            <HelpCircleIcon className="size-4 shrink-0" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="max-w-[300px] flex flex-col gap-3 p-3">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
