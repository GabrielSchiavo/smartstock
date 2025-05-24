import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

export function ToolTipHelpReportType() {
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
                <p className="text-sm"><span className="font-semibold">Validades</span> - Gera um relatório de um determinado período com todos os produtos com Validade, Lote, Quantidade, status e Dias para Vencer</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Doados</span> - Gera um relatório de um determinado período com todos os produtos doados com Quantidade, Doador e Data de Recebimento</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Comprados</span> - Gera um relatório de um determinado período com todos os produtos comprados com Quantidade e Data de Recebimento</p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm"><span className="font-semibold">Inventário</span> - Gera um relatório de todos os produtos cadastrados no sistema, independente de período, contém Validade, Quantidade, Lote, Tipo, Dias para Vencer e Status</p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
