import { ProductCountType, ProductResponse, ProductUpdateResponse, UnitType } from "@/types";
import { db } from "@/lib/db";
import { ProductType } from "@/types";
import { Product } from "@prisma/client";

export const productRepository = {
  async create(data: ProductResponse): Promise<void> {
    // Regra para limpar campos Peso Unitário e Unidade do Peso Unitário se unidade não for UN
    if (data.unit !== UnitType.UN) {
      data.unitWeight = null;
      data.unitOfUnitWeight = null;
    }
    // Regra para limpar campo Fornecedor se tipo de produto não for Doado
    if (data.productType !== ProductType.DONATED) {
      data.supplier = null;
    }

    await db.product.create({ data });
  },

  async findAll(): Promise<Product[]> {
    return await db.product.findMany({
      orderBy: { id: "asc" },
    });
  },

async countProducts(type: ProductCountType = ProductCountType.ALL): Promise<number> {
  const currentDate = new Date()

  if (type === ProductCountType.EXPIRED) {
    return db.product.count({
      where: { validityDate: { lt: currentDate } },
    })
  }

  if (type === ProductCountType.ABOUT_TO_EXPIRE) {
    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() + 30)

    return db.product.count({
      where: {
        validityDate: {
          lt: limitDate,
          gte: currentDate,
        },
      },
    })
  }

  // padrão: contar todos
  return db.product.count()
},

  async findExpired(): Promise<Product[]> {
    const currentDate = new Date();
    return await db.product.findMany({
      where: {
        validityDate: { lte: currentDate }, // Incluindo o dia atual
      },
      orderBy: {
        validityDate: "asc",
      },
    });
  },

  async findAboutToExpire(): Promise<Product[]> {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 30);

    return await db.product.findMany({
      where: {
        validityDate: {
          lt: limitDate,
          gt: new Date(), // Sem incluir o dia atual
        },
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

  async findById(id: number): Promise<Product | null> {
    return await db.product.findUnique({
      where: { id },
    });
  },

  async update(id: number, data: ProductUpdateResponse): Promise<Product> {
    // Regra para limpar campos Peso Unitário e Unidade do Peso Unitário se unidade não for UN
    if (data.unit !== UnitType.UN) {
      data.unitWeight = null;
      data.unitOfUnitWeight = null;
    }
    // Regra para limpar campo Fornecedor se tipo de produto não for Doado
    if (data.productType !== ProductType.DONATED) {
      data.supplier = null;
    }

    return await db.product.update({
      where: { id },
      data,
    });
  },

  async findByValidity(initialDate: Date, finalDate: Date) {
    return db.product.findMany({
      where: { validityDate: { gte: initialDate, lte: finalDate } },
      orderBy: { validityDate: "asc" },
    });
  },

  async findDonated(initialDate: Date, finalDate: Date) {
    return db.product.findMany({
      where: {
        AND: [
          { productType: ProductType.DONATED },
          { receiptDate: { gte: initialDate, lte: finalDate } },
        ],
      },
      orderBy: { receiptDate: "asc" },
    });
  },

  async findPurchased(initialDate: Date, finalDate: Date) {
    return db.product.findMany({
      where: {
        productType: ProductType.PURCHASED,
        receiptDate: { gte: initialDate, lte: finalDate },
      },
      orderBy: { receiptDate: "asc" },
    });
  },

  async findInventory() {
    return db.product.findMany({
      orderBy: { validityDate: "asc" },
    });
  },
};
