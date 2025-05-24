import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

export function ToolTipHelpSetting() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"sm"} variant="ghost" className="flex items-center gap-1.5">
            <HelpCircleIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center" className="max-w-[300px]">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Alterar Senha</span> - Para alterar sua senha informe a senha atual e a nova senha que deseja usar.</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
