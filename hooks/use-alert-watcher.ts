"use client";

import { useEffect, useRef } from "react";
import { getUnreadAlertsCount } from "@/actions";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";

export function useAlertWatcher(
  onNewAlert?: () => void,
  initialUnreadCount = 0,
  interval = 60 * 60 * 1000
) {
  const prevCount = useRef<number>(initialUnreadCount);
  const hasInitialized = useRef<boolean>(false);
  const callbackRef = useRef(onNewAlert);
  const isChecking = useRef<boolean>(false);

  // Mantém o último onNewAlert sem re-inscrever o efeito
  useEffect(() => {
    callbackRef.current = onNewAlert;
  }, [onNewAlert]);

  useEffect(() => {
    const storageKey = "alertWatcherInitialized";
    let timerId: number | null = null;

    const checkForNewAlerts = async () => {
      if (!document || document.visibilityState !== "visible") {
        // se aba estiver oculta, aborta
        return;
      }
      if (isChecking.current) return; // previne sobreposição de chamadas
      isChecking.current = true;
      try {
        const current = await getUnreadAlertsCount();

        // primeira carga real nesta aba
        if (!hasInitialized.current && !sessionStorage.getItem(storageKey)) {
          if (current > 0) {
            showToast({
              title: "Alertas Pendentes",
              description: `Você tem ${current} alerta(s) não lido(s)`,
              type: ToastType.INFO,
            });
          }
          sessionStorage.setItem(storageKey, "true");
          prevCount.current = current;
          hasInitialized.current = true;
          return;
        }

        // primeira montagem após hidratação
        if (!hasInitialized.current) {
          prevCount.current = current;
          hasInitialized.current = true;
          return;
        }

        // novos alertas chegaram
        if (current > prevCount.current) {
          const diff = current - prevCount.current;
          showToast({
            title: "Novo Alerta!",
            description: `Você tem ${diff} novo(s) alerta(s)`,
            type: ToastType.INFO,
          });
          callbackRef.current?.();
        }

        prevCount.current = current;
      } catch (err) {
        console.error("Erro ao verificar alertas:", err);
        // só exibe o erro uma vez, ou faz throttling:
        if (!sessionStorage.getItem("alertWatcherErrShown")) {
          sessionStorage.setItem("alertWatcherErrShown", "true");
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

    // faça imediatamente + polling
    // const intervalId = setInterval(checkForNewAlerts, interval);
    // checkForNewAlerts();

    // return () => clearInterval(intervalId);

    // dispara imediatamente e agenda intervalo
    const startPolling = () => {
      checkForNewAlerts();
      timerId = window.setInterval(checkForNewAlerts, interval);
    };
    const stopPolling = () => {
      if (timerId != null) window.clearInterval(timerId);
      timerId = null;
    };

    // listener de visibilidade
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    // inicia polling apenas se a aba já estiver visível
    if (document.visibilityState === "visible") {
      startPolling();
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopPolling();
    };
  }, [interval, initialUnreadCount]);
}

export const clearSessionStorage = () => {
  sessionStorage.removeItem("alertWatcherInitialized");
  sessionStorage.removeItem("alertWatcherErrShown");
};
