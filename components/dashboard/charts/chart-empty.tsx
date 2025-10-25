import { ChartPieIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ChartEmpty() {
  return (
    <div className="w-full flex justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ChartPieIcon />
          </EmptyMedia>
          <EmptyTitle>Sem dados</EmptyTitle>
          <EmptyDescription>Nenhum dado foi encontrado.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
