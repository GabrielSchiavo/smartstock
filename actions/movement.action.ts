"use server";

import {
  auditLogRepository,
  movementRepository,
  productRepository,
} from "@/db";
import {
  CreateAdjustmentSchema,
  CreateInputEditProductSchema,
  CreateOutputSchema,
} from "@/schemas";
import {
  EntityType,
  ActionType,
  MovementType,
  UnitType,
  MovementOperationResponse,
  AdjustmentType,
} from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";
import { getProductById } from "@/actions/product.action";
import { convertUnit } from "@/utils/unit-conversion";
import { currentUser } from "@/lib/auth";

export const registerInput = async (
  values: z.infer<typeof CreateInputEditProductSchema>
): Promise<MovementOperationResponse> => {
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
      details: `[MOVEMENT] Type=${MovementType.INPUT} | Category=${productData.movementCategory}} | Quantity=${quantity} | Unit=${productData.unit} | Product ID=${product.id} | Date Time='${new Date().toISOString()}'`,
      createdAt: new Date(),
    });

    // Cria o log de entrada após criar o movimento
    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: product.id.toString(),
      actionType: ActionType.CREATE,
      entity: EntityType.INPUT,
      changedValue: `${product.quantity.toString()} ${product.unit}`,
      details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.INPUT}' | Record Changed ID='${product.id}' | Changed Value='${product.quantity.toString()} ${product.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
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
  values: z.infer<typeof CreateOutputSchema>
): Promise<MovementOperationResponse> => {
  const validatedFields = CreateOutputSchema.safeParse(values);
  const user = await currentUser();

  if (validatedFields.success === false) {
    return {
      success: false,
      title: "Erro!",
      description: "Campos inválidos.",
    };
  }

  const { productQuantity, productUnit, lot, validityDate, ...outputData } =
    validatedFields.data;

  try {
    const getProductSelected = await getProductById(
      Number(outputData.productId)
    );
    const getUnitProduct = getProductSelected.unit as UnitType;

    if (
      (outputData.unit === UnitType.UN && getUnitProduct !== UnitType.UN) ||
      (outputData.unit !== UnitType.UN && getUnitProduct === UnitType.UN)
    ) {
      return {
        success: false,
        title: "Erro!",
        description: "Unidade de saída inválida.",
      };
    }

    const quantityConverted =
      outputData.unit === UnitType.UN && getUnitProduct === UnitType.UN
        ? Number(outputData.quantity)
        : convertUnit(
            Number(outputData.quantity),
            outputData.unit as UnitType,
            getUnitProduct
          );

    // Calcula o resultado final após a saída
    const quantityResult = getProductSelected.quantity - quantityConverted;

    if (quantityResult < 0) {
      return {
        success: false,
        title: "Erro!",
        description: "Não há estoque suficiente para realizar a saída.",
      };
    }

    const movementOutput = await movementRepository.createOutput({
      ...outputData,
      productId: Number(outputData.productId),
      quantity: Number(outputData.quantity),
      movementType: MovementType.OUTPUT,
      details: `[MOVEMENT] Type=${MovementType.OUTPUT} | Category=${outputData.movementCategory}} | Quantity=${outputData.quantity} | Unit=${outputData.unit} | Product ID=${outputData.productId} | Date Time='${new Date().toISOString()}'`,
      createdAt: new Date(),
    });

    await productRepository.updateQuantity({
      id: Number(outputData.productId),
      quantity: quantityResult,
    });

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: movementOutput.id,
      actionType: ActionType.CREATE,
      entity: EntityType.OUTPUT,
      changedValue: `${outputData.quantity} ${outputData.unit}`,
      details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${EntityType.OUTPUT}' | Record Changed ID='${movementOutput?.id.toString()}' | Changed Value='${outputData.quantity} ${outputData.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
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

export const registerAdjustment = async (
  values: z.infer<typeof CreateAdjustmentSchema>
): Promise<MovementOperationResponse> => {
  const validatedFields = CreateAdjustmentSchema.safeParse(values);
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
    adjustmentType,
    ...adjustmentData
  } = validatedFields.data;

  const adjustmentTypeValue = validatedFields.data.adjustmentType;

  try {
    const getProductSelected = await getProductById(
      Number(adjustmentData.productId)
    );
    const getUnitProduct = getProductSelected.unit as UnitType;

    if (
      (adjustmentData.unit === UnitType.UN && getUnitProduct !== UnitType.UN) ||
      (adjustmentData.unit !== UnitType.UN && getUnitProduct === UnitType.UN)
    ) {
      return {
        success: false,
        title: "Erro!",
        description: "Unidade de ajuste inválida.",
      };
    }

    const quantityConverted =
      adjustmentData.unit === UnitType.UN && getUnitProduct === UnitType.UN
        ? Number(adjustmentData.quantity)
        : convertUnit(
            Number(adjustmentData.quantity),
            adjustmentData.unit as UnitType,
            getUnitProduct
          );

    // Calcula o resultado final após o ajuste
    const quantityResult =
      adjustmentTypeValue === AdjustmentType.NEGATIVE
        ? getProductSelected.quantity - quantityConverted
        : getProductSelected.quantity + quantityConverted;

    if (quantityResult < 0) {
      return {
        success: false,
        title: "Erro!",
        description: "Não há estoque suficiente para realizar o ajuste.",
      };
    }

    const adjustmentMovementType = adjustmentTypeValue === AdjustmentType.NEGATIVE ? MovementType.ADJUSTMENT_NEGATIVE : MovementType.ADJUSTMENT_POSITIVE;

    const movementAdjustment = await movementRepository.createOutput({
      ...adjustmentData,
      productId: Number(adjustmentData.productId),
      quantity: Number(adjustmentData.quantity),
      movementType: adjustmentMovementType,
      details: `[MOVEMENT] Type=${adjustmentMovementType} | Category=${adjustmentData.movementCategory}} | Quantity=${adjustmentData.quantity} | Unit=${adjustmentData.unit} | Product ID=${adjustmentData.productId} | Date Time='${new Date().toISOString()}'`,
      createdAt: new Date(),
    });

    await productRepository.updateQuantity({
      id: Number(adjustmentData.productId),
      quantity: quantityResult,
    });

    const adjustmentEntityType = adjustmentTypeValue === AdjustmentType.NEGATIVE ? EntityType.ADJUSTMENT_NEGATIVE : EntityType.ADJUSTMENT_POSITIVE;

    await auditLogRepository.create({
      createdAt: new Date(),
      userId: user?.id as string,
      recordChangedId: movementAdjustment.id,
      actionType: ActionType.CREATE,
      entity: adjustmentEntityType,
      changedValue: `${adjustmentData.quantity} ${adjustmentData.unit}`,
      details: `[AUDIT] Action='${ActionType.CREATE}' | Entity='${adjustmentEntityType}' | Record Changed ID='${movementAdjustment?.id.toString()}' | Changed Value='${adjustmentData.quantity} ${adjustmentData.unit}' | User ID='${user?.id}' | User='${user?.name}' | Date Time='${new Date().toISOString()}'`,
    });

    revalidatePath("/");
    return {
      success: true,
      title: "Sucesso!",
      description: "Ajuste cadastrado com sucesso.",
    };
  } catch (error) {
    console.error("Erro ao cadastrar ajuste:", error);
    return {
      success: false,
      title: "Erro!",
      description: "Não foi possível cadastrar o ajuste.",
    };
  }
};
