"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTotalAmountByMonthChart } from "@/actions";
import { Spinner } from "@/components/ui/spinner";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";
import { TotalAmountByMonthChartProps } from "@/types/interfaces/chart.interface";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartEmpty } from "@/components/dashboard/charts/chart-empty";

const chartConfig = {
  totalKg: {
    label: "Total de KG",
    color: "var(--chart-1)",
  },
  totalL: {
    label: "Total de L",
    color: "var(--chart-2)",
  },
  totalUN: {
    label: "Total de UN.",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TotalAmountByMonthChart() {
  const [chartData, setChartData] = useState<TotalAmountByMonthChartProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(
    new Date().getFullYear().toString()
  );

  // Gera dinamicamente o ano atual e 2 anos anteriores
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [currentYear, currentYear - 1, currentYear - 2];
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const selectedYear = parseInt(timeRange);

        const response = await getTotalAmountByMonthChart(selectedYear);

        if (response.success && response.data) {
          setChartData(response.data);
        } else {
          showToast({
            title: response.title,
            description: response.description,
            type: ToastType.ERROR,
          });
        }
      } catch {
        showToast({
          title: "Algo deu errado!",
          description: "Erro ao carregar dados do gráfico.",
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="flex flex-col gap-12 w-full h-full">
        <div className="flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-6 border rounded-xl p-6 shadow h-full">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-md font-medium">Quantidade Total x Mês</h1>
                <p className="text-muted-foreground text-sm">
                  Quantidade total recebida nos meses de {timeRange}.
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  size="sm"
                  className="min-w-[130px]"
                  aria-label="Selecione o ano"
                >
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent align="center">
                  <SelectGroup>
                    <SelectLabel>Anos</SelectLabel>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center min-h-0">
              {isLoading ? (
                <div className="w-full flex justify-center">
                  <span className="flex items-center text-muted-foreground gap-3">
                    <Spinner className="size-7 shrink-0" />
                    {"Carregando dados..."}
                  </span>
                </div>
              ) : !chartData || chartData.length === 0 ? (
                <ChartEmpty />
              ) : (
                <div className="overflow-x-auto w-full">
                  <ChartContainer
                    config={chartConfig}
                    className="max-h-[350px] min-w-[600px] md:min-w-full"
                  >
                    <AreaChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      {/* @ts-expect-error: Recharts types are not fully compatible with ChartTooltipContent props */}
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <defs>
                        <linearGradient
                          id="fillTotalKg"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-totalKg)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-totalKg)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillTotalL"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-totalL)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-totalL)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="fillTotalUN"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-totalL)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-totalL)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        dataKey="totalKg"
                        type="bump"
                        fill="url(#fillTotalKg)"
                        fillOpacity={0.4}
                        stroke="var(--color-totalKg)"
                        stackId="a"
                      />
                      <Area
                        dataKey="totalL"
                        type="bump"
                        fill="url(#fillTotalL)"
                        fillOpacity={0.4}
                        stroke="var(--color-totalL)"
                        stackId="b"
                      />
                      <Area
                        dataKey="totalUN"
                        type="bump"
                        fill="url(#fillTotalUN)"
                        fillOpacity={0.4}
                        stroke="var(--color-totalUN)"
                        stackId="c"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
