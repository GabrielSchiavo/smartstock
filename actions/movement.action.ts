"use server";

import { movementRepository, productRepository } from "@/db";
import { CreateProductOutputSchema } from "@/schemas";
import {
  MasterProductOperationResponse,
  MovementType,
  UnitType,
} from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getProductById } from "@/actions/product.action";
import { convertUnit } from "@/lib/unit-conversion";

export const registerOutput = async (
  values: z.infer<typeof CreateProductOutputSchema>
): Promise<MasterProductOperationResponse> => {
  const validatedFields = CreateProductOutputSchema.safeParse(values);

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const {
    productQuantity,
    productUnit,
    lot,
    validityDate,
    ...productOutputData
  } = validatedFields.data;

  try {
    const getProductSelected = await getProductById(
      Number(productOutputData.productId)
    );
    const getUnitProduct = getProductSelected.unit as UnitType;

    if (
      productOutputData.unit === UnitType.UN &&
      getUnitProduct !== UnitType.UN || productOutputData.unit !== UnitType.UN && getUnitProduct === UnitType.UN
    ) {
      return {
        success: false,
        title: "Erro!",
        description: "Unidade de saída inválida.",
      };
    }

    const quantityConverted =
      productOutputData.unit === UnitType.UN && getUnitProduct === UnitType.UN
        ? Number(productOutputData.quantity)
        : convertUnit(
            Number(productOutputData.quantity),
            productOutputData.unit as UnitType,
            getUnitProduct
          );

    const quantityResult = getProductSelected.quantity - quantityConverted;

    if (quantityResult < 0) {
      return {
        success: false,
        title: "Erro!",
        description: "Não há estoque suficiente para realizar a saída.",
      };
    }

    await movementRepository.createOutput({
      ...productOutputData,
      productId: Number(productOutputData.productId),
      quantity: Number(productOutputData.quantity),
      movementType: MovementType.OUTPUT,
      observation: `Produto ${getProductSelected.name}: SAÍDA de ${productOutputData.quantity} ${productOutputData.unit}`,
      createdAt: new Date(),
    });

    await productRepository.updateQuantity({
      id: Number(productOutputData.productId),
      quantity: quantityResult,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Saída cadastrada com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar saída:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar a saída.",
    };
  }
};
