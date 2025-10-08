"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clientCheckProductAlerts,
  getAlerts,
  getUnreadAlertsCount,
} from "@/actions";
import { useAlertWatcher } from "@/hooks/use-alert-watcher";
import { BasicAlertProps, ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";

export function useAlerts() {
  const [alerts, setAlerts] = useState<BasicAlertProps[]>([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0);

  const refreshAlerts = useCallback(async () => {
    try {
      const [alertsData, count] = await Promise.all([
        getAlerts(),
        getUnreadAlertsCount(),
      ]);
      setAlerts(alertsData);
      setUnreadAlertsCount(count);

      // showToast({
      //   title: "Sucesso!",
      //   description: `Alertas atualizados.`,
      //   type: ToastType.SUCCESS,
      // });
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

  useAlertWatcher(refreshAlerts, unreadAlertsCount);

  return { alerts, unreadAlertsCount, refreshAlerts };
}
