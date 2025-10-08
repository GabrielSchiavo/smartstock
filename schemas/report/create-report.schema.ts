import { z } from "zod";
import { ReportType } from "@/types";

export const CreateReportSchema = z
  .object({
    initialDate: z.date().optional(),
    finalDate: z.date().optional(),
    reportType: z.enum(
      [ReportType.VALIDITY, ReportType.DONATIONS, ReportType.PURCHASED, ReportType.RECEIVERS, ReportType.SUPPLIERS, ReportType.INVENTORY, ReportType.INPUTS, ReportType.OUTPUTS, ReportType.ADJUSTMENTS],
{
        error: (issue) => {
          if (issue.input === undefined) {
            return { message: `Selecione o tipo de relatório.` };
          }
          if (issue.code === "invalid_value") {
            return { message: `Selecione o tipo de relatório.` };
          }

          return "Inválido.";
        },
      }
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
      path: ["finalDate"],
      message: "A data final não pode ser menor que a data inicial."
    }
  )
  .refine(
    (data) => !(
      data.reportType !== ReportType.INVENTORY &&
      data.finalDate &&
      data.initialDate &&
      data.initialDate > data.finalDate
    ),
    {
      path: ["initialDate"],
      message: "Data inicial não pode ser maior que data final."
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.initialDate),
    {
      path: ["initialDate"],
      message: "Data Inicial é obrigatória."
    }
  )
  .refine(
    (data) => !(data.reportType !== ReportType.INVENTORY && !data.finalDate),
    {
      path: ["finalDate"],
      message: "Data Final é obrigatória."
    }
  );