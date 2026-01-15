export interface TotalAmountByMonthChartProps {
  month: string;
  monthNumber: number;
  totalKg: number;
  totalL: number;
  totalUN: number;
}

export interface ProductsCountByValidityStatusChartProps {
  expiredCount: number;
  expiringSoonCount: number;
  validCount: number;
}
