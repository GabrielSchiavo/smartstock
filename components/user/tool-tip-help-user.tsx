import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

export function ToolTipHelpUser() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"sm"} variant="ghost" className="flex items-center gap-1.5">
            <HelpCircleIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Admin</span> - acesso total ao sistema e gerenciamento de usuários.</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Padrão</span> - acesso somente a gerenciamento de produtos e relatórios</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Cadastro</span> - acesso somente a gerenciamento de produtos</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Relatório</span> - acesso somente a gerenciamento de relatórios</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
