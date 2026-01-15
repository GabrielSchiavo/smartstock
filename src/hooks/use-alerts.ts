"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import {
  clientCheckProductAlerts,
  getAlerts,
  getUnreadAlertsCount,
} from "@/actions";
import { ToastType } from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { AlertsStateProps, UseAlertsProps } from "@/types";

const STORAGE_KEY = "alertsLastCount";
const ERROR_SHOWN_KEY = "alertsErrorShown";

export function useAlerts(options: UseAlertsProps = {}) {
  const {
    pollingInterval = 5 * 60 * 1000, // 5 minutos
    disablePolling = false,
    disableNotifications = false,
  } = options;

  // Estado consolidado
  const [state, setState] = useState<AlertsStateProps>({
    alerts: [],
    unreadAlertsCount: 0,
    isLoading: true,
    error: null,
  });

  // Refs para controle interno
  const prevCountRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);
  const isCheckingRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);

  // Função para mostrar notificações
  const notify = useCallback(
    (title: string, description: string, type: ToastType = ToastType.INFO) => {
      if (!disableNotifications) {
        showToast({ title, description, type });
      }
    },
    [disableNotifications]
  );

  // Atualizar alertas com tratamento de erro robusto
  const refreshAlerts = useCallback(
    async (showLoadingState = false) => {
      // Prevenir múltiplas chamadas simultâneas
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;

      if (showLoadingState) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
      }

      try {
        const [alertsData, count] = await Promise.all([
          getAlerts(),
          getUnreadAlertsCount(),
        ]);

        // Verificar se o componente ainda está montado
        if (!mountedRef.current) return;

        const lastCount = prevCountRef.current;
        const isFirstLoad = !hasInitializedRef.current;

        // Atualizar estado
        setState({
          alerts: alertsData,
          unreadAlertsCount: count,
          isLoading: false,
          error: null,
        });

        // Lógica de notificações
        if (!disableNotifications) {
          if (isFirstLoad) {
            // Primeira carga
            const storedCount =
              Number(sessionStorage.getItem(STORAGE_KEY)) || 0;

            if (storedCount === 0 && count > 0) {
              // Primeira visita com alertas
              notify(
                "Alertas Pendentes",
                `Você tem ${count} alerta(s) não lido(s)`
              );
            } else if (count > storedCount) {
              // Reload com novos alertas
              const diff = count - storedCount;
              notify(
                "Novo(s) Alerta(s)!",
                `Você tem ${diff} novo(s) alerta(s)`
              );
            } else if (count > 0) {
              // Reload com alertas existentes
              notify(
                "Alerta(s) Não Lido(s)",
                `Você tem ${count} alerta(s) não lido(s)`
              );
            }
            hasInitializedRef.current = true;
          } else if (count > lastCount) {
            // Novos alertas durante a sessão
            const diff = count - lastCount;
            notify("Novo(s) Alerta(s)!", `Você tem ${diff} novo(s) alerta(s)`);
          }
        }

        // Atualizar referências e storage
        prevCountRef.current = count;
        sessionStorage.setItem(STORAGE_KEY, count.toString());
        sessionStorage.removeItem(ERROR_SHOWN_KEY);
      } catch (error) {
        console.error("Erro ao carregar alertas:", error);

        if (!mountedRef.current) return;

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));

        // Mostrar erro apenas uma vez por sessão
        if (!sessionStorage.getItem(ERROR_SHOWN_KEY)) {
          sessionStorage.setItem(ERROR_SHOWN_KEY, "true");
          notify(
            "Erro ao Carregar Alertas",
            "Não foi possível carregar os alertas. Tentaremos novamente.",
            ToastType.ERROR
          );
        }
      } finally {
        isCheckingRef.current = false;
      }
    },
    [disableNotifications, notify]
  );

  // Verificar alertas de produtos na montagem
  useEffect(() => {
    mountedRef.current = true;
    clientCheckProductAlerts();
    refreshAlerts(true);

    return () => {
      mountedRef.current = false;
    };
  }, [refreshAlerts]);

  // Polling periódico
  useEffect(() => {
    if (disablePolling) return;

    const intervalId = setInterval(() => {
      clientCheckProductAlerts();
      refreshAlerts(false);
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [disablePolling, pollingInterval, refreshAlerts]);

  // Computar alertas filtrados (memoizado via useMemo implícito)
  const unreadAlerts = state.alerts.filter((alert) => !alert.isRead);
  const readAlerts = state.alerts.filter((alert) => alert.isRead);

  return {
    // Estado
    alerts: state.alerts,
    unreadAlerts,
    readAlerts,
    unreadAlertsCount: state.unreadAlertsCount,
    isLoading: state.isLoading,
    error: state.error,

    // Ações
    refreshAlerts: () => refreshAlerts(true),
  };
}

// Utilidade para limpar storage (útil em logout)
export const clearAlertsStorage = () => {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(ERROR_SHOWN_KEY);
};
