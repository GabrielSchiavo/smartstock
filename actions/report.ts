"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ValidityReport = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lot: string;
  validityDate: Date;
  daysUntilExpiry: number;
  status: "valid" | "expired" | "about_to_expire";
};

export const generateValidityReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<{ data?: ValidityReport[]; error?: string }> => {
  try {
    // Validar datas
    if (initialDate > finalDate) {
      return { error: "Data inicial não pode ser maior que data final" };
    }

    const products = await db.product.findMany({
      where: {
        validityDate: {
          gte: initialDate,
          lte: finalDate,
        },
      },
      orderBy: {
        validityDate: "asc",
      },
    });

    // Processar dados para o relatório
    const reportData = products.map((product) => {
      const today = new Date();
      const validityDate = new Date(product.validityDate);
      const timeDiff = validityDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let status: "valid" | "expired" | "about_to_expire" = "valid";
      if (daysUntilExpiry <= 0) {
        status = "expired";
      } else if (daysUntilExpiry <= 30) {
        status = "about_to_expire";
      }

      return {
        ...product,
        daysUntilExpiry,
        status,
      };
    });

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Error generating validity report:", error);
    return { error: "Erro ao gerar relatório" };
  }
};

export type DonationsReport = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  donor: string;
  receiptDate: Date;
};

export const generateDonationsReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<{ data?: DonationsReport[]; error?: string }> => {
  try {
    if (initialDate > finalDate) {
      return { error: "Data inicial não pode ser maior que data final" };
    }

    const products = await db.product.findMany({
      where: {
        AND: [
          { productType: "DONATED" },
          { receiptDate: { gte: initialDate, lte: finalDate } },
        ],
      },
      orderBy: {
        receiptDate: "asc",
      },
    });

    const reportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      donor: product.donor || "Não informado",
      receiptDate: product.receiptDate,
    }));

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Error generating donations report:", error);
    return { error: "Erro ao gerar relatório de doações" };
  }
};

export type PurchasedReport = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  receiptDate: Date;
};

export const generatePurchasedReport = async (
  initialDate: Date,
  finalDate: Date
): Promise<{ data?: PurchasedReport[]; error?: string }> => {
  try {
    if (initialDate > finalDate) {
      return { error: "Data inicial não pode ser maior que data final" };
    }

    const products = await db.product.findMany({
      where: {
        productType: "PURCHASED",
        receiptDate: {
          gte: initialDate,
          lte: finalDate,
        },
      },
      orderBy: {
        receiptDate: "asc",
      },
    });

    const reportData = products.map((product) => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      receiptDate: product.receiptDate,
    }));

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Error generating purchased report:", error);
    return { error: "Erro ao gerar relatório de compras" };
  }
};

// Adicione este tipo no arquivo report.ts
export type InventoryReport = {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  lot: string;
  validityDate: Date;
  productType: "PURCHASED" | "DONATED";
  daysUntilExpiry: number;
  status: "valid" | "expired" | "about_to_expire";
};

// Adicione esta função no arquivo report.ts
export const generateInventoryReport = async (): Promise<{ 
  data?: InventoryReport[]; 
  error?: string 
}> => {
  try {
    const products = await db.product.findMany({
      orderBy: {
        validityDate: "asc",
      },
    });

    // Processar dados para o relatório
    const reportData = products.map((product) => {
      const today = new Date();
      const validityDate = new Date(product.validityDate);
      const timeDiff = validityDate.getTime() - today.getTime();
      const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

      let status: "valid" | "expired" | "about_to_expire" = "valid";
      if (daysUntilExpiry <= 0) {
        status = "expired";
      } else if (daysUntilExpiry <= 30) {
        status = "about_to_expire";
      }

      return {
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        unit: product.unit,
        lot: product.lot,
        validityDate: product.validityDate,
        productType: product.productType,
        daysUntilExpiry,
        status,
      };
    });

    revalidatePath("/reports");
    return { data: reportData };
  } catch (error) {
    console.error("Error generating inventory report:", error);
    return { error: "Erro ao gerar relatório de inventário" };
  }
};