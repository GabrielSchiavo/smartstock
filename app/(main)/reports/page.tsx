import { DataTableReports } from "@/components/data-table-reports";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relatórios - SmartStock",
  description: "Vizualize e gere relatórios de estoque",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <h1 className="text-base font-medium px-4 lg:px-6">Relatórios</h1>
          <DataTableReports />
        </div>
      </div>
    </div>
  );
}
