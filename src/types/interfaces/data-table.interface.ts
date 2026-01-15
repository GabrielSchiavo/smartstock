import {
  Column,
  ColumnDef,
  Row,
  Table,
  Table as TanstackTable,
} from "@tanstack/react-table";
import {
  DataExpandableType,
  DeleteRegisterProps,
  FiltersGroupType,
  FilterModeType,
  FormAddEditProps,
  MasterProductWithCategoryGroupSubgroupResponse,
  ProductWithMasterProductResponse,
  ReportDataResponse,
  ReportType,
  StockMovementWithProductResponse,
} from "@/types";
import { AuditLog, User } from "@prisma/client";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton: boolean;
  groupBy?: string;
  selectionMode?: boolean;
  isLoading?: boolean;
  filterGroup?: FiltersGroupType;
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
  searchColumnKey: string;
  filters?: DataTableFilterConfigProps[];
}

export interface DataTableFunctionsProps<TData> {
  table: Table<TData>;
}

export interface ColumnsTableMasterProductsProps {
  isSelectingAction?: boolean;
  onSelect?: (masterProduct: MasterProductWithCategoryGroupSubgroupResponse) => void;
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
  isLoading?: boolean;
}

export interface BaseDataTableExpandableProps<TData> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData>[];
  dataExpandableType: DataExpandableType;
  isLoading?: boolean;
}

export interface DataTableFilterConfigProps {
  columnKey: string; // nome da coluna na tabela (ex: "actionType")
  title?: string; // título do filtro (ex: "Ação")
  options?: Array<{ label: string; value: string }>; // opções para o faceted filter
}

export interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  mode?: FilterModeType;
}

export interface DataTableDropdownProps<T extends string | number>
  extends DeleteRegisterProps<T> {
  formComponent: React.ComponentType<FormAddEditProps>;
  entity: string;
}

export interface ClientDataTableProductProps {
  products: ProductWithMasterProductResponse[];
  addButton: boolean;
  groupBy: string;
}
export interface ClientDataTableMasterProductProps {
  masterProducts: MasterProductWithCategoryGroupSubgroupResponse[];
}
export interface ClientDataTableHistoryProps {
  history: AuditLog[];
  filterGroup: FiltersGroupType;
}
export interface ClientDataTableUserProps {
  users: User[];
}
export interface ClientDataTableStockMovementProps {
  movements: StockMovementWithProductResponse[];
}

export interface ClientDataTableReportProps {
  reportType: ReportType;
  reportData: ReportDataResponse;
  dates?: {
    initialDate?: Date;
    finalDate?: Date;
  };
}
