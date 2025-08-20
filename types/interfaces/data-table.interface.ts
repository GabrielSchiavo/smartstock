import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { ReportType } from "@/types";
import { MasterProduct } from "@prisma/client";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton: boolean;
  groupBy?: string;
  selectionMode?: boolean;
}

export interface DataTableReportProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  groupBy?: string;
  initialDate?: Date;
  finalDate?: Date;
  reportType: ReportType;
}

export interface GroupedTableProps<TData> {
  table: Table<TData>;
  groupBy?: string;
  collapsedGroups: Set<string>;
  setCollapsedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  toolTip: boolean;
  addButton: boolean;
  addButtonType?: string;
}

export interface DataTableFunctionsProps<TData> {
  table: Table<TData>;
}

export interface ColumnsTableMasterItemsProps {
  isSelectingAction?: boolean;
  onSelect?: (masterProduct: MasterProduct) => void;
  selectedMasterProductId?: string;
}