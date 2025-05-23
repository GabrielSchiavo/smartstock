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
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { EditProductForm } from "@/components/product/edit-product-form";

interface EditDialogProps {
  productId: {
    id: number;
  };
}

export function EditProductDialog({ productId }: EditDialogProps) {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="flex justify-start items-center gap-2 cursor-pointer text-foreground hover:text-foreground"
          asChild
          title="Edit"
        >
          <div>
            <Pencil className="w-4 h-4" />
            Editar
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Edite novos produtos aqui. Clique em Atualizar Produto quando terminar.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm productId={productId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
