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
import DeleteAlertsDialog from "@/components/alerts/delete-alerts-dialog";
import {
  clientCheckProductAlerts,
  getAlerts,
  getUnreadAlertsCount,
  markAllAlertsAsRead,
} from "@/actions";
import { AlertItem } from "@/components/alerts/alert-item";
import { Separator } from "@/components/ui/separator";

export async function AlertButton() {
  const alerts = await getAlerts();
  const unreadAlertsCount = await getUnreadAlertsCount();
  await clientCheckProductAlerts();

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
            {unreadAlertsCount > 0 && (
              <Badge className="absolute left-3 bottom-3 h-4 min-w-4 rounded-full px-1 font-mono tabular-nums text-xs">
                {unreadAlertsCount > 9 ? "9+" : unreadAlertsCount}
              </Badge>
            )}
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
            {alerts.length === 0 ? (
              <p className="w-full text-center text-muted-foreground text-sm">
                Nenhum alerta encontrado!
              </p>
            ) : (
              <>
                <div className="grid gap-1">
                  <span className="text-muted-foreground italic text-sm">
                    Não lidos
                  </span>
                  <Separator />
                </div>
                {alerts.filter((alert) => !alert.isRead).length > 0 ? (
                  alerts
                    .filter((alert) => !alert.isRead)
                    .map((alert) => <AlertItem key={alert.id} alert={alert} />)
                ) : (
                  <p className="w-full text-center text-muted-foreground text-sm">
                    Nenhum alerta não lido!
                  </p>
                )}

                <div className="grid gap-1">
                  <span className="text-muted-foreground italic text-sm">
                    Lidos
                  </span>
                  <Separator />
                </div>
                {alerts.filter((alert) => alert.isRead).length > 0 ? (
                  alerts
                    .filter((alert) => alert.isRead)
                    .map((alert) => <AlertItem key={alert.id} alert={alert} />)
                ) : (
                  <p className="w-full text-center text-muted-foreground text-sm">
                    Nenhum alerta lido!
                  </p>
                )}
              </>
            )}
          </div>
        </ScrollArea>
        <SheetFooter>
          <form action={markAllAlertsAsRead}>
            <Button
              type="submit"
              variant="outline"
              size={"sm"}
              className="w-full"
            >
              <CheckCheckIcon />
              Marcar como lidos
            </Button>
          </form>
          <DeleteAlertsDialog />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
