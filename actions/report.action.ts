"use server";

import { productRepository, stockMovementRepository } from "@/db";
import { ROUTES } from "@/config/routes";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  ProductType,
  PurchasedReportResponse,
  ReportResponse,
  StockMovementReportResponse,
  UnitType,
  ValidityReportResponse,
} from "@/types";
import { revalidatePath } from "next/cache";
import { getExpiryInfo } from "@/utils/check-expiry-status";

// Geradores de Relatório
export const generateValidityReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<ValidityReportResponse>> => {
  try {
    const products = await productRepository.findByValidity(
      initialDate,
      finalDate
    );

    const reportData = products.map((product) => {
      const { daysUntilExpiry, status } = getExpiryInfo(
        new Date(product.validityDate)
      );
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unit: product.unit as UnitType,
        unitWeight: product.unitWeight!,
        unitOfUnitWeight: product.unitOfUnitWeight! as UnitType,
        lot: product.lot,
        validityDate: product.validityDate,
        daysUntilExpiry,
        status,
      };
    });

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de validade gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de validade:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de validade.",
    };
  }
};

export const generateDonationsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<DonationsReportResponse>> => {
  try {
    const products = await productRepository.findDonated(
      initialDate,
      finalDate
    );

    const reportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit as UnitType,
      unitWeight: product.unitWeight!,
      unitOfUnitWeight: product.unitOfUnitWeight! as UnitType,
      supplier: product.supplier || "Não informado",
      receiptDate: product.receiptDate,
    }));

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de doações gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de doações:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de doações.",
    };
  }
};

export const generatePurchasedReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<PurchasedReportResponse>> => {
  try {
    const products = await productRepository.findPurchased(
      initialDate,
      finalDate
    );

    const reportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit as UnitType,
      unitWeight: product.unitWeight!,
      unitOfUnitWeight: product.unitOfUnitWeight! as UnitType,
      receiptDate: product.receiptDate,
    }));

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de compras gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de compras:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de compras.",
    };
  }
};

export const generateInventoryReport = async (): Promise<ReportResponse<InventoryReportResponse>> => {
  try {
    const products = await productRepository.findInventory();

    const reportData = products.map((product) => {
      const { daysUntilExpiry, status } = getExpiryInfo(
        new Date(product.validityDate)
      );
      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unit: product.unit as UnitType,
        unitWeight: product.unitWeight!,
        unitOfUnitWeight: product.unitOfUnitWeight! as UnitType,
        lot: product.lot,
        validityDate: product.validityDate,
        productType: product.productType as ProductType,
        group: product.masterProduct.group,
        daysUntilExpiry,
        status,
      };
    });

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de inventário gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de inventário:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de inventário.",
    };
  }
};

export const generateInputsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<StockMovementReportResponse>> => {
  try {
    const inputs = await stockMovementRepository.findInputsByDate(
      initialDate,
      finalDate
    );

    const reportData = inputs.map((data) => ({
      id: data.id,
      productId: data.productId,
      quantity: data.quantity,
      unit: data.unit as UnitType,
      movementType: data.movementType,
      movementCategory: data.movementCategory,
      details: data.details,
      createdAt: data.createdAt,
    }));

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de entradas gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de entradas:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de entradas.",
    };
  }
};

export const generateOutputsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<StockMovementReportResponse>> => {
  try {
    const inputs = await stockMovementRepository.findOutputsByDate(
      initialDate,
      finalDate
    );

    const reportData = inputs.map((data) => ({
      id: data.id,
      productId: data.productId,
      quantity: data.quantity,
      unit: data.unit as UnitType,
      movementType: data.movementType,
      movementCategory: data.movementCategory,
      details: data.details,
      createdAt: data.createdAt,
    }));

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de saídas gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de saídas:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de saídas.",
    };
  }
};

export const generateAdjustmentsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<StockMovementReportResponse>> => {
  try {
    const inputs = await stockMovementRepository.findAdjustmentsByDate(
      initialDate,
      finalDate
    );

    const reportData = inputs.map((data) => ({
      id: data.id,
      productId: data.productId,
      quantity: data.quantity,
      unit: data.unit as UnitType,
      movementType: data.movementType,
      movementCategory: data.movementCategory,
      details: data.details,
      createdAt: data.createdAt,
    }));

    revalidatePath(ROUTES.PAGE_REPORTS);
    return {
      success: true,
      title: "Sucesso!",
      description: "Relatório de ajustes gerado com sucesso.",
      data: reportData,
    };
  } catch (error) {
    console.error("Erro ao gerar relatório de ajustes:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível gerar o relatório de ajustes.",
    };
  }
};
