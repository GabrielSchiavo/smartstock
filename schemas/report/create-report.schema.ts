import { z } from "zod";
import { ReportType } from "@/types";

export const CreateReportSchema = z
  .object({
    initialDate: z.coerce.date().optional(),
    finalDate: z.coerce.date().optional(),
    reportType: z.enum(
      [ReportType.VALIDITY, ReportType.DONATIONS, ReportType.PURCHASED, ReportType.INVENTORY],
      { required_error: "Selecione o tipo de relatório." }
    ),
  })
  .refine(
    (data) => !(
      data.reportType !== ReportType.INVENTORY && 
      data.finalDate && 
      data.initialDate && 
      data.finalDate < data.initialDate
    ),
    {
      message: "A data final não pode ser menor que a data inicial.",
      path: ["finalDate"],
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.initialDate),
    {
      message: "Data Inicial é obrigatória.",
      path: ["initialDate"],
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.finalDate),
    {
      message: "Data Final é obrigatória.",
      path: ["finalDate"],
    }
  );