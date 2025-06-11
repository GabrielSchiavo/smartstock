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
import { PencilIcon } from "lucide-react";
import React, { useState } from "react";
import { EditProductForm } from "@/components/product/edit-product-form";
import { AddEditFormProps } from "@/types";

export function EditProductDialog({
  rowItemId,
  onOpenChange,
}: AddEditFormProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="flex justify-start items-center gap-2 cursor-pointer text-foreground hover:text-foreground"
          asChild
          title="Edit"
        >
          <div>
            <PencilIcon className="w-4 h-4" />
            Editar
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] rounded-xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Edite novos produtos aqui. Clique em Atualizar Produto quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm
          rowItemId={rowItemId}
          onShouldInvalidate={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
