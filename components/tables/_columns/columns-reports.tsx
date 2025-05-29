import { ColumnDef } from "@tanstack/react-table";
import {
  ColumnMetaProps,
  DonationsReportResponse,
  InventoryReportResponse,
  LocaleType,
  PurchasedReportResponse,
  ValidityReportResponse,
  validityStatusType,
} from "@/types";
import { DataTableColumnHeader } from "@/components/tables/_components/data-table-column-header";
import { ProductType } from "@/types";

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
          <span className="font-medium">{row.original.unit}</span>
        </span>
      );
    },
    meta: {
      title: "Quantidade",
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
    cell: ({ row }) =>
      row.original.validityDate.toLocaleDateString(LocaleType.PT_BR),
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

      if (status === validityStatusType.EXPIRED) {
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            Vencido
          </span>
        );
      } else if (status === validityStatusType.ABOUT_TO_EXPIRE) {
        return (
          <span className="bg-yellow-500/15 px-3 py-1 rounded-sm text-sm text-yellow-600 dark:text-yellow-500">
            Próximo do vencimento
          </span>
        );
      } else {
        return (
          <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">
            Válido
          </span>
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
            <span className="font-medium">{row.original.unit}</span>
          </span>
        );
      },
      meta: {
        title: "Quantidade",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "donor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Doador" />
      ),
      meta: {
        title: "Doador",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebibento" />
      ),
      cell: ({ row }) =>
        row.original.receiptDate.toLocaleDateString(LocaleType.PT_BR),
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
            <span className="font-medium">{row.original.unit}</span>
          </span>
        );
      },
      meta: {
        title: "Quantidade",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "receiptDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Recebimento" />
      ),
      cell: ({ row }) =>
        row.original.receiptDate.toLocaleDateString(LocaleType.PT_BR),
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
            <span className="font-medium">{row.original.unit}</span>
          </span>
        );
      },
      meta: {
        title: "Quantidade",
      } as ColumnMetaProps,
    },
    {
      accessorKey: "unit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      cell: ({ row }) => {
        return (
          <span> {""}
            <span className="font-medium">{row.original.unit}</span>
          </span>
        );
      },
      meta: {
        title: "Quantidade",
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
      cell: ({ row }) =>
        row.original.validityDate.toLocaleDateString(LocaleType.PT_BR),
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

        if (status === validityStatusType.EXPIRED) {
          return (
            <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
              Vencido
            </span>
          );
        } else if (status === validityStatusType.ABOUT_TO_EXPIRE) {
          return (
            <span className="bg-yellow-500/15 px-3 py-1 rounded-sm text-sm text-yellow-600 dark:text-yellow-500">
              Próximo do vencimento
            </span>
          );
        } else {
          return (
            <span className="bg-emerald-500/15 px-3 py-1 rounded-sm text-sm text-emerald-600 dark:text-emerald-500">
              Válido
            </span>
          );
        }
      },
      meta: {
        title: "Status",
      } as ColumnMetaProps,
    },
  ];
