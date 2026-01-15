"use client";

import { ProductsCountByValidityStatusChart } from "@/components/dashboard/charts/products-count-by-validity-chart";
import { TotalAmountByMonthChart } from "@/components/dashboard/charts/total-amount-by-month-chart";

export function SectionChartsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="col-span-1 xl:col-span-3">
        <TotalAmountByMonthChart />
      </div>

      <div className="col-span-1 justify-center">
        <ProductsCountByValidityStatusChart />
      </div>
    </div>
  );
}