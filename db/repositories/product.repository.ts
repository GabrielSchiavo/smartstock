import {
  ProductCountType,
  ProductResponse,
  ProductUpdateResponse,
  ProductWithMasterProductResponse,
  UnitType,
  ProductType,
} from "@/types";
import { db } from "@/lib/db";

export const productRepository = {
  async create(
    data: ProductResponse
  ): Promise<ProductWithMasterProductResponse> {
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
    // if (data.productType !== ProductType.DONATED) {
    //   data.supplier = null;
    // }

    // Remove os campos de categoria, grupo e subgrupo que agora vêm do masterProduct
    const { category, group, subgroup, movementCategory, ...productData } =
      data;

    return (await db.product.create({
      data: productData,
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterProductResponse;
  },

  async findAll(): Promise<ProductWithMasterProductResponse[]> {
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

  async findExpired(): Promise<ProductWithMasterProductResponse[]> {
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

  async findAboutToExpire(): Promise<ProductWithMasterProductResponse[]> {
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

  async findById(id: number): Promise<ProductWithMasterProductResponse | null> {
    return (await db.product.findUnique({
      where: { id },
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterProductResponse | null;
  },

  async update(
    id: number,
    data: ProductUpdateResponse
  ): Promise<ProductWithMasterProductResponse> {
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
    // if (data.productType !== ProductType.DONATED) {
    //   data.supplier = null;
    // }

    // Remove os campos de categoria, grupo e subgrupo que agora vêm do masterProduct
    const { category, group, subgroup, movementCategory, ...productData } =
      data;

    return (await db.product.update({
      where: { id },
      data: productData,
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterProductResponse;
  },

  async updateQuantity({
    id,
    quantity,
  }: {
    id: number;
    quantity: number;
  }): Promise<ProductWithMasterProductResponse> {
    return (await db.product.update({
      where: { id },
      data: { quantity },
      include: {
        masterProduct: true,
      },
    })) as ProductWithMasterProductResponse;
  },

  async findByValidity(
    initialDate: Date,
    finalDate: Date
  ): Promise<ProductWithMasterProductResponse[]> {
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
  ): Promise<ProductWithMasterProductResponse[]> {
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
  ): Promise<ProductWithMasterProductResponse[]> {
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

  async findInventory(): Promise<ProductWithMasterProductResponse[]> {
    return db.product.findMany({
      include: {
        masterProduct: true,
      },
      orderBy: { validityDate: "asc" },
    });
  },
};
