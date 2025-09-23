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
import {
  clientCheckProductAlerts,
  getAlerts,
  getUnreadAlertsCount,
  markAllAlertsAsRead,
} from "@/actions";
import { AlertItem } from "@/components/alerts/alert-item";
import DeleteAlertsDialog from "@/components/alerts/delete-alerts-dialog";
import { useCallback, useEffect, useState } from "react";
import { useAlertWatcher } from "@/hooks/use-alert-watcher";
import { BasicAlertProps, ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function AlertButton() {
  const [alerts, setAlerts] = useState<BasicAlertProps[]>([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  // Use useCallback para memorizar a função de refresh
  const refreshAlerts = useCallback(async () => {
    try {
      const [alertsData, count] = await Promise.all([
        getAlerts(),
        getUnreadAlertsCount(),
      ]);
      setAlerts(alertsData);
      setUnreadAlertsCount(count);
      return count;
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);
      showToast({
        title: "Erro!",
        description: `Não foi possível carregar os alertas.`,
        type: ToastType.ERROR,
      });
    }
  }, []);

  useEffect(() => {
    clientCheckProductAlerts();
    refreshAlerts();
  }, [refreshAlerts]);

  useAlertWatcher(() => {
    refreshAlerts();
  }, unreadAlertsCount);

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
              <TabsTrigger value="alertsUnread">Não Lidos</TabsTrigger>
              <TabsTrigger value="alertsRead">Lidos</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="alertsUnread" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="grid flex-1 auto-rows-min">
                {alerts.length === 0 ? (
                  <div className="border rounded-xl p-6 shadow">
                    <p className="text-muted-foreground text-sm text-center">
                      Nenhum alerta encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {alerts.filter((alert) => !alert.isRead).length > 0 ? (
                      alerts
                        .filter((alert) => !alert.isRead)
                        .map((alert) => (
                          <AlertItem
                            key={alert.id}
                            alert={alert}
                            onAlertChange={refreshAlerts}
                          />
                        ))
                    ) : (
                      <div className="border rounded-xl p-6 shadow">
                        <p className="text-muted-foreground text-sm text-center">
                          Nenhum alerta encontrado.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="alertsRead" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="grid flex-1 auto-rows-min">
                {alerts.length === 0 ? (
                  <div className="border rounded-xl p-6 shadow">
                    <p className="text-muted-foreground text-sm text-center">
                      Nenhum alerta encontrado.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {alerts.filter((alert) => alert.isRead).length > 0 ? (
                      alerts
                        .filter((alert) => alert.isRead)
                        .map((alert) => (
                          <AlertItem
                            key={alert.id}
                            alert={alert}
                            onAlertChange={refreshAlerts}
                          />
                        ))
                    ) : (
                      <div className="border rounded-xl p-6 shadow">
                        <p className="text-muted-foreground text-sm text-center">
                          Nenhum alerta encontrado.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <SheetFooter className="p-0">
          <div className="flex flex-col gap-3">
            <form onSubmit={handleMarkAllAsRead}>
              <Button
                type="submit"
                variant="outline"
                size={"sm"}
                className="w-full"
              >
                <span className="flex gap-1.5 items-center text-ellipsis!">
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
