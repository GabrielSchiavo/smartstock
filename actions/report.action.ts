"use server";

import { productRepository } from "@/db";
import {
  DateRangeParams,
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
    status = validityStatusType.ABOUT_TO_EXPIRE;
  }

  return { daysUntilExpiry, status };
};

const validateDateRange = ({
  initialDate,
  finalDate,
}: DateRangeParams): { isValid: boolean; error?: string } => {
  if (initialDate > finalDate) {
    return {
      isValid: false,
      error: "Data inicial não pode ser maior que data final",
    };
  }
  return { isValid: true };
};

// Geradores de Relatório
export const generateValidityReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<ValidityReportResponse>> => {
  const validation = validateDateRange({ initialDate, finalDate });
  if (!validation.isValid) return { error: validation.error };

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

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Erro ao gerar relatório de validade:", error);
    return { error: "Erro ao gerar relatório de validade" };
  }
};

export const generateDonationsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<DonationsReportResponse>> => {
  const validation = validateDateRange({ initialDate, finalDate });
  if (!validation.isValid) return { error: validation.error };

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
      donor: product.donor || "Não informado",
      receiptDate: product.receiptDate,
    }));

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Erro ao gerar relatório de doações:", error);
    return { error: "Erro ao gerar relatório de doações" };
  }
};

export const generatePurchasedReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<ReportResponse<PurchasedReportResponse>> => {
  const validation = validateDateRange({ initialDate, finalDate });
  if (!validation.isValid) return { error: validation.error };

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

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Erro ao gerar relatório de compras:", error);
    return { error: "Erro ao gerar relatório de compras" };
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
        group: product.group,
        daysUntilExpiry,
        status,
      };
    });

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Erro ao gerar relatório de inventário:", error);
    return { error: "Erro ao gerar relatório de inventário" };
  }
};
