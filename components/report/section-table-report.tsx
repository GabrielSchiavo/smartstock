"use client";

import { useState } from "react";
import { ReportDataResponse, ReportType } from "@/types";
import { FormReport } from "@/components/report/form-report";
import { ClientDataTableReport } from "@/components/tables/_clients/client-data-table-report";
import { Separator } from "@/components/ui/separator";

export const SectionFormTableReport = () => {
  const [reportResults, setReportResults] = useState<{
    reportType: ReportType;
    reportData: ReportDataResponse;
    dates?: { initialDate?: Date; finalDate?: Date };
  } | null>(null);

  const handleReportGenerated = (data: {
    reportType: ReportType;
    reportData: ReportDataResponse;
    dates?: { initialDate?: Date; finalDate?: Date };
  }) => {
    setReportResults(data);
  };

  return (
    <div className="grid gap-12">
      <FormReport onReportGenerated={handleReportGenerated} />

      <Separator className="-mx-6 w-auto!" />

      {reportResults && (
        <ClientDataTableReport
          reportType={reportResults.reportType}
          reportData={reportResults.reportData}
          dates={reportResults.dates}
        />
      )}
    </div>
  );
};
