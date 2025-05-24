import { ColumnDef } from "@tanstack/react-table";
import {
  DonationsReport,
  InventoryReport,
  PurchasedReport,
  ValidityReport,
} from "@/actions/report";
import { DataTableColumnHeader } from "@/components/data-table/_components/data-table-column-header";
import { ProductType } from "@prisma/client";

export const columnsTableReportValidity: ColumnDef<ValidityReport>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.quantity} {""}
          <span className="font-medium">{row.original.unit}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "lot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lote" />
    ),
  },
  {
    accessorKey: "validityDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Validade" />
    ),
    cell: ({ row }) => row.original.validityDate.toLocaleDateString("pt-BR"),
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
        )
      } else {
        return (
          <span>
            {daysString}
          </span>
        )
      }
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "expired") {
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            Vencido
          </span>
        );
      } else if (status === "about_to_expire") {
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
  },
];

export const columnsTableReportDonations: ColumnDef<DonationsReport>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.quantity} {""}
          <span className="font-medium">{row.original.unit}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "donor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doador" />
    ),
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Recebibento" />
    ),
    cell: ({ row }) => row.original.receiptDate.toLocaleDateString("pt-BR"),
  },
];

export const columnsTableReportPurchased: ColumnDef<PurchasedReport>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.quantity} {""}
          <span className="font-medium">{row.original.unit}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "receiptDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Recebimento" />
    ),
    cell: ({ row }) => row.original.receiptDate.toLocaleDateString("pt-BR"),
  },
];

export const columnsTableReportInventory: ColumnDef<InventoryReport>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Produto" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantidade" />
    ),
    cell: ({ row }) => {
      return (
        <span>
          {row.original.quantity} {""}
          <span className="font-medium">{row.original.unit}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "lot",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lote" />
    ),
  },
  {
    accessorKey: "validityDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Validade" />
    ),
    cell: ({ row }) => row.original.validityDate.toLocaleDateString("pt-BR"),
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "expired") {
        return (
          <span className="bg-red-500/15 px-3 py-1 rounded-sm text-sm text-red-600 dark:text-red-500">
            Vencido
          </span>
        );
      } else if (status === "about_to_expire") {
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
  },
];