"use client";

import * as React from "react";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ActionType,
  AuditLogWithUserResponse,
  BaseDataTableExpandableProps,
  DataExpandableType,
  EntityType,
  MovementType,
  StockMovementWithProductResponse,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTimeToLocale } from "@/utils/date-utils";
import { Spinner } from "@/components/ui/spinner";
import { DataTableEmpty } from "./_components/data-table-empty";

export function BaseDataTableExpandable<TData>({
  table,
  columns,
  dataExpandableType,
  isLoading = false,
}: BaseDataTableExpandableProps<TData>) {
  const renderAuditLogsExpandedContent = (data: AuditLogWithUserResponse) => {
    const actionColors: Record<string, string> = {
      [ActionType.CREATE]:
        "border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-500",
      [ActionType.UPDATE]:
        "border-0 bg-yellow-500/15 text-yellow-600 dark:text-yellow-500",
      [ActionType.DELETE]:
        "border-0 bg-red-500/15 text-red-600 dark:text-red-500",
      [ActionType.LOGIN]:
        "border-0 bg-sky-500/15 text-sky-600 dark:text-sky-500",
      [ActionType.LOGOUT]:
        "border-0 bg-teal-500/15 text-teal-600 dark:text-teal-500",
    };

    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identificação */}
          <Card className="overflow-x-auto">
            <CardHeader className="">
              <CardTitle className="text-sm">Identificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID do Log:
                </span>
                <Badge variant="outline">{data.id}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Data/Hora:
                </span>
                <span className="text-sm text-end text-wrap">
                  {formatDateTimeToLocale(data.createdAt)}
                </span>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID do Usuário:
                </span>
                <Badge variant="outline">{data.userId}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Nome do Usuário:
                </span>
                <span className="text-sm text-end text-wrap">
                  {data.user.name}
                </span>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID do Registro:
                </span>
                <Badge variant="outline">{data.recordChangedId}</Badge>
              </div>
            </CardContent>
          </Card>
          {/* Detalhes */}
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">Ação:</span>
                <Badge
                  variant="outline"
                  className={`${actionColors[data.actionType]}`}
                >
                  {data.actionType}
                </Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">Entidade:</span>
                <Badge variant="outline">{data.entity}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground text-end text-wrap">
                  {`${data.entity === EntityType.INPUT || data.entity === EntityType.OUTPUT || data.entity === EntityType.ADJUSTMENT_POSITIVE || data.entity === EntityType.ADJUSTMENT_NEGATIVE ? "Quantidade:" : "Nome:"}`}
                </span>
                <span
                  className={`${data.entity === EntityType.OUTPUT || data.entity === EntityType.ADJUSTMENT_NEGATIVE ? "text-red-600 dark:text-red-500" : data.entity === EntityType.INPUT || data.entity === EntityType.ADJUSTMENT_POSITIVE ? "text-emerald-600 dark:text-emerald-500" : ""}`}
                >
                  {data.entity === EntityType.OUTPUT ||
                  data.entity === EntityType.ADJUSTMENT_NEGATIVE
                    ? `- ${data.changedValue}`
                    : data.entity === EntityType.INPUT
                      ? `+ ${data.changedValue}`
                      : data.changedValue}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Mensagem detalhada */}
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-sm">Mensagem Detalhada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 justify-between items-center bg-background p-3 rounded-lg border shadow">
              <span className="font-mono text-sm text-start text-wrap">
                {data.details}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStockMovementsExpandedContent = (
    data: StockMovementWithProductResponse
  ) => {
    const movementColors: Record<string, string> = {
      [MovementType.INPUT]:
        "border-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-500",
      [MovementType.OUTPUT]:
        "border-0 bg-red-500/15 text-red-600 dark:text-red-500",
    };

    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identificação */}
          <Card className="overflow-x-auto">
            <CardHeader className="">
              <CardTitle className="text-sm">Identificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID da Movimentação:
                </span>
                <Badge variant="outline">{data.id}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Data/Hora:
                </span>
                <span className="text-sm text-end text-wrap">
                  {formatDateTimeToLocale(data.createdAt)}
                </span>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID do Produto:
                </span>
                <Badge variant="outline">{data.productId}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Nome do Produto:
                </span>
                <span className="text-sm text-end text-wrap">
                  {data.product.name}
                </span>
              </div>
            </CardContent>
          </Card>
          {/* Detalhes */}
          <Card className="overflow-x-auto">
            <CardHeader>
              <CardTitle className="text-sm">Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge
                  variant="outline"
                  className={`${movementColors[data.movementType]}`}
                >
                  {data.movementType}
                </Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Categoria:
                </span>
                <Badge variant="outline">{data.movementCategory}</Badge>
              </div>
              <div className="flex gap-3 justify-between items-center">
                <span className="text-sm text-muted-foreground text-end text-wrap">
                  Valor:
                </span>
                <span
                  className={`${data.movementType === EntityType.OUTPUT || data.movementType === EntityType.ADJUSTMENT_NEGATIVE ? "text-red-600 dark:text-red-500" : data.movementType === EntityType.INPUT || data.movementType === EntityType.ADJUSTMENT_POSITIVE ? "text-emerald-600 dark:text-emerald-500" : ""}`}
                >
                  {data.movementType === EntityType.OUTPUT ||
                  data.movementType === EntityType.ADJUSTMENT_NEGATIVE
                    ? `- ${data.quantity} ${data.unit}`
                    : data.movementType === EntityType.INPUT
                      ? `+ ${data.quantity} ${data.unit}`
                      : `${data.quantity} ${data.unit}`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Mensagem detalhada */}
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle className="text-sm">Mensagem Detalhada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 justify-between items-center bg-background p-3 rounded-lg border shadow">
              <span className="font-mono text-sm text-start text-wrap">
                {data.details}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="text-center!">
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} className="text-center!">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <React.Fragment key={row.id}>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-center"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>

              {/* Linha expandida */}
              {row.getIsExpanded() && (
                <TableRow className="hover:bg-background">
                  <TableCell colSpan={columns.length} className="p-0">
                    {dataExpandableType === DataExpandableType.AUDIT_LOG
                      ? renderAuditLogsExpandedContent(
                          row.original as AuditLogWithUserResponse
                        )
                      : renderStockMovementsExpandedContent(
                          row.original as StockMovementWithProductResponse
                        )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <div className="flex items-center justify-center">
                <span className="flex items-center text-muted-foreground gap-3">
                  <Spinner className="size-5 shrink-0" />
                  {"Carregando registros..."}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              <DataTableEmpty />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
