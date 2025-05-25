import { Column, ColumnDef, Table } from "@tanstack/react-table";
import { ReportType } from "@/types";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton: boolean;
  groupBy?: string & keyof TData;
}

export interface DataTableReportProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  initialDate?: Date;
  finalDate?: Date;
  reportType: ReportType;
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
