import { Column, ColumnDef, Row, Table,Table as TanstackTable, } from "@tanstack/react-table";
import { ProductWithMasterProductResponse, ReportType } from "@/types";
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

export interface ColumnsTableMasterProductsProps {
  isSelectingAction?: boolean;
  onSelect?: (masterProduct: MasterProduct) => void;
  selectedMasterProductId?: string;
}

export interface ColumnsTableProductsProps {
  isSelectingAction?: boolean;
  onSelect?: (product: ProductWithMasterProductResponse) => void;
  selectedProductId?: string;
}

export interface BaseDataTableProps<TData> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData>[];
  groupedData?: Record<string, Row<TData>[]>;
  collapsedGroups: Set<string>;
  toggleGroup: (groupName: string) => void;
  showGroupTotal?: boolean;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}

export interface BaseDataTableAccordionProps<TData> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData>[];
}