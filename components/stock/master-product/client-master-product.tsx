"use client";

import { DataTableMasterProducts } from "@/components/tables/data-table-master-product";
import { columnsTableMasterProducts } from "@/components/tables/_columns/columns-master-product";
import { MasterProduct } from "@prisma/client";

interface ClientMasterProductsProps {
  masterProducts: MasterProduct[];
}

export function ClientMasterProducts({ masterProducts }: ClientMasterProductsProps) {
  const columns = columnsTableMasterProducts({});

  return (
    <DataTableMasterProducts
      addButton={true}
      data={masterProducts}
      columns={columns}
      groupBy="category"
    />
  );
}