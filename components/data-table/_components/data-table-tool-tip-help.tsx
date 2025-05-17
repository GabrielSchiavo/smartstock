import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function DataTableToolTipHelp() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size={"sm"} variant="ghost" className="flex items-center gap-1.5">
            <HelpCircle />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
                <span className="size-4.5 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
                <p className="text-sm"><span className="font-semibold">Dentro da Validade</span> - Produto apto para uso/venda.</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="size-4.5 rounded-full bg-yellow-600 dark:bg-yellow-500"></span>
                <p className="text-sm"><span className="font-semibold">Próximo do Vencimento</span> - Validade expira em até 30 dias.</p>
            </div>
            <div className="flex items-center gap-2">
                <span className="size-4.5 rounded-full bg-red-600 dark:bg-red-500"></span>
                <p className="text-sm"><span className="font-semibold">Vencido</span> - Produto fora do prazo de validade.</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
