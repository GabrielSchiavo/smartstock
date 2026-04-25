'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon, PencilIcon } from 'lucide-react';
import React, { useState } from 'react';
import { AddEditDialogProps, ModeType } from '@/types';

export function AddEditDialog({
  mode,
  entity,
  rowItemId,
  onOpenChange,
  formComponent: FormComponent,
  triggerClassName = '',
  children,
}: AddEditDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  // Configurações baseadas no modo (add/edit)
  const config = {
    [ModeType.ADD]: {
      title: `Cadastrar ${entity}`,
      description: `Clique em 'Salvar' quando terminar.`,
      icon: PlusIcon,
      triggerText: `Cadastrar`,
      variant: 'default' as const,
    },
    [ModeType.EDIT]: {
      title: `Editar ${entity}`,
      description: `Clique em 'Salvar' quando terminar.`,
      icon: PencilIcon,
      triggerText: 'Editar',
      variant: 'ghost' as const,
    },
  }[mode];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant={config.variant}
            size="sm"
            className={`flex cursor-pointer items-center justify-start ${
              mode === 'edit' ? 'text-foreground hover:text-foreground w-full' : ''
            } ${triggerClassName}`}
            title={config.triggerText}
          >
            <config.icon className="h-4 w-4" />
            <span className="inline">{config.triggerText}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col gap-6 overflow-auto rounded-xl sm:max-h-[90vh] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        {mode === ModeType.EDIT ? (
          <FormComponent
            rowItemId={rowItemId}
            onShouldInvalidate={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        ) : (
          <FormComponent
            onShouldInvalidate={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
