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
import { useEffect, useState, useTransition } from "react";
import { DatePickerMonthYear } from "@/components/shared/date-picker-month-year-selectors";
import {
  generateDonationsReport,
  generateInventoryReport,
  generatePurchasedReport,
  generateValidityReport,
} from "@/actions";
import { DataTableReport } from "@/components/tables/data-table-reports";
import {
  columnsTableReportInventory,
  columnsTableReportPurchased,
  columnsTableReportValidity,
} from "@/components/tables/_columns/columns-table-reports";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateReportSchema } from "@/schemas";
import { columnsTableReportDonations } from "@/components/tables/_columns/columns-table-reports";
import {
  DonationsReportResponse,
  InventoryReportResponse,
  LocaleType,
  PurchasedReportResponse,
  ReportType,
  ToastType,
  ValidityReportResponse,
} from "@/types";
import { MoonLoader } from "react-spinners";
import { showToast } from "@/components/utils/show-toast";
import { ptBR } from "date-fns/locale";
import { ToolTipHelp, TooltipItem } from "@/components/shared/tool-tip-help";

export const FormReportsResultView = () => {
  const [validityReportData, setValidityReportData] = useState<
    ValidityReportResponse[]
  >([]);
  const [donationsReportData, setDonationsReportData] = useState<
    DonationsReportResponse[]
  >([]);
  const [purchasedReportData, setPurchasedReportData] = useState<
    PurchasedReportResponse[]
  >([]);
  const [inventoryReportData, setInventoryReportData] = useState<
    InventoryReportResponse[]
  >([]);
  const [isPending, startTransition] = useTransition();
  const [dates, setDates] = useState<{
    initialDate?: Date;
    finalDate?: Date;
  }>();
  const [noData, setNoData] = useState(false);

  const form = useForm<z.infer<typeof CreateReportSchema>>({
    resolver: zodResolver(CreateReportSchema),
  });

  const selectedType = form.watch("reportType");
  const initialDateValue = form.watch("initialDate");
  const finalDateValue = form.watch("finalDate");

  // Determina se o input deve estar desabilitado
  const isDateRangeDisabled = selectedType === ReportType.INVENTORY;

  // Efeito para limpar o valor quando o campo é desabilitado
  useEffect(() => {
    if (isDateRangeDisabled && initialDateValue && finalDateValue) {
      form.setValue("initialDate", undefined, { shouldValidate: true });
      form.setValue("finalDate", undefined, { shouldValidate: true });
    }
  }, [isDateRangeDisabled, initialDateValue, finalDateValue, form]);

  const watchRadioGroup = form.watch("reportType");

  useEffect(() => {
    setNoData(false);
  }, [watchRadioGroup]);

  const onSubmit = (values: z.infer<typeof CreateReportSchema>) => {
    setDates(values);

    startTransition(async () => {
      setValidityReportData([]);
      setDonationsReportData([]);
      setPurchasedReportData([]);
      setInventoryReportData([]);
      setNoData(false);

      if (values.reportType === ReportType.VALIDITY) {
        try {
          const response = await generateValidityReport(
            values.initialDate!,
            values.finalDate!
          );

          if (response.success === true) {
            setValidityReportData(response.data!);
            setNoData(response.data!.length === 0);
          }

          showToast({
            title: response.title,
            description: response.description,
            type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
          });
        } catch (error) {
          console.error("Algo deu errado:", error);
          showToast({
            title: "Algo deu errado!",
            type: ToastType.ERROR,
          });
        }
      } else if (values.reportType === ReportType.DONATIONS) {
        try {
          const response = await generateDonationsReport(
            values.initialDate!,
            values.finalDate!
          );
          if (response.success === true) {
            setDonationsReportData(response.data!);
            setNoData(response.data!.length === 0);
          }

          showToast({
            title: response.title,
            description: response.description,
            type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
          });
        } catch (error) {
          console.error("Algo deu errado:", error);
          showToast({
            title: "Algo deu errado!",
            type: ToastType.ERROR,
          });
        }
      } else if (values.reportType === ReportType.PURCHASED) {
        try {
          const response = await generatePurchasedReport(
            values.initialDate!,
            values.finalDate!
          );
          if (response.success === true) {
            setPurchasedReportData(response.data!);
            setNoData(response.data!.length === 0);
          }

          showToast({
            title: response.title,
            description: response.description,
            type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
          });
        } catch (error) {
          console.error("Algo deu errado:", error);
          showToast({
            title: "Algo deu errado!",
            type: ToastType.ERROR,
          });
        }
      } else if (values.reportType === ReportType.INVENTORY) {
        try {
          const response = await generateInventoryReport();
          if (response.success === true) {
            setInventoryReportData(response.data!);
            setNoData(response.data!.length === 0);
          }

          showToast({
            title: response.title,
            description: response.description,
            type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
          });
        } catch (error) {
          console.error("Algo deu errado:", error);
          showToast({
            title: "Algo deu errado!",
            type: ToastType.ERROR,
          });
        }
      }
    });
  };

  return (
    <div className="grid gap-12">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center"
        >
          <div className="flex flex-col gap-12 w-full md:max-w-4xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="text-md font-medium">Detalhes do Relatório</h1>
              </div>

              <div className="flex flex-col gap-6 border rounded-xl p-10 shadow">
                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 items-start">
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="initialDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Inicial</FormLabel>
                          <FormControl>
                            <DatePickerMonthYear
                              disabled={isDateRangeDisabled}
                              field={field}
                              locale={ptBR}
                              dateFormat={LocaleType.DD_MM_YYYY}
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
                              disabled={isDateRangeDisabled}
                              field={field}
                              locale={ptBR}
                              dateFormat={LocaleType.DD_MM_YYYY}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="reportType"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex flex-col gap-3">
                            <FormLabel className="flex items-center">
                              Tipo de Relatório:
                              <ToolTipHelp>
                                <TooltipItem>
                                  <p className="text-sm">
                                    <span className="font-semibold">OBS</span> -
                                    Os Relatórios são gerados a partir das Datas
                                    de Recebimento e Validade.
                                  </p>
                                </TooltipItem>
                                <TooltipItem>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      Validades
                                    </span>{" "}
                                    - Gera um relatório de um determinado
                                    período com todos os produtos com Validade,
                                    Lote, Quantidade, status e Dias para Vencer
                                  </p>
                                </TooltipItem>
                                <TooltipItem>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      Doados
                                    </span>{" "}
                                    - Gera um relatório de um determinado
                                    período com todos os produtos doados com
                                    Quantidade, Fornecedor e Data de Recebimento
                                  </p>
                                </TooltipItem>
                                <TooltipItem>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      Comprados
                                    </span>{" "}
                                    - Gera um relatório de um determinado
                                    período com todos os produtos comprados com
                                    Quantidade e Data de Recebimento
                                  </p>
                                </TooltipItem>
                                <TooltipItem>
                                  <p className="text-sm">
                                    <span className="font-semibold">
                                      Inventário
                                    </span>{" "}
                                    - Gera um relatório de todos os produtos
                                    cadastrados no sistema, independente de
                                    período, contém Validade, Quantidade, Lote,
                                    Tipo, Dias para Vencer e Status
                                  </p>
                                </TooltipItem>
                              </ToolTipHelp>
                            </FormLabel>
                            <FormControl className="flex flex-col gap-3">
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col"
                              >
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.VALIDITY}
                                      id="r1"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="r1"
                                  >
                                    Validades
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.DONATIONS}
                                      id="r2"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="r2"
                                  >
                                    Doados
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.PURCHASED}
                                      id="r3"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="r3"
                                  >
                                    Comprados
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.INVENTORY}
                                      id="r4"
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className="font-normal"
                                    htmlFor="r4"
                                  >
                                    Inventário
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button disabled={isPending} type="submit" size="sm">
                {isPending ? (
                  <span className="flex items-center gap-3">
                    <MoonLoader size={16} color="#ffffff" />
                    {"Gerando..."}
                  </span>
                ) : (
                  "Gerar Relatório"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div>
        {noData && dates && (
          <div className="p-6 border rounded-md">
            <p className="text-base text-center italic text-muted-foreground">
              Nenhum registro encontrado para o período selecionado.
            </p>
          </div>
        )}

        {form.watch("reportType") === ReportType.VALIDITY &&
          validityReportData.length > 0 &&
          dates && (
            <DataTableReport<ValidityReportResponse>
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
            <DataTableReport<DonationsReportResponse>
              columns={columnsTableReportDonations}
              data={donationsReportData}
              initialDate={dates.initialDate}
              finalDate={dates.finalDate}
              reportType={ReportType.DONATIONS}
              groupBy="supplier"
            />
          )}

        {form.watch("reportType") === ReportType.PURCHASED &&
          purchasedReportData.length > 0 &&
          dates && (
            <DataTableReport<PurchasedReportResponse>
              columns={columnsTableReportPurchased}
              data={purchasedReportData}
              initialDate={dates.initialDate}
              finalDate={dates.finalDate}
              reportType={ReportType.PURCHASED}
            />
          )}
        {form.watch("reportType") === ReportType.INVENTORY &&
          inventoryReportData.length > 0 && (
            <DataTableReport<InventoryReportResponse>
              columns={columnsTableReportInventory}
              data={inventoryReportData}
              reportType={ReportType.INVENTORY}
              groupBy="group"
            />
          )}
      </div>
    </div>
  );
};
