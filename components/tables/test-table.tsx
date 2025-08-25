"use client";

import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, AlertTriangle, Clock, User, Terminal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

// Tipo para os logs
interface LogEntry {
  id: number;
  timestamp: string;
  level: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  service: string;
  message: string;
  user: string;
  ip: string;
  details: Record<string, string>;
}

// Dados de exemplo
const sampleLogs: LogEntry[] = [
  {
    id: 1,
    timestamp: '2024-08-22 14:30:15',
    level: 'ERROR',
    service: 'authentication',
    message: 'Failed login attempt',
    user: 'user@example.com',
    ip: '192.168.1.100',
    details: {
      stackTrace: 'AuthenticationError: Invalid credentials\n    at authenticate (auth.js:45)\n    at login (controller.js:23)',
      requestId: 'req_123456789',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      additionalInfo: 'Multiple failed attempts detected from this IP'
    }
  },
  {
    id: 2,
    timestamp: '2024-08-22 14:25:32',
    level: 'INFO',
    service: 'payment',
    message: 'Payment processed successfully',
    user: 'customer@example.com',
    ip: '203.0.113.45',
    details: {
      transactionId: 'txn_987654321',
      amount: '$149.99',
      paymentMethod: 'Credit Card (**** 4242)',
      processingTime: '2.3s',
      gateway: 'Stripe'
    }
  },
  {
    id: 3,
    timestamp: '2024-08-22 14:20:01',
    level: 'WARNING',
    service: 'database',
    message: 'Slow query detected',
    user: 'system',
    ip: '127.0.0.1',
    details: {
      query: 'SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE created_at > ?',
      executionTime: '5.2s',
      affectedRows: '15420',
      suggestion: 'Consider adding index on created_at column'
    }
  },
  {
    id: 4,
    timestamp: '2024-08-22 14:15:44',
    level: 'SUCCESS',
    service: 'backup',
    message: 'Database backup completed',
    user: 'system',
    ip: '127.0.0.1',
    details: {
      backupSize: '2.4 GB',
      duration: '12 minutes',
      location: 's3://backups/db-backup-20240822.sql.gz',
      checksum: 'sha256:a1b2c3d4e5f6...'
    }
  }
];

const LogsTableWithAccordion = () => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
//   const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]);
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper<LogEntry>();

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'destructive';
      case 'WARNING':
        return 'secondary';
      case 'INFO':
        return 'default';
      case 'SUCCESS':
        return 'default';
      default:
        return 'outline';
    }
  };

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleRow(row.original.id)}
          className="h-8 w-8 p-0"
        >
          {expandedRows.has(row.original.id) ? 
            <ChevronDown className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </Button>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('timestamp', {
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Timestamp
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('level', {
      header: () => (
        <div className="flex items-center">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Level
        </div>
      ),
      cell: (info) => {
        const level = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <Badge variant={getLevelVariant(level) as any} className="text-xs">
              {level}
            </Badge>
          </div>
        );
      },
    }),
    columnHelper.accessor('service', {
      header: ({ column }) => (
        <Button 
          variant="ghost" 
          className="h-auto p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Terminal className="mr-2 h-4 w-4" />
          Service
          {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
        </Button>
      ),
      cell: (info) => (
        <Badge variant="outline" className="font-mono">
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('message', {
      header: 'Message',
      cell: (info) => (
        <span className="max-w-xs truncate block">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('user', {
      header: () => (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          User
        </div>
      ),
      cell: (info) => (
        <span className="max-w-xs truncate block text-muted-foreground">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('ip', {
      header: 'IP',
      cell: (info) => (
        <span className="font-mono text-sm">{info.getValue()}</span>
      ),
    }),
  ], [columnHelper, expandedRows, toggleRow]);

  const table = useReactTable({
    data: sampleLogs,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const renderExpandedContent = (log: LogEntry) => (
    <TableRow>
      <TableCell colSpan={columns.length} className="p-0">
        <div className="p-6 bg-muted/30 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações básicas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">ID do Log:</span>
                  <Badge variant="outline" className="font-mono">{log.id}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Timestamp:</span>
                  <span className="font-mono text-sm">{log.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Serviço:</span>
                  <Badge variant="outline" className="font-mono">{log.service}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Usuário:</span>
                  <span className="text-sm">{log.user}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">IP:</span>
                  <span className="font-mono text-sm">{log.ip}</span>
                </div>
              </CardContent>
            </Card>

            {/* Detalhes específicos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Detalhes Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <div className="bg-background p-2 rounded-md border">
                      <code className="text-xs text-foreground break-all">
                        {value}
                      </code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Mensagem completa */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Mensagem Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background p-4 rounded-md border font-mono text-sm">
                {log.message}
              </div>
            </CardContent>
          </Card>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>
            Visualize e analise os logs do sistema com detalhes expandíveis usando TanStack Table
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="text-center">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="text-center hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandedRows.has(row.original.id) && renderExpandedContent(row.original)}
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
          </div>

          {/* Info sobre seleção */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTableWithAccordion;