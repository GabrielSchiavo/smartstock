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
import { BaseDataTableAccordionProps } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AuditLog } from "@prisma/client";
import { formatDateTimeToLocale } from "@/lib/date-utils";

export function BaseDataTableAccordion<TData>({
  table,
  columns,
}: BaseDataTableAccordionProps<TData>) {
  const renderExpandedContent = (data: AuditLog) => (
    <div className="p-6 bg-muted/30 border-t">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações básicas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ID do Log:</span>
              <Badge variant="outline" className="font-mono">
                {data.id}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Data/Hora:
              </span>
              <span className="font-mono text-sm">{formatDateTimeToLocale(data.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                ID do Usuário:
              </span>
              <Badge variant="outline" className="font-mono">
                {data.userId}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Nome do Usuário:
              </span>
              <span className="font-mono text-sm">Teste</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                ID do Registro Alterado:
              </span>
              <Badge variant="outline" className="font-mono">
                {data.recordChangedId}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Detalhes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Ação:</span>
              <Badge variant="outline" className="font-mono">
                {data.actionType}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Local:</span>
              <Badge variant="outline" className="font-mono">
                {data.actionCategory}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor:</span>
                {data.value}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Detalhes:</span>
                {data.observation}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

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
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-0">
                    {renderExpandedContent(row.original as AuditLog)}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Nenhum resultado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
