"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react";
import { AlertStyleType, AlertType, ToastType } from "@/types";
import { toggleAlertReadStatus } from "@/actions";
import { AlertProps } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { formatDateOnlyToLocale } from "@/utils/date-utils";
import { daysDefaultUntilExpiry } from "@/utils/check-expiry-status";

export function AlertItem({
  alert,
  onAlertChange,
}: AlertProps & { onAlertChange: () => void }) {
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
          <p>
            O produto <span className="font-bold">{alert.product.name}</span>{" "}
            com <span className="font-bold">ID {alert.product.id}</span> está a{" "}
            <span className="italic underline">
              {daysDefaultUntilExpiry} dia(s)
            </span>{" "}
            do vencimento. Por favor, verifique e tome as medidas necessárias.
          </p>
        );
      case AlertType.EXPIRED:
        return (
          <p>
            O produto de <span className="font-bold">{alert.product.name}</span>{" "}
            com <span className="font-bold">ID {alert.product.id}</span>{" "}
            <span className="italic underline">ultrapassou</span> o prazo de
            validade. Por favor, verifique e tome as medidas necessárias.
          </p>
        );
      case AlertType.OUT_STOCK:
        return (
          <p>
            O produto de <span className="font-bold">{alert.product.name}</span>{" "}
            com <span className="font-bold">ID {alert.product.id}</span> está
            com estoque <span className="italic underline">zerado</span>. Por
            favor, verifique e tome as medidas necessárias.
          </p>
        );
    }
  };

  const getAlertTitle = () => {
    switch (alert.type) {
      case AlertType.EXPIRING:
        return `Aviso! Produto próximo da validade`;
      case AlertType.EXPIRED:
        return `Alerta! Produto ultrapassou a validade`;
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
          className={`hover:border-foreground cursor-pointer text-start rounded-xl ${!alert.isRead && `shadow`}`}
        >
          {alert.type === AlertType.EXPIRED ||
          alert.type === AlertType.OUT_STOCK ? (
            <TriangleAlertIcon />
          ) : (
            <CircleAlertIcon />
          )}
          <AlertTitle>{getAlertTitle()}</AlertTitle>
          <AlertDescription>
            {getAlertMessage()}
            <span className="text-xs italic text-end w-full">
              {getAlertDate()}
            </span>
          </AlertDescription>
        </Alert>
      </button>
    </form>
  );
}
