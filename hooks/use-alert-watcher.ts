// hooks/useAlertWatcher.ts
"use client";

import { useEffect, useRef } from "react";
import { getUnreadAlertsCount } from "@/actions";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";

export function useAlertWatcher(
  onNewAlert?: () => void,
  initialUnreadCount?: number,
  interval = 60 * 60 * 1000 // Executa a cada 1 hora (em milissegundos)
) {
  const prevCountRef = useRef(initialUnreadCount || 0);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Verifica se é um carregamento inicial real (não há marcação no sessionStorage)
    const isRealInitialLoad = !sessionStorage.getItem(
      "alertWatcherInitialized"
    );

    const checkForNewAlerts = async () => {
      try {
        const currentCount = await getUnreadAlertsCount();

        // Comportamento na carga inicial da página
        if (isInitialLoad.current && isRealInitialLoad) {
          if (currentCount > 0) {
            showToast({
              title: "Alertas Pendentes",
              description: `Você tem ${currentCount} alerta(s) não lido(s)`,
              type: ToastType.INFO,
            });
          }
          // Marca que o carregamento inicial já ocorreu
          sessionStorage.setItem("alertWatcherInitialized", "true");
          isInitialLoad.current = false;
          prevCountRef.current = currentCount;
          return;
        }
        // Comportamento para navegações subsequentes
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          prevCountRef.current = currentCount;
          return;
        }

        // Comportamento para novos alertas
        if (currentCount > prevCountRef.current) {
          const newAlertsCount = currentCount - prevCountRef.current;
          showToast({
            title: "Novo Alerta!",
            description: `Você tem ${newAlertsCount} novo(s) alerta(s)`,
            type: ToastType.INFO,
          });
          onNewAlert?.();
        }

        prevCountRef.current = currentCount;
      } catch (error) {
        console.error("Erro ao verificar alertas:", error);
        showToast({
          title: "Erro!",
          description: `Não foi possível verificar os alertas.`,
          type: ToastType.ERROR,
        });
      }
    };

    const intervalId = setInterval(checkForNewAlerts, interval);
    checkForNewAlerts(); // Executa imediatamente

    return () => clearInterval(intervalId);
  }, [interval, onNewAlert, initialUnreadCount]);
}
