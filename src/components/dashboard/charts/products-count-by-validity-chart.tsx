'use client';

import { Label, Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { showToast } from '@/components/utils/show-toast';
import { ToastType } from '@/types';
import { useEffect, useState } from 'react';
import { getProductsCountByValidityStatus } from '@/actions';
import { Spinner } from '@/components/ui/spinner';
import { ChartEmpty } from '@/components/dashboard/charts/chart-empty';

const chartConfig = {
  expired: {
    label: 'Vencidos',
    color: 'var(--chart-1)',
  },
  expiringSoon: {
    label: 'À Vencer',
    color: 'var(--chart-2)',
  },
  valid: {
    label: 'Válidos',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

type ChartDataItem = {
  status: string;
  count: number;
};

export function ProductsCountByValidityStatusChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getProductsCountByValidityStatus();

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
          title: 'Algo deu errado!',
          description: 'Erro ao carregar dados do gráfico.',
          type: ToastType.ERROR,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalProducts = chartData.reduce((sum, item) => sum + item.count, 0);
  const filteredData = chartData.filter((item) => item.count > 0);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex h-full w-full flex-col gap-12">
        <div className="flex h-full flex-col gap-6">
          <div className="flex h-full flex-col gap-6 rounded-xl border p-6 shadow">
            <div className="flex flex-col gap-2">
              <h1 className="text-md font-medium">Status de Validade</h1>
              <p className="text-muted-foreground text-sm">
                Distribuição dos produtos cadastrados por status de validade.
              </p>
            </div>
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
              {isLoading ? (
                <div className="flex w-full justify-center">
                  <span className="text-muted-foreground flex items-center gap-3">
                    <Spinner className="size-7 shrink-0" />
                    {'Carregando dados...'}
                  </span>
                </div>
              ) : !chartData || chartData.length === 0 || totalProducts === 0 ? (
                <ChartEmpty />
              ) : (
                <div className="h-87.5">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <PieChart>
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Pie
                        data={filteredData}
                        dataKey="count"
                        nameKey="status"
                        startAngle={180}
                        endAngle={0}
                        cx="50%"
                        cy="75%"
                        cornerRadius="20%"
                        paddingAngle={2}
                        label={({ payload, ...props }) => {
                          return (
                            <text
                              cx={props.cx}
                              cy={props.cy}
                              x={props.x}
                              y={props.y}
                              textAnchor={props.textAnchor}
                              dominantBaseline={props.dominantBaseline}
                              fill="var(--foreground)"
                            >
                              {payload.count}
                            </text>
                          );
                        }}
                        labelLine={false}
                        innerRadius="60%"
                        outerRadius="80%"
                        strokeWidth={1}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy + 24}
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    dy="0"
                                    className="fill-foreground text-3xl font-bold sm:text-4xl"
                                  >
                                    {totalProducts.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    dy="2rem"
                                    className="fill-muted-foreground text-xs sm:text-sm"
                                  >
                                    Produtos
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
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
