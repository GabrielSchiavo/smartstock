import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - SmartStock",
  description: "Acompanhe as principais métricas do estoque da sua empresa na dashboard",
};


export default function DashboardPage() {
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <h1 className="text-base font-medium px-4 lg:px-6">Dashboard</h1>
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
  )
}
