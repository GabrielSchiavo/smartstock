"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { useEffect, useState, useTransition } from "react";
import { DatePickerMonthYear } from "@/components/date-picker-month-year-selectors";
import { toast } from "sonner";
import {
  DonationsReport,
  generateDonationsReport,
  generateInventoryReport,
  generatePurchasedReport,
  generateValidityReport,
  InventoryReport,
  PurchasedReport,
  ValidityReport,
} from "@/actions/report";
import { DataTableReport } from "@/components/data-table/data-table-reports";
import {
  columnsTableReportInventory,
  columnsTableReportPurchased,
  columnsTableReportValidity,
} from "@/components/data-table/_columns/columns-reports";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateReportSchema } from "@/schemas";
import { columnsTableReportDonations } from "@/components/data-table/_columns/columns-reports";
import { ToolTipHelpReportType } from "@/components/report/tool-tip-help-report-type";
import { ReportType } from "@/types/index.enums";

export const ReportsFormAndResultView = () => {
  const [error, setError] = useState<string | undefined>("");
  const [validityReportData, setValidityReportData] = useState<
    ValidityReport[]
  >([]);
  const [donationsReportData, setDonationsReportData] = useState<
    DonationsReport[]
  >([]);
  const [purchasedReportData, setPurchasedReportData] = useState<
    PurchasedReport[]
  >([]);
  const [inventoryReportData, setInventoryReportData] = useState<
    InventoryReport[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [dates, setDates] = useState<{
    initialDate?: Date;
    finalDate?: Date;
  }>();

  const form = useForm<z.infer<typeof CreateReportSchema>>({
    resolver: zodResolver(CreateReportSchema),
  });

  const selectedType = form.watch("reportType");
  const initialDateValue = form.watch("initialDate");
  const finalDateValue = form.watch("finalDate");

  // Determina se o input deve estar desabilitado
  const isDetailsDisabled = selectedType === ReportType.INVENTORY;

  // Efeito para limpar o valor quando o campo é desabilitado
  useEffect(() => {
    if (isDetailsDisabled && initialDateValue && finalDateValue) {
      form.setValue("initialDate", undefined, { shouldValidate: true });
      form.setValue("finalDate", undefined, { shouldValidate: true });
    }
  }, [isDetailsDisabled, initialDateValue, finalDateValue, form]);

  const onSubmit = (values: z.infer<typeof CreateReportSchema>) => {
    setError("");
    setDates(values);

    startTransition(() => {
      if (values.reportType === ReportType.VALIDITY) {
        generateValidityReport(values.initialDate!, values.finalDate!)
          .then((data) => {
            if (data.error) {
              setError(data.error);
              toast.error("Erro ao gerar relatório!");
            } else if (data.data) {
              setValidityReportData(data.data);
              toast.success("Relatório gerado com sucesso!");
            }
          })
          .catch(() => {
            setError("Algo deu errado!");
            toast.error("Algo deu errado!");
          });
      } else if (values.reportType === ReportType.DONATIONS) {
        generateDonationsReport(values.initialDate!, values.finalDate!)
          .then((data) => {
            if (data.error) {
              setError(data.error);
              toast.error("Erro ao gerar relatório!");
            } else if (data.data) {
              setDonationsReportData(data.data);
              toast.success("Relatório gerado com sucesso!");
            }
          })
          .catch(() => {
            setError("Algo deu errado!");
            toast.error("Algo deu errado!");
          });
      } else if (values.reportType === ReportType.PURCHASED) {
        generatePurchasedReport(values.initialDate!, values.finalDate!)
          .then((data) => {
            if (data.error) {
              setError(data.error);
              toast.error("Erro ao gerar relatório!");
            } else if (data.data) {
              setPurchasedReportData(data.data);
              toast.success("Relatório gerado com sucesso!");
            }
          })
          .catch(() => {
            setError("Algo deu errado!");
            toast.error("Algo deu errado!");
          });
      } else if (values.reportType === ReportType.INVENTORY) {
        generateInventoryReport()
          .then((data) => {
            if (data.error) {
              setError(data.error);
              toast.error("Erro ao gerar relatório!");
            } else if (data.data) {
              setInventoryReportData(data.data);
              toast.success("Relatório gerado com sucesso!");
            }
          })
          .catch(() => {
            setError("Algo deu errado!");
            toast.error("Algo deu errado!");
          });
      }
    });
  };

  return (
    <div className="grid gap-12">
      <div className="flex justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 border rounded-md p-10 w-full md:max-w-[650px]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="grid gap-6 grid-cols-1">
                <FormField
                  control={form.control}
                  name="initialDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Inicial</FormLabel>
                      <FormControl>
                        <DatePickerMonthYear
                          disabled={isDetailsDisabled}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="finalDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Final</FormLabel>
                      <FormControl>
                        <DatePickerMonthYear
                          disabled={isDetailsDisabled}
                          field={field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Tipo de Relatório:
                        <ToolTipHelpReportType />
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value={ReportType.VALIDITY} id="r1" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="r1">
                              Validades
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value={ReportType.DONATIONS} id="r2" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="r2">
                              Doados
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value={ReportType.PURCHASED} id="r3" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="r3">
                              Comprados
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center">
                            <FormControl>
                              <RadioGroupItem value={ReportType.INVENTORY} id="r4" />
                            </FormControl>
                            <FormLabel className="font-normal" htmlFor="r4">
                              Inventário
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormError message={error} />
            <div className="flex justify-end">
              <Button disabled={isPending} type="submit" size="sm">
                {isPending ? "Gerando..." : "Gerar Relatório"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <div>
        {validityReportData.length === 0 &&
          donationsReportData.length === 0 &&
          purchasedReportData.length === 0 &&
          inventoryReportData.length === 0 &&
          dates && (
            <div className="p-6 border rounded-md">
              <p className="text-base text-center italic text-muted-foreground">
                Nenhum registro encontrado para o período selecionado.
              </p>
            </div>
          )}

        {form.watch("reportType") === ReportType.VALIDITY &&
          validityReportData.length > 0 &&
          dates && (
            <DataTableReport<ValidityReport>
              columns={columnsTableReportValidity}
              data={validityReportData}
              initialDate={dates.initialDate}
              finalDate={dates.finalDate}
              reportType={ReportType.VALIDITY}
            />
          )}

        {form.watch("reportType") === ReportType.DONATIONS &&
          donationsReportData.length > 0 &&
          dates && (
            <DataTableReport<DonationsReport>
              columns={columnsTableReportDonations}
              data={donationsReportData}
              initialDate={dates.initialDate}
              finalDate={dates.finalDate}
              reportType={ReportType.DONATIONS}
            />
          )}

        {form.watch("reportType") === ReportType.PURCHASED &&
          purchasedReportData.length > 0 &&
          dates && (
            <DataTableReport<PurchasedReport>
              columns={columnsTableReportPurchased}
              data={purchasedReportData}
              initialDate={dates.initialDate}
              finalDate={dates.finalDate}
              reportType={ReportType.PURCHASED}
            />
          )}
        {form.watch("reportType") === ReportType.INVENTORY &&
          inventoryReportData.length > 0 && (
            <DataTableReport<InventoryReport>
              columns={columnsTableReportInventory}
              data={inventoryReportData}
              reportType={ReportType.INVENTORY}
            />
          )}
      </div>
    </div>
  );
};
