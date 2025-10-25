import React from "react";
import { BellIcon, RefreshCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useAlerts } from "@/hooks/use-alerts";
import { Spinner } from "@/components/ui/spinner";

export function AlertsEmpty() {
  const { refreshAlerts } = useAlerts();
  const [isPending, startTransition] = React.useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshAlerts();
    });
  };
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BellIcon />
        </EmptyMedia>
        <EmptyTitle>Sem alertas</EmptyTitle>
        <EmptyDescription>
          Você está por dentro de tudo. Novas notificações aparecerão aqui.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner className="size-4 shrink-0" />
          ) : (
            <RefreshCcwIcon className={"size-4 shrink-0"} />
          )}

          {isPending ? "Atualizando..." : "Atualizar"}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
