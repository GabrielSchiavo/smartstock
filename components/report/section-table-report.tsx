"use client";

import { useState } from "react";
import { ReportDataResponse, ReportType } from "@/types";
import { FormReport } from "./form-report";
import { ClientDataTableReport } from "../tables/_clients/client-data-table-report";
import { Separator } from "../ui/separator";

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

      <Separator />

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
