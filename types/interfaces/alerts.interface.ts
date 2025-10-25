import { AlertType, Product } from "@prisma/client";

export interface BasicAlertProps {
  id: string;
  type: AlertType;
  isRead: boolean;
  createdAt: Date;
  product: Product;
}

export interface AlertProps {
  alert: BasicAlertProps;
  key?: string;
}

export interface UseAlertsProps {
  pollingInterval?: number;
  disablePolling?: boolean;
  disableNotifications?: boolean;
}

export interface AlertsStateProps {
  alerts: BasicAlertProps[];
  unreadAlertsCount: number;
  isLoading: boolean;
  error: Error | null;
}