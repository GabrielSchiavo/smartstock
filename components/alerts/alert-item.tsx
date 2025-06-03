"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import { AlertStyleType, AlertType, LocaleType, ToastType } from "@/types";
import { toggleAlertReadStatus } from "@/actions";
import { AlertProps } from "@/types";
import { showToast } from "@/components/utils/show-toast";

export function AlertItem({ alert }: AlertProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await toggleAlertReadStatus(alert.id);
    showToast({
      title: response.title,
      description: response.description,
      type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
    });
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
            está a 30 dias do vencimento. Por favor, verifique e tome as medidas
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
    }
  };
  const getAlertTitle = () => {
    switch (alert.type) {
      case AlertType.EXPIRING:
        return `Aviso! Produto próximo da validade`;
      case AlertType.EXPIRED:
        return `Alerta! Produto atingiu a validade`;
    }
  };
  const getAlertDate = () => {
    return new Date(alert.createdAt).toLocaleDateString(LocaleType.PT_BR, {
      timeZone: LocaleType.UTC,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="alertId" value={alert.id} />
      <button type="submit" title="Marcar como Lido/Não lido">
        <Alert
          variant={
            alert.type === AlertType.EXPIRING && alert.isRead === true
              ? AlertStyleType.READ
              : alert.type === AlertType.EXPIRED && alert.isRead === true
                ? AlertStyleType.READ
                : alert.isRead === false
                  ? alert.type === AlertType.EXPIRING
                    ? AlertStyleType.DEFAULT
                    : AlertStyleType.DESTRUCTIVE
                  : AlertStyleType.DEFAULT
          }
          className="hover:border-foreground cursor-pointer text-start"
        >
          {alert.type === AlertType.EXPIRED ? (
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
