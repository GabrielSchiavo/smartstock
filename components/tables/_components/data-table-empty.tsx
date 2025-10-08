import React from "react";
import { TextSearchIcon } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function DataTableEmpty() {
  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TextSearchIcon />
        </EmptyMedia>
        <EmptyTitle>Sem registros</EmptyTitle>
        <EmptyDescription>
          Nenhum registro foi criado ainda.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
