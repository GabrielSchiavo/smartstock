import {
  ProductCountType,
  ProductResponse,
  ProductUpdateResponse,
  ProductWithMasterItemResponse,
  UnitType,
} from "@/types";
import { db } from "@/lib/db";
import { ProductType } from "@/types";

export const productRepository = {
  async create(data: ProductResponse): Promise<void> {
    // Regra para limpar campos Peso Unitário e Unidade do Peso Unitário se unidade não for UN
    if (data.unit !== UnitType.UN) {
      data.unitWeight = null;
      data.unitOfUnitWeight = null;
    }
    // Regra para caso o valor do campo Peso Unitário seja 0 o campo seja limpo
    if (data.unit === UnitType.UN && data.unitWeight == 0) {
      data.unitWeight = null;
    }
    // Regra para limpar campo Fornecedor se tipo de produto não for Doado
    if (data.productType !== ProductType.DONATED) {
      data.supplier = null;
    }

    // Remove os campos de categoria, grupo e subgrupo que agora vêm do masterItem
    const { category, group, subgroup, ...productData } = data;

    await db.product.create({ data: productData });
  },

  async findAll(): Promise<ProductWithMasterItemResponse[]> {
    return await db.product.findMany({
      include: {
        masterProduct: true,
      },
      orderBy: { id: "asc" },
    });
  },

  async countProducts(
    type: ProductCountType = ProductCountType.ALL
  ): Promise<number> {
    const currentDate = new Date();

    if (type === ProductCountType.EXPIRED) {
      return db.product.count({
        where: { validityDate: { lt: currentDate } },
      });
    }

    if (type === ProductCountType.ABOUT_TO_EXPIRE) {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() + 30);

      return db.product.count({
        where: {
          validityDate: {
            lt: limitDate,
            gte: currentDate,
          },
        },
      });
    }

    // padrão: contar todos
    return db.product.count();
  },

  async findExpired(): Promise<ProductWithMasterItemResponse[]> {
    const currentDate = new Date();
    return await db.product.findMany({
      where: {
        validityDate: { lte: currentDate }, // Incluindo o dia atual
      },
      include: {
        masterProduct: true,
      },
      orderBy: {
        validityDate: "asc",
      },
    });
  },

  async findAboutToExpire(): Promise<ProductWithMasterItemResponse[]> {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 30);

    return await db.product.findMany({
      where: {
        validityDate: {
          lt: limitDate,
          gt: new Date(), // Sem incluir o dia atual
        },
      },
      include: {
        masterProduct: true,
      },
      orderBy: {
        validityDate: "asc",
      },
    });
  },

  async delete(id: number): Promise<void> {
    await db.product.delete({
      where: { id },
    });
  },

  async findById(id: number): Promise<ProductWithMasterItemResponse | null> {
    return (await db.product.findUnique({
      where: { id },
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterItemResponse | null;
  },

  async update(
    id: number,
    data: ProductUpdateResponse
  ): Promise<ProductWithMasterItemResponse> {
    // Regra para limpar campos Peso Unitário e Unidade do Peso Unitário se unidade não for UN
    if (data.unit !== UnitType.UN) {
      data.unitWeight = null;
      data.unitOfUnitWeight = null;
    }
    // Regra para caso o valor do campo Peso Unitário seja 0 o campo seja limpo
    if (data.unit === UnitType.UN && data.unitWeight == 0) {
      data.unitWeight = null;
    }
    // Regra para limpar campo Fornecedor se tipo de produto não for Doado
    if (data.productType !== ProductType.DONATED) {
      data.supplier = null;
    }

    // Remove os campos de categoria, grupo e subgrupo que agora vêm do masterItem
    const { category, group, subgroup, ...productData } = data;

    return (await db.product.update({
      where: { id },
      data: productData,
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterItemResponse;
  },

  async findByValidity(
    initialDate: Date,
    finalDate: Date
  ): Promise<ProductWithMasterItemResponse[]> {
    return db.product.findMany({
      where: { validityDate: { gte: initialDate, lte: finalDate } },
      include: {
        masterProduct: true,
      },
      orderBy: { validityDate: "asc" },
    });
  },

  async findDonated(
    initialDate: Date,
    finalDate: Date
  ): Promise<ProductWithMasterItemResponse[]> {
    return db.product.findMany({
      where: {
        AND: [
          { productType: ProductType.DONATED },
          { receiptDate: { gte: initialDate, lte: finalDate } },
        ],
      },
      include: {
        masterProduct: true,
      },
      orderBy: { receiptDate: "asc" },
    });
  },

  async findPurchased(
    initialDate: Date,
    finalDate: Date
  ): Promise<ProductWithMasterItemResponse[]> {
    return db.product.findMany({
      where: {
        productType: ProductType.PURCHASED,
        receiptDate: { gte: initialDate, lte: finalDate },
      },
      include: {
        masterProduct: true,
      },
      orderBy: { receiptDate: "asc" },
    });
  },

  async findInventory(): Promise<ProductWithMasterItemResponse[]> {
    return db.product.findMany({
      include: {
        masterProduct: true,
      },
      orderBy: { validityDate: "asc" },
    });
  },
};
