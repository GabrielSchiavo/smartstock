"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { Product } from "@prisma/client";
import { ColumnMetaProps, LocaleType, ProductType } from "@/types";
import { formatDateToLocale } from "@/lib/date-utils";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { EditProductForm } from "@/components/product/edit-product-form";
import { deleteProduct } from "@/actions";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Product> = (row, columnId, filterValue) => {
  // Concatenate the values from multiple columns into a single string
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.lot} ${row.original.validityDate} ${row.original.receiptDate} ${row.original.receiver} ${row.original.group} ${row.original.subgroup} ${row.original.productType} ${row.original.supplier}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableProducts: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "ID",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Nome",
    } as ColumnMetaProps,
  },
  // {
  //   accessorKey: "quantity",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Quantidade" />
  //   ),
  //   cell: ({ row }) => row.original.quantity.toLocaleString(LocaleType.PT_BR),
  //   filterFn: multiColumnFilterFn,
  //   meta: {
  //     title: "Quantidade",
  //   } as ColumnMetaProps,
  // },
  // {
  //   accessorKey: "unit",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Unidade" />
  //   ),
  //   filterFn: multiColumnFilterFn,
  //   meta: {
  //     title: "Unidade",
  //   } as ColumnMetaProps,
  // },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.quantity?.toLocaleString(LocaleType.PT_BR)} {""}
        {row.original.unit}
      </span>
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Quantidade",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "unitWeight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Peso Unitário" />
    ),
    cell: ({ row }) => {
      const unitWeight = row.getValue("unitWeight");
      if (unitWeight === null || unitWeight === undefined) {
        return "-";
      } else {
        return (
          <span>
            {row.original.unitWeight?.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unitOfUnitWeight}
          </span>
        );
      }
    },
    meta: {
      title: "Peso Unitário",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "lot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lote" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Lote",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "validityDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Validade" />
    ),
    cell: ({ row }) => {
      const currentDate = new Date();
      currentDate.setUTCHours(0, 0, 0, 0); // Remove a parte de horas para comparar apenas datas

      const validityDate = new Date(row.getValue("validityDate"));
      validityDate.setUTCHours(0, 0, 0, 0);

      const diffTime = validityDate.getTime() - currentDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24); // Converter para dias

      const dateString = formatDateToLocale(validityDate);

      if (diffDays <= 0) {
        // Incluindo o dia atual
        // Data passada
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            {dateString}
          </span>
        );
      } else if (diffDays <= 30) {
        // Dentro de 30 dias
        return (
          <span className="bg-yellow-500/15 px-3 py-1 rounded-sm text-sm text-yellow-600 dark:text-yellow-500">
            {dateString}
          </span>
        );
      } else {
        // Mais de 30 dias no futuro
        return (
          <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">
            {dateString}
          </span>
        );
      }
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Data de Validade",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Recebimento" />
    ),
    cell: ({ row }) => {
      const receiptDate = new Date(row.getValue("receiptDate"));
      return formatDateToLocale(receiptDate);
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Data de Recebimento",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "receiver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recebedor" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Recebedor",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Grupo",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "subgroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupo" />
    ),
    cell: ({ row }) => {
      const subgroup = row.getValue("subgroup");
      if (subgroup === null || subgroup === undefined) {
        return "-";
      } else {
        return subgroup;
      }
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Subgrupo",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "productType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo de Produto" />
    ),
    cell: ({ row }) => {
      const verified = row.getValue("productType");
      if (verified === ProductType.DONATED) {
        return (
          <span className="border-1 border-muted px-3 py-1 rounded-sm text-sm uppercase">
            Doado
          </span>
        );
      } else {
        return (
          <span className="bg-muted px-3 py-1 rounded-sm text-sm uppercase">
            Comprado
          </span>
        );
      }
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Tipo de Produto",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => {
      const supplier = row.getValue("supplier");
      if (supplier === null || supplier === undefined) {
        return "-";
      } else {
        return supplier;
      }
    },
    filterFn: multiColumnFilterFn,
    meta: {
      title: "Fornecedor",
    } as ColumnMetaProps,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DataTableDropdown
          entity="Produto"
          rowItemId={row.original.id as number}
          formComponent={EditProductForm}
          deleteAction={deleteProduct}
        />
      );
    },
  },
];
