"use client";

import { useEffect, useRef } from "react";
import { clientCheckProductAlerts, getUnreadAlertsCount } from "@/actions";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";

export function useAlertWatcher(
  onNewAlert?: () => void,
  initialUnreadCount = 0,
  interval = 60 * 30 * 1000 // intervalo de 30 minutos em milissegundos
) {
  const prevCount = useRef<number>(initialUnreadCount);
  const hasInitialized = useRef<boolean>(false);
  const callbackRef = useRef(onNewAlert);
  const isChecking = useRef<boolean>(false);

  useEffect(() => {
    callbackRef.current = onNewAlert;
  }, [onNewAlert]);

  useEffect(() => {
    const storageKey = "alertWatcherLastCount";

    const checkForNewAlerts = async () => {
      try {
        const current = await getUnreadAlertsCount();
        const lastCount = Number(sessionStorage.getItem(storageKey)) || 0;

        // Primeira vez que o usuário acessa o site
        if (!hasInitialized.current && lastCount === 0) {
          if (current > 0) {
            showToast({
              title: "Alertas Pendentes",
              description: `Você tem ${current} alerta(s) não lido(s)`,
              type: ToastType.INFO,
            });
          }
          sessionStorage.setItem(storageKey, current.toString());
          prevCount.current = current;
          hasInitialized.current = true;
          return;
        }

        // Recarregamento da página
        if (!hasInitialized.current) {
          if (current > lastCount) {
            const diff = current - lastCount;
            showToast({
              title: "Novo(s) Alerta(s)!",
              description: `Você tem ${diff} novo(s) alerta(s)`,
              type: ToastType.INFO,
            });
          } else {
            showToast({
              title: "Alerta(s) não lido(s)!",
              description: `Você tem ${current} alerta(s) não lido(s)`,
              type: ToastType.INFO,
            });
          }
          prevCount.current = current;
          sessionStorage.setItem(storageKey, current.toString());
          hasInitialized.current = true;
          return;
        }

        // Novos alertas chegaram
        if (current > prevCount.current) {
          const diff = current - prevCount.current;
          showToast({
            title: "Novo(s) Alerta(s)!",
            description: `Você tem ${diff} novo(s) alerta(s)`,
            type: ToastType.INFO,
          });
          callbackRef.current?.();
        }

        prevCount.current = current;
        sessionStorage.setItem(storageKey, current.toString());
      } catch (error) {
        console.error("Erro ao verificar alertas:", error);
        if (!sessionStorage.getItem("alertWatcherErrorShown")) {
          sessionStorage.setItem("alertWatcherErrorShown", "true");
          showToast({
            title: "Erro!",
            description: `Não foi possível verificar os alertas.`,
            type: ToastType.ERROR,
          });
        }
      } finally {
        isChecking.current = false;
      }
    };

    clientCheckProductAlerts();
    checkForNewAlerts();
    const intervalId = setInterval(checkForNewAlerts, interval);

    return () => clearInterval(intervalId);
  }, [interval, initialUnreadCount]);
}

export const clearSessionStorage = () => {
  sessionStorage.removeItem("alertWatcherLastCount");
  sessionStorage.removeItem("alertWatcherErrorShown");
};
