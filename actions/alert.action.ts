"use server";

import { revalidatePath } from "next/cache";
import { alertRepository } from "@/db";
import { AlertResponse, AlertType } from "@/types";

export async function checkProductAlerts() {
  const products = await alertRepository.findExpiringProducts();

  for (const product of products) {
    const alertType =
      product.validityDate < new Date()
        ? AlertType.EXPIRED
        : AlertType.EXPIRING;

    const existingAlert = await alertRepository.findExisting(
      product.id,
      alertType
    );

    if (!existingAlert) {
      await alertRepository.create(product.id, alertType);
    }
  }
}

export async function toggleAlertReadStatus(
  alertId: string
): Promise<AlertResponse> {
  const alert = await alertRepository.getById(alertId);

  if (!alert) {
    return {
      success: false,
      error: "Alerta não encontrado!",
    };
  }

  await alertRepository.toggleReadStatus(alertId, !alert.isRead);

  revalidatePath("/");

  return {
    success: true,
    message: "Status do alerta atualizado com sucesso",
  };
}

export async function markAlertAsRead(alertId: string) {
  await alertRepository.updateReadStatus(alertId, true);
  revalidatePath("/");
}

export async function markAllAlertsAsRead() {
  await alertRepository.updateAllReadStatus(true);
  revalidatePath("/");
}

export async function deleteAllAlerts() {
  await alertRepository.deleteAll();
  revalidatePath("/");
}

export async function getAlerts() {
  return await alertRepository.getAll();
}

export async function getUnreadAlertsCount() {
  return await alertRepository.unreadCount();
}

export async function clientCheckProductAlerts() {
  "use client";
  try {
    await checkProductAlerts();
  } catch (error) {
    console.error("Falha ao verificar alertas:", error);
  }
}

setInterval(clientCheckProductAlerts, 60 * 60 * 1000); // Verifica alertas a cada hora (em milissegundos)
