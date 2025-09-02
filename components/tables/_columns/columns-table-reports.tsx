import { ColumnDef } from "@tanstack/react-table";
import {
  AdjustmentMovementCategoryType,
  ColumnMetaProps,
  DonationsReportResponse,
  InputMovementCategoryType,
  InventoryReportResponse,
  LocaleType,
  MovementType,
  OutputMovementCategoryType,
  PurchasedReportResponse,
  StockMovementReportResponse,
  ValidityReportResponse,
  ValidityStatusType,
} from "@/types";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { ProductType } from "@/types";
import { formatDateOnlyToLocale, formatDateTimeToLocale } from "@/utils/date-utils";
import { Badge } from "@/components/ui/badge";

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
        return (
          <span className="capitalize">
            {type === ProductType.PURCHASED ? "Comprado" : "Doado"}
          </span>
        );
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

export const columnsTableReportStockMovements: ColumnDef<StockMovementReportResponse>[] = [
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

      switch (value) {
        case MovementType.INPUT:
          return (
            <Badge
              variant={"outline"}
              className="text-sm text-emerald-600 dark:text-emerald-500"
            >
              ENTRADA
            </Badge>
          );
        case MovementType.OUTPUT:
          return (
            <Badge
              variant={"outline"}
              className="text-sm text-red-600 dark:text-red-500"
            >
              SAÍDA
            </Badge>
          );
        case MovementType.ADJUSTMENT_POSITIVE:
          return (
            <Badge
              variant={"outline"}
              className="text-sm text-emerald-600 dark:text-emerald-500"
            >
              AJUSTE POSITIVO
            </Badge>
          );
        case MovementType.ADJUSTMENT_NEGATIVE:
          return (
            <Badge
              variant={"outline"}
              className="text-sm text-red-600 dark:text-red-500"
            >
              AJUSTE NEGATIVO
            </Badge>
          );
        default:
          return (
            <Badge className="text-sm bg-zinc-500/15 text-zinc-600 dark:text-zinc-500">
              {value as string}
            </Badge>
          );
      }
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

      switch (value) {
        case InputMovementCategoryType.DONATION ||
          OutputMovementCategoryType.DONATION:
          return (
            <Badge variant={"outline"} className="text-sm">
              DOAÇÃO
            </Badge>
          );
        case InputMovementCategoryType.PURCHASE:
          return (
            <Badge variant={"outline"} className="text-sm">
              COMPRA
            </Badge>
          );
        case InputMovementCategoryType.RETURN ||
          OutputMovementCategoryType.RETURN:
          return (
            <Badge variant={"outline"} className="text-sm">
              RETORNO
            </Badge>
          );
        case InputMovementCategoryType.TRANSFER ||
          OutputMovementCategoryType.TRANSFER:
          return (
            <Badge variant={"outline"} className="text-sm">
              TRANSFERÊNCIA
            </Badge>
          );
        case OutputMovementCategoryType.CONSUMPTION:
          return (
            <Badge variant={"outline"} className="text-sm">
              CONSUMO
            </Badge>
          );
        case OutputMovementCategoryType.SALE:
          return (
            <Badge variant={"outline"} className="text-sm">
              VENDA
            </Badge>
          );
        case AdjustmentMovementCategoryType.CORRECTION:
          return (
            <Badge variant={"outline"} className="text-sm">
              CORREÇÃO
            </Badge>
          );
        case AdjustmentMovementCategoryType.DUE_DATE:
          return (
            <Badge variant={"outline"} className="text-sm">
              VENCIMENTO
            </Badge>
          );
        case AdjustmentMovementCategoryType.GENERAL:
          return (
            <Badge variant={"outline"} className="text-sm">
              GERAL
            </Badge>
          );
        case AdjustmentMovementCategoryType.LOSS_DAMAGE:
          return (
            <Badge variant={"outline"} className="text-sm">
              PERDA/AVARIA
            </Badge>
          );
        case AdjustmentMovementCategoryType.THEFT_MISPLACEMENT:
          return (
            <Badge variant={"outline"} className="text-sm">
              FURTO/EXTRAVIO
            </Badge>
          );
        default:
          return (
            <Badge variant={"outline"} className="text-sm">
              {value as string}
            </Badge>
          );
      }
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
