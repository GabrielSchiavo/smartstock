"use server";

import {
  auditLogRepository,
  movementRepository,
  productRepository,
} from "@/db";
import { CreateEditProductSchema, CreateProductOutputSchema } from "@/schemas";
import {
  EntityType,
  ActionType,
  MasterProductOperationResponse,
  MovementType,
  UnitType,
  ProductOperationResponse,
} from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getProductById } from "@/actions/product.action";
import { convertUnit } from "@/utils/unit-conversion";
import { currentUser } from "@/lib/auth";

export const registerInput = async (
  values: z.infer<typeof CreateEditProductSchema>
): Promise<ProductOperationResponse> => {
  const validatedFields = CreateEditProductSchema.safeParse(values);
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
    const product = await productRepository.create({
      ...productData,
      quantity: Number(quantity),
      unitWeight: unitWeight ? Number(unitWeight) : null,
      masterProductId: Number(productData.masterProductId),
    });

    // Cria o movimento de estoque após criar o produto
    await movementRepository.createInput({
      productId: product.id,
      quantity: Number(quantity),
      unit: productData.unit,
      movementType: MovementType.INPUT,
      movementCategory: productData.movementCategory,
      observation: `[MOVEMENT] Type=${MovementType.INPUT} | Category=${productData.movementCategory}} | Quantity=${quantity} | Unit=${productData.unit} | Product ID=${product.id} | Date Time='${new Date().toISOString()}'`,
      createdAt: new Date(),
    });

    // Cria o log de entrada após criar o movimento
    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: product.id.toString(),
      actionType: ActionType.CREATE,
      entity: EntityType.INPUT,
      value: `${product.quantity.toString()} ${product.unit}`,
      observation: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.INPUT}' | Record Changed ID='${product.id}' | Changed Value='${product.quantity.toString()} ${product.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Produto cadastrado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar o produto.",
    };
  }
};

export const registerOutput = async (
  values: z.infer<typeof CreateProductOutputSchema>
): Promise<MasterProductOperationResponse> => {
  const validatedFields = CreateProductOutputSchema.safeParse(values);
  const user = await currentUser();

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
      (productOutputData.unit === UnitType.UN &&
        getUnitProduct !== UnitType.UN) ||
      (productOutputData.unit !== UnitType.UN && getUnitProduct === UnitType.UN)
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

    const movementOutput = await movementRepository.createOutput({
      ...productOutputData,
      productId: Number(productOutputData.productId),
      quantity: Number(productOutputData.quantity),
      movementType: MovementType.OUTPUT,
      observation: `[MOVEMENT] Type=${MovementType.OUTPUT} | Category=${productOutputData.movementCategory}} | Quantity=${productOutputData.quantity} | Unit=${productOutputData.unit} | Product ID=${productOutputData.productId} | Date Time='${new Date().toISOString()}'`,
      createdAt: new Date(),
    });

    await productRepository.updateQuantity({
      id: Number(productOutputData.productId),
      quantity: quantityResult,
    });

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: movementOutput.id,
      actionType: ActionType.CREATE,
      entity: EntityType.OUTPUT,
      value: `${productOutputData.quantity} ${productOutputData.unit}`,
      observation: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.OUTPUT}' | Record Changed ID='${movementOutput?.id.toString()}' | Changed Value='${productOutputData.quantity} ${productOutputData.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
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
