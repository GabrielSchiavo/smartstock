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
import { useEffect, useTransition } from "react";
import { DatePickerMonthYear } from "@/components/shared/date-picker-month-year-selectors";
import {
  generateAdjustmentsReport,
  generateDonationsReport,
  generateInputsReport,
  generateInventoryReport,
  generateOutputsReport,
  generatePurchasedReport,
  generateReceiversReport,
  generateSuppliersReport,
  generateValidityReport,
} from "@/actions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreateReportSchema } from "@/schemas";
import {
  FormReportsProps,
  LocaleType,
  ReportDataResponse,
  ReportType,
  ToastType,
} from "@/types";
import { showToast } from "@/components/utils/show-toast";
import { ptBR } from "date-fns/locale";
import { ToolTipHelp, TooltipItem } from "@/components/shared/tool-tip-help";
import { formatEnumValueDisplay } from "@/utils/format-enum-value-display";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon } from "lucide-react";

export const FormReport = ({ onReportGenerated }: FormReportsProps) => {
  const [isPending, startTransition] = useTransition();

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

  const onSubmit = (values: z.infer<typeof CreateReportSchema>) => {
    startTransition(async () => {
      try {
        let response;
        let reportData: ReportDataResponse = [];

        switch (values.reportType) {
          case ReportType.VALIDITY:
            response = await generateValidityReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.DONATIONS:
            response = await generateDonationsReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.PURCHASED:
            response = await generatePurchasedReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.RECEIVERS:
            response = await generateReceiversReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.SUPPLIERS:
            response = await generateSuppliersReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.INVENTORY:
            response = await generateInventoryReport();
            break;
          case ReportType.INPUTS:
            response = await generateInputsReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.OUTPUTS:
            response = await generateOutputsReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          case ReportType.ADJUSTMENTS:
            response = await generateAdjustmentsReport(
              values.initialDate!,
              values.finalDate!
            );
            break;
          default:
            showToast({
              title: "Erro!",
              description: "Tipo de relatório desconhecido!",
              type: ToastType.ERROR,
            });
            return;
        }

        if (response.success === true) {
          reportData = response.data!;
        }

        showToast({
          title: response.title,
          description: response.description,
          type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
        });

        onReportGenerated({
          reportType: values.reportType,
          reportData,
          dates: {
            initialDate: values.initialDate,
            finalDate: values.finalDate,
          },
        });
      } catch (error) {
        console.error("Algo deu errado:", error);
        showToast({
          title: "Algo deu errado!",
          type: ToastType.ERROR,
        });
      }
    });
  };

  return (
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
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.VALIDITY,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os items com suas
                                  respectivas validades em um determinado
                                  período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.DONATIONS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os items doados
                                  em um determinado período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    Comprados
                                  </span>{" "}
                                  - Gera um relatório de todos os items
                                  comprados em um determinado período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.RECEIVERS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os recebedores e
                                  seus items recebidos em um determinado período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.SUPPLIERS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os Fornecedores e
                                  seus items fornecidos em um determinado
                                  período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.INVENTORY,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os produtos
                                  cadastrados no sistema em um determinado
                                  período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.INPUTS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todas as entradas em um
                                  determinado período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.OUTPUTS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todas as saídas em um
                                  determinado período
                                </p>
                              </TooltipItem>
                              <TooltipItem>
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    {formatEnumValueDisplay(
                                      ReportType.ADJUSTMENTS,
                                      "capitalize"
                                    )}
                                  </span>{" "}
                                  - Gera um relatório de todos os ajustes em um
                                  determinado período
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
                              <div className="grid sm:grid-cols-2 grid-cols-1 gap-3 items-start">
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.VALIDITY}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.VALIDITY,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.DONATIONS}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.DONATIONS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.PURCHASED}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Comprados
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.RECEIVERS}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.RECEIVERS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.SUPPLIERS}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.SUPPLIERS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.INVENTORY}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.INVENTORY,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem value={ReportType.INPUTS} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.INPUTS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.OUTPUTS}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.OUTPUTS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={ReportType.ADJUSTMENTS}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {formatEnumValueDisplay(
                                      ReportType.ADJUSTMENTS,
                                      "capitalize"
                                    )}
                                  </FormLabel>
                                </FormItem>
                              </div>
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
                  <Spinner className="size-4 shrink-0" />
                  {"Gerando..."}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <PlusIcon className="size-4 shrink-0" />
                  Gerar Relatório
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
