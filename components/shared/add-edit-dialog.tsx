"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon, PencilIcon } from "lucide-react";
import React, { useState } from "react";
import { AddEditDialogProps, ModeType } from "@/types";

export function AddEditDialog({
  mode,
  entity,
  rowItemId,
  onOpenChange,
  formComponent: FormComponent,
  triggerClassName = "",
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
      variant: "default" as const,
    },
    [ModeType.EDIT]: {
      title: `Editar ${entity}`,
      description: `Clique em 'Salvar' quando terminar.`,
      icon: PencilIcon,
      triggerText: "Editar",
      variant: "ghost" as const,
    },
  }[mode];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant={config.variant}
            size="sm"
            className={`flex justify-start items-center cursor-pointer ${
              mode === "edit" ? "w-full text-foreground hover:text-foreground" : ""
            } ${triggerClassName}`}
            title={config.triggerText}
          >
            <config.icon className="w-4 h-4" />
            <span className="inline">{config.triggerText}</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 sm:max-w-4xl sm:max-h-[90vh] max-h-[80vh] rounded-xl overflow-auto">
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
