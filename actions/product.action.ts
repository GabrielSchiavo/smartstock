"use server";

import { CreateInputEditProductSchema } from "@/schemas";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auditLogRepository, productRepository } from "@/db";
import {
  EntityType,
  ActionType,
  ProductCountType,
  ProductOperationResponse,
  ProductWithMasterProductResponse,
  CalculableTotalItemProps,
  TotalAmountByMonthChartResponse,
  ProductsCountByValidityStatusResponse,
} from "@/types";
import { currentUser } from "@/utils/current-session-utils";
import { db } from "@/lib/db";
import { calculateTotals } from "@/utils/calculate-totals";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getIpAddress } from "@/utils/ip-address-utils";

export const editProduct = async (
  id: number,
  values: z.infer<typeof CreateInputEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateInputEditProductSchema.safeParse(values);
  const user = await currentUser();

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { quantity, unitWeight, ...productData } = validatedFields.data;

  try {
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return {
        success: false,
        title: "Erro!",
        description: "Produto não encontrado.",
      };
    }

    const updatedProduct = await db.$transaction(async (tx) => {
      const updatedProduct = await productRepository.update(
        id,
        {
          ...productData,
          quantity: Number(quantity),
          unitWeight: unitWeight ? Number(unitWeight) : null,
          masterProductId: Number(productData.masterProductId),
          updatedAt: new Date(),
        },
        tx
      );

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: updatedProduct.id.toString(),
          actionType: ActionType.UPDATE,
          entity: EntityType.PRODUCT,
          changedValue: updatedProduct.name,
          ipAddress: await getIpAddress(),
          details: `[AUDIT] Action='${ActionType.UPDATE}' | Entity='${EntityType.PRODUCT}' | Record Changed ID='${updatedProduct.id}' | Changed Value='${updatedProduct.name}' | User ID='${user?.id}' | User='${user?.name}' | IP Address='${await getIpAddress()}' | Message='Product '${updatedProduct.name}' Updated' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );

      return updatedProduct;
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto atualizado com sucesso!",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("Erro ao editar o produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível atualizar o produto.",
    };
  }
};

export const deleteProduct = async (id: number) => {
  const user = await currentUser();

  try {
    const product = await productRepository.findById(id);

    await db.$transaction(async (tx) => {
      await productRepository.delete(id, tx);

      await auditLogRepository.create(
        {
          createdAt: new Date(),
          userId: user?.id as string,
          recordChangedId: id.toString(),
          actionType: ActionType.DELETE,
          entity: EntityType.PRODUCT,
          changedValue: product?.name as string,
          ipAddress: await getIpAddress(),
          details: `[AUDIT] Action='${ActionType.DELETE}' | Entity='${EntityType.PRODUCT}' | Record Changed ID='${id.toString()}' | Changed Value='${product?.name}' | User ID='${user?.id}' | User='${user?.name}' | IP Address='${await getIpAddress()}' | Message='Product '${product?.name}' Excluded' | Date Time='${new Date().toISOString()}'`,
        },
        tx
      );
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: `Produto com ID ${id} excluído com sucesso.`,
    };
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível excluir o produto.",
    };
  }
};

export const getProductById = async (
  id: number
): Promise<ProductWithMasterProductResponse> => {
  try {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    return product;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
};

export const getProducts = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export async function getProductsCount(
  type: ProductCountType = ProductCountType.ALL
) {
  try {
    const count = await productRepository.countProducts(type);

    return {
      success: true,
      title: "Sucesso!",
      description: "Contagem bem-sucedida.",
      count,
    };
  } catch (error) {
    console.error("Erro ao contar produtos (%s):", type, error);

    return {
      success: false,
      title: "Erro!",
      description: "Erro na contagem.",
    };
  }
}

export const getExpiredProducts = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findExpired();
  } catch (error) {
    console.error("Erro ao buscar produtos expirados:", error);
    throw error;
  }
};

export const getProductsToExpire = async (): Promise<
  ProductWithMasterProductResponse[]
> => {
  try {
    return await productRepository.findAboutToExpire();
  } catch (error) {
    console.error("Erro ao buscar produtos próximos a expirar:", error);
    throw error;
  }
};

export const getTotalAmountByMonthChart = async (
  year?: number
): Promise<TotalAmountByMonthChartResponse> => {
  try {
    const currentYear = year || new Date().getFullYear();

    // Array com os nomes dos meses em português
    const monthNames = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(currentYear, index, 1);
      const monthName = format(date, "MMMM", { locale: ptBR });
      return monthName.charAt(0).toUpperCase() + monthName.slice(1);
    });

    // Buscar todos os produtos do ano corrente
    const startDate = new Date(currentYear, 0, 1); // 1º de janeiro
    const endDate = new Date(currentYear, 11, 31, 23, 59, 59); // 31 de dezembro

    const products = await productRepository.findAllByReceiptDate(
      startDate,
      endDate
    );

    // Agrupar produtos por mês
    const productsByMonth = products.reduce(
      (acc, product) => {
        const month = new Date(product.receiptDate).getMonth();
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(product);
        return acc;
      },
      {} as Record<number, ProductWithMasterProductResponse[]>
    );

    // Calcular totais para cada mês
    const monthlyTotals = monthNames.map((monthName, index) => {
      const monthProducts = productsByMonth[index] || [];
      const totals = calculateTotals(
        monthProducts as unknown as CalculableTotalItemProps[]
      );

      return {
        month: monthName,
        monthNumber: index + 1,
        totalKg: totals.weight,
        totalL: totals.volume,
        totalUN: totals.units,
      };
    });

    return {
      success: true,
      title: "Sucesso!",
      description: `Totais de ${currentYear} calculados com sucesso.`,
      data: monthlyTotals,
    };
  } catch (error) {
    console.error("Erro ao calcular totais por mês:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível calcular os totais por mês.",
    };
  }
};

export const getProductsCountByValidityStatus =
  async (): Promise<ProductsCountByValidityStatusResponse> => {
    try {
      const productsCount = await productRepository.countProducts();
      const expiredProducts = await productRepository.findExpired();
      const expiringSoonProducts = await productRepository.findAboutToExpire();
      const validCount =
        productsCount - (expiredProducts.length + expiringSoonProducts.length);

      // Retornar dados no formato de array para o RadialBarChart
      const data = [
        {
          status: "expired",
          count: expiredProducts.length,
          fill: "oklch(57.7% 0.245 27.325)",
          // fill: "var(--chart-1)",
        },
        {
          status: "expiringSoon",
          count: expiringSoonProducts.length,
          fill: "oklch(79.5% 0.184 86.047)",
          // fill: "var(--chart-2)",
        },
        {
          status: "valid",
          count: validCount,
          fill: "oklch(62.7% 0.194 149.214)",
          // fill: "var(--chart-3)",
        },
      ];

      return {
        success: true,
        title: "Sucesso!",
        description: "Contagem por status de validade calculada com sucesso.",
        data: data,
      };
    } catch (error) {
      console.error("Erro ao contar produtos por status de validade:", error);
      return {
        success: false,
        title: "Erro!",
        description: "Não foi possível contar produtos por status de validade.",
      };
    }
  };
