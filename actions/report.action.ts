"use server";

import { productRepository } from "@/db";
import { ROUTES } from "@/config/routes";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  ProductType,
  PurchasedReportResponse,
  ReportResponse,
  UnitType,
  ValidityReportResponse,
  validityStatusType,
} from "@/types";
import { revalidatePath } from "next/cache";

// Utilitários
const calculateExpiryStatus = (
  validityDate: Date
): { daysUntilExpiry: number; status: validityStatusType } => {
  const today = new Date();
  const timeDiff = validityDate.getTime() - today.getTime();
  const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let status: validityStatusType = validityStatusType.VALID;
  if (daysUntilExpiry <= 0) {
    status = validityStatusType.EXPIRED;
  } else if (daysUntilExpiry <= 30) {
    status = validityStatusType.EXPIRING;
  }

  return { daysUntilExpiry, status };
};

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
      const { daysUntilExpiry, status } = calculateExpiryStatus(
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

export const generateInventoryReport = async (): Promise<
  ReportResponse<InventoryReportResponse>
> => {
  try {
    const products = await productRepository.findInventory();

    const reportData = products.map((product) => {
      const { daysUntilExpiry, status } = calculateExpiryStatus(
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
