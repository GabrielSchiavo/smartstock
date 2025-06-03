"use server";

import { revalidatePath } from "next/cache";
import { alertRepository } from "@/db";
import { AlertType } from "@/types";

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

export async function toggleAlertReadStatus(alertId: string) {
  const alert = await alertRepository.getById(alertId);

  if (!alert) {
    return {
      success: false,
      title: "Erro!",
      description: "O alerta solicitado não existe.",
    };
  }

  await alertRepository.toggleReadStatus(alertId, !alert.isRead);

  revalidatePath("/");

  return {
    success: true,
    title: "Sucesso!",
    description: "Status do alerta atualizado com sucesso.",
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
  try {
    await alertRepository.deleteAll();
    revalidatePath("/");

    return {
      success: true,
      title: "Sucesso!",
      description: "Todos os alertas foram excluídos.",
    };
  } catch (error) {
    console.error("Erro ao verificar alertas:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir os alertas.",
    };
  }
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

    return {
      success: true,
      title: "Sucesso!",
      description: "Alertas verificados com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao verificar alertas:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível verificar os alertas.",
    };
  }
}

setInterval(clientCheckProductAlerts, 60 * 60 * 1000); // Verifica alertas a cada hora (em milissegundos)
