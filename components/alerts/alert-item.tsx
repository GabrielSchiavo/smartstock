"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import { AlertStyleType, AlertType, ToastType } from "@/types";
import { toggleAlertReadStatus } from "@/actions";
import { AlertProps } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { formatDateOnlyToLocale } from "@/utils/date-utils";
import { daysDefaultUntilExpiry } from "@/utils/check-expiry-status";

export function AlertItem({ alert, onAlertChange }: AlertProps & { onAlertChange: () => void }) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await toggleAlertReadStatus(alert.id);
    showToast({
      title: response.title,
      description: response.description,
      type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
    });
    onAlertChange(); // Atualiza apenas o estado local
  };

  const getAlertMessage = () => {
    switch (alert.type) {
      case AlertType.EXPIRING:
        return (
          <>
            O produto{" "}
            <span className="font-bold">
              ID {alert.product.id} {alert.product.name}
            </span>{" "}
            está a {daysDefaultUntilExpiry} dias do vencimento. Por favor, verifique e tome as medidas
            necessárias.
          </>
        );
      case AlertType.EXPIRED:
        return (
          <>
            O produto{" "}
            <span className="font-bold">
              ID {alert.product.id} {alert.product.name}
            </span>{" "}
            ultrapassou o prazo de validade. Por favor, verifique e tome as
            medidas necessárias.
          </>
        );
      case AlertType.OUT_STOCK:
        return (
          <>
            O produto{" "}
            <span className="font-bold">
              ID {alert.product.id} {alert.product.name}
            </span>{" "}
            está com estoque zerado. Por favor, verifique e tome as
            medidas necessárias.
          </>
        );
    }
  };

  const getAlertTitle = () => {
    switch (alert.type) {
      case AlertType.EXPIRING:
        return `Aviso! Produto próximo da validade`;
      case AlertType.EXPIRED:
        return `Alerta! Produto atingiu a validade`;
      case AlertType.OUT_STOCK:
        return `Alerta! Produto com estoque zerado`;
    }
  };

  const getAlertDate = () => {
    return formatDateOnlyToLocale(new Date(alert.createdAt));
  };

  const alertVariant = alert.isRead
    ? AlertStyleType.READ
    : alert.type === AlertType.EXPIRED || alert.type === AlertType.OUT_STOCK
      ? AlertStyleType.DESTRUCTIVE
      : AlertStyleType.DEFAULT;

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="alertId" value={alert.id} />
      <button type="submit" title="Marcar como Lido/Não lido">
        <Alert
          variant={alertVariant}
          className="hover:border-foreground cursor-pointer text-start rounded-xl"
        >
          {alert.type === AlertType.EXPIRED || alert.type === AlertType.OUT_STOCK ? (
            <TriangleAlertIcon />
          ) : (
            <CircleAlertIcon />
          )}
          <AlertTitle>{getAlertTitle()}</AlertTitle>
          <AlertDescription>
            <span>{getAlertMessage()}</span>
            <span className="text-xs italic text-end w-full">
              {getAlertDate()}
            </span>
          </AlertDescription>
        </Alert>
      </button>
    </form>
  );
}
