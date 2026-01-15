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
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { markAllAlertsAsRead } from "@/actions";
import { AlertItem } from "@/components/alerts/alert-item";
import DeleteAlertsDialog from "@/components/alerts/delete-alerts-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertsEmpty } from "@/components/alerts/alerts-empty";
import { useAlerts } from "@/hooks/use-alerts";

export function SheetAlertsBtn() {
  const {
    unreadAlerts,
    readAlerts,
    unreadAlertsCount,
    isLoading,
    refreshAlerts,
  } = useAlerts();

  const handleMarkAllAsRead = async (e: React.FormEvent) => {
    e.preventDefault();
    await markAllAlertsAsRead();
    await refreshAlerts();
  };

  return (
    <Sheet>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="cursor-pointer">
              <div className="relative">
                <BellIcon />
                {unreadAlertsCount > 0 && (
                  <Badge className="absolute left-3 bottom-3 h-4 min-w-4 rounded-full px-1 tabular-nums text-xs font-medium">
                    {unreadAlertsCount > 9 ? "9+" : unreadAlertsCount}
                  </Badge>
                )}
              </div>
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Alertas</p>
        </TooltipContent>
      </Tooltip>

      <SheetContent className="flex flex-col gap-6 p-6">
        <SheetHeader className="p-0">
          <SheetTitle>Alertas</SheetTitle>
          <SheetDescription>
            Visualize e gerencie todos os alertas do sistema.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="alertsUnread"
          className="flex flex-col flex-1 gap-3 min-h-0"
        >
          <div className="w-full flex justify-center">
            <TabsList>
              <TabsTrigger value="alertsUnread">
                Não Lidos{" "}
                {unreadAlerts.length > 0 && `(${unreadAlerts.length})`}
              </TabsTrigger>
              <TabsTrigger value="alertsRead">
                Lidos {readAlerts.length > 0 && `(${readAlerts.length})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="alertsUnread" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
              ) : unreadAlerts.length === 0 ? (
                <AlertsEmpty />
              ) : (
                <div className="flex flex-col gap-3">
                  {unreadAlerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onAlertChange={refreshAlerts}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="alertsRead" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
              ) : readAlerts.length === 0 ? (
                <AlertsEmpty />
              ) : (
                <div className="flex flex-col gap-3">
                  {readAlerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onAlertChange={refreshAlerts}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <SheetFooter className="p-0">
          <div className="flex flex-col gap-3">
            <form onSubmit={handleMarkAllAsRead}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="w-full"
                disabled={unreadAlertsCount === 0 || isLoading}
              >
                <span className="flex gap-1.5 items-center text-ellipsis">
                  <CheckCheckIcon className="size-4 shrink-0" />
                  Marcar como lidos
                </span>
              </Button>
            </form>
            <DeleteAlertsDialog onDeleteSuccess={refreshAlerts} />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
