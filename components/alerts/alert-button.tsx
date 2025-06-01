"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  BellIcon,
  CheckCheckIcon,
  CircleAlertIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteAlertsDialog from "./delete-alerts-dialog";

export function AlertButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          title="Alertas"
        >
          <div className="relative">
            <BellIcon />
            <Badge className="absolute left-3 bottom-3 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums text-xs">
             4 
            </Badge>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alertas</SheetTitle>
          <SheetDescription>Veja todos os alertas aqui.</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[70vh]">
          <div className="grid flex-1 auto-rows-min gap-6 px-6">
            <Alert
              variant={"default"}
              className="hover:border-foreground cursor-pointer"
            >
              <CircleAlertIcon />
              <AlertTitle>Aviso! Produto próximo da validade</AlertTitle>
              <AlertDescription>
                <span>
                  O produto com <span className="font-bold">ID ...</span> está a
                  30 dias do vencimento. Por favor, verifique e tome as medidas
                  necessárias.
                </span>
              </AlertDescription>
            </Alert>
            <Alert
              variant={"destructive"}
              className="hover:border-foreground cursor-pointer"
            >
              <TriangleAlertIcon />
              <AlertTitle>Alerta! Produto atingiu a validade</AlertTitle>
              <AlertDescription>
                <span>
                  O produto com <span className="font-bold">ID ...</span>{" "}
                  ultrapassou o prazo de validade. Por favor, verifique e tome
                  as medidas necessárias.
                </span>
              </AlertDescription>
            </Alert>
            <Alert
              variant={"read"}
              className="hover:border-foreground cursor-pointer"
            >
              <CircleAlertIcon />
              <AlertTitle>Aviso! Produto próximo da validade</AlertTitle>
              <AlertDescription>
                <span>
                  O produto com <span className="font-bold">ID ...</span> está a
                  30 dias do vencimento. Por favor, verifique e tome as medidas
                  necessárias.
                </span>
              </AlertDescription>
            </Alert>
            <Alert
              variant={"read"}
              className="hover:border-foreground cursor-pointer"
            >
              <TriangleAlertIcon />
              <AlertTitle>Alerta! Produto atingiu a validade</AlertTitle>
              <AlertDescription>
                <span>
                  O produto com <span className="font-bold">ID ...</span>{" "}
                  ultrapassou o prazo de validade. Por favor, verifique e tome
                  as medidas necessárias.
                </span>
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button variant="outline" size={"sm"} className="w-full">
            <CheckCheckIcon />
            Marcar como lidos
          </Button>
          <DeleteAlertsDialog />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
