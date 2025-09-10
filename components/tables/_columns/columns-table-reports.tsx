import { ColumnDef } from "@tanstack/react-table";
import {
  ColumnMetaProps,
  DonationsReportResponse,
  InventoryReportResponse,
  LocaleType,
  MovementType,
  PurchasedReportResponse,
  ReceiversReportResponse,
  StockMovementReportResponse,
  SuppliersReportResponse,
  ValidityReportResponse,
  ValidityStatusType,
} from "@/types";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import {
  formatDateOnlyToLocale,
  formatDateTimeToLocale,
} from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";

export const columnsTableReportValidity: ColumnDef<ValidityReportResponse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    meta: {
      title: "ID",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
    meta: {
      title: "Nome",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
          {row.original.unit}
        </span>
      );
    },
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
      const validityDate = row.original.validityDate;
      return formatDateOnlyToLocale(validityDate);
    },
    meta: {
      title: "Data de Validade",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "daysUntilExpiry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dias para Vencer" />
    ),
    cell: ({ row }) => {
      const days = row.original.daysUntilExpiry;
      const daysString = days.toString();

      if (days <= 0) {
        return (
          <span className="bg-muted px-3 py-1 rounded-sm text-sm uppercase">
            Vencido
          </span>
        );
      } else {
        return <span>{daysString}</span>;
      }
    },
    meta: {
      title: "Dias para Vencer",
    } as ColumnMetaProps,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === ValidityStatusType.EXPIRED) {
        return (
          <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
            Vencido
          </Badge>
        );
      } else if (status === ValidityStatusType.EXPIRING) {
        return (
          <Badge className="text-sm bg-yellow-500/15 text-yellow-600 dark:text-yellow-500">
            Próximo do vencimento
          </Badge>
        );
      } else {
        return (
          <Badge className="text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
            Válido
          </Badge>
        );
      }
    },
    meta: {
      title: "Status",
    } as ColumnMetaProps,
  },
];

export const columnsTableReportDonations: ColumnDef<DonationsReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do Produto" />
      ),
      meta: {
        title: "Nome",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
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
      accessorKey: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
      meta: {
        title: "Fornecedor",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebimento" />
      ),
      cell: ({ row }) => {
        const receiptDate = row.original.receiptDate;
        return formatDateOnlyToLocale(receiptDate);
      },
      meta: {
        title: "Data de Recebimento",
      } as ColumnMetaProps,
    },
  ];

export const columnsTableReportPurchased: ColumnDef<PurchasedReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do Produto" />
      ),
      meta: {
        title: "Nome",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
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
      accessorKey: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
      meta: {
        title: "Fornecedor",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebimento" />
      ),
      cell: ({ row }) => {
        const receiptDate = row.original.receiptDate;
        return formatDateOnlyToLocale(receiptDate);
      },
      meta: {
        title: "Data de Recebimento",
      } as ColumnMetaProps,
    },
  ];
export const columnsTableReportReceivers: ColumnDef<ReceiversReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do Produto" />
      ),
      meta: {
        title: "Nome",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
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
      accessorKey: "receiver",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Recebedor" />
      ),
      meta: {
        title: "Recebedor",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebimento" />
      ),
      cell: ({ row }) => {
        const receiptDate = row.original.receiptDate;
        return formatDateOnlyToLocale(receiptDate);
      },
      meta: {
        title: "Data de Recebimento",
      } as ColumnMetaProps,
    },
  ];
export const columnsTableReportSuppliers: ColumnDef<SuppliersReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do Produto" />
      ),
      meta: {
        title: "Nome",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
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
      accessorKey: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
      meta: {
        title: "Fornecedor",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebimento" />
      ),
      cell: ({ row }) => {
        const receiptDate = row.original.receiptDate;
        return formatDateOnlyToLocale(receiptDate);
      },
      meta: {
        title: "Data de Recebimento",
      } as ColumnMetaProps,
    },
  ];

export const columnsTableReportInventory: ColumnDef<InventoryReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome do Produto" />
      ),
      meta: {
        title: "Nome",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
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
        const validityDate = row.original.validityDate;
        return formatDateOnlyToLocale(validityDate);
      },
      meta: {
        title: "Data de Validade",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "productType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      cell: ({ row }) => {
        const type = row.original.productType;
        return <span>{formatEnumValueDisplay(type, "capitalize")}</span>;
      },
      meta: {
        title: "Tipo",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "daysUntilExpiry",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dias para Vencer" />
      ),
      cell: ({ row }) => {
        const days = row.original.daysUntilExpiry;
        const daysString = days.toString();

        if (days <= 0) {
          return (
            <span className="bg-muted px-3 py-1 rounded-sm text-sm uppercase">
              Vencido
            </span>
          );
        } else {
          return <span>{daysString}</span>;
        }
      },
      meta: {
        title: "Dias para Vencer",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        if (status === ValidityStatusType.EXPIRED) {
          return (
            <Badge className="text-sm bg-red-500/15 text-red-600 dark:text-red-500">
              Vencido
            </Badge>
          );
        } else if (status === ValidityStatusType.EXPIRING) {
          return (
            <Badge className="text-sm bg-yellow-500/15 text-yellow-600 dark:text-yellow-500">
              Próximo do vencimento
            </Badge>
          );
        } else {
          return (
            <Badge className="text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-500">
              Válido
            </Badge>
          );
        }
      },
      meta: {
        title: "Status",
      } as ColumnMetaProps,
    },
  ];

export const columnsTableReportStockMovements: ColumnDef<StockMovementReportResponse>[] =
  [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      meta: {
        title: "ID",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data/Hora" />
      ),
      cell: ({ row }) => {
        const validityDate = new Date(row.getValue("createdAt"));
        const dateString = formatDateTimeToLocale(validityDate);

        return dateString;
      },
      meta: {
        title: "Data/Hora",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "movementType",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Movimentação" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("movementType");
        return (
          <Badge
            variant={"outline"}
            className={`text-sm ${value === MovementType.ADJUSTMENT_POSITIVE || value === MovementType.INPUT ? "text-emerald-600 dark:text-emerald-500" : value === MovementType.ADJUSTMENT_NEGATIVE || value === MovementType.OUTPUT ? "text-red-600 dark:text-red-500" : ""}`}
          >
            {formatEnumValueDisplay(value as string, "uppercase")}
          </Badge>
        );
      },
      meta: {
        title: "Movimentação",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "movementCategory",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      cell: ({ row }) => {
        const value = row.getValue("movementCategory");

        return (
          <Badge variant={"outline"} className="text-sm">
            {formatEnumValueDisplay(value as string, "uppercase")}
          </Badge>
        );
      },
      meta: {
        title: "Categoria",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => {
        return (
          <span>
            {row.original.quantity.toLocaleString(LocaleType.PT_BR)} {""}
            {row.original.unit}
          </span>
        );
      },
      meta: {
        title: "Quantidade",
      } as ColumnMetaProps,
    },
  ];
