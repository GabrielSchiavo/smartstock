"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import {
  ColumnMetaProps,
  ColumnsTableProductsProps,
  LocaleType,
  ProductType,
  ProductWithMasterProductResponse,
  ValidityStatusType,
} from "@/types";
import { DataTableDropdown } from "@/components/tables/_components/data-table-dropdown";
import { deleteProduct } from "@/actions";
import { FormEditProduct } from "@/components/stock/product/form-edit-product";
import { formatDateOnlyToLocale } from "@/utils/date-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { checkExpiryStatus } from "@/utils/check-expiry-status";

// Função para escolher as colunas pesquisáveis
const multiColumnFilterFn: FilterFn<ProductWithMasterProductResponse> = (
  row,
  columnId,
  filterValue
) => {
  // Concatenate the values from multiple columns into a single string for search columns
  const searchableRowContent = `${row.original.id} ${row.original.name} ${row.original.lot} ${row.original.validityDate} ${row.original.receiptDate} ${row.original.receiver} ${row.original.masterProduct.name} ${row.original.masterProduct.category} ${row.original.masterProduct.group} ${row.original.masterProduct.subgroup} ${row.original.productType} ${row.original.supplier}`;

  // Perform a case-insensitive comparison
  return searchableRowContent.toLowerCase().includes(filterValue.toLowerCase());
};

export const columnsTableProducts = ({
  isSelectingAction = false,
  onSelect,
  selectedProductId,
}: ColumnsTableProductsProps): ColumnDef<ProductWithMasterProductResponse>[] => [
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
  //   meta: {
  //     title: "Quantidade",
  //   } as ColumnMetaProps,
  // },
  // {
  //   accessorKey: "unit",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Unidade" />
  //   ),
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
    meta: {
      title: "Quantidade",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "unitWeight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Peso Unitário" />
    ),
    cell: ({ row }) =>
      row.original.unitWeight ? (
        <span>
          {row.original.unitWeight?.toLocaleString(LocaleType.PT_BR)} {""}
          {row.original.unitOfUnitWeight}
        </span>
      ) : (
        "-"
      ),
    meta: {
      title: "Peso Unitário",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "lot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lote" />
    ),
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
      const validityResult = checkExpiryStatus(row.getValue("validityDate"), {
        dateOnly: true,
        formatDate: formatDateOnlyToLocale,
      });

      const { status, formattedDate } = validityResult;

      // Renderizar badge baseado no status
      switch (status) {
        case ValidityStatusType.EXPIRED:
          return (
            <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
              {formattedDate}
            </Badge>
          );

        case ValidityStatusType.EXPIRING:
          return (
            <Badge className="text-sm bg-yellow-500/15 text-yellow-600 dark:text-yellow-500">
              {formattedDate}
            </Badge>
          );

        default:
          return (
            <Badge className="text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
              {formattedDate}
            </Badge>
          );
      }
    },
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
      return formatDateOnlyToLocale(receiptDate);
    },
    meta: {
      title: "Data de Recebimento",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "receiver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recebedor" />
    ),
    meta: {
      title: "Recebedor",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "masterProduct.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Produto Mestre" />
    ),
    meta: {
      title: "Produto Mestre",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "masterProduct.category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    meta: {
      title: "Categoria",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "masterProduct.group",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grupo" />
    ),
    meta: {
      title: "Grupo",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "masterProduct.subgroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subgrupo" />
    ),
    cell: ({ row }) => row.original.masterProduct?.subgroup || "-",
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
          <Badge variant={"outline"} className="text-sm">
            DOADO
          </Badge>
        );
      } else {
        return <Badge className="text-sm bg-muted">COMPRADO</Badge>;
      }
    },
    meta: {
      title: "Tipo de Produto",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "supplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => row.original.supplier || "-",
    meta: {
      title: "Fornecedor",
    } as ColumnMetaProps,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => {
      if (isSelectingAction && onSelect) {
        const isSelected = selectedProductId === row.original.id.toString();
        return (
          <Button
            onClick={() => onSelect(row.original)}
            variant={isSelected ? "outline" : "default"}
            size="sm"
            disabled={isSelected}
          >
            {isSelected ? "Selecionado" : "Selecionar"}
          </Button>
        );
      } else {
        return (
          <DataTableDropdown
            entity="Produto Mestre"
            rowItemId={row.original.id as number}
            formComponent={FormEditProduct}
            deleteAction={deleteProduct}
          />
        );
      }
    },
    enableSorting: false,
    enableHiding: false,
  },
];
