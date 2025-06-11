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
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import { AddProductForm } from "@/components/product/add-product-form";

export function AddProductDialog({}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <PlusIcon />
          <span className="hidden lg:inline">Criar Produto</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] rounded-xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Criar Produto</DialogTitle>
          <DialogDescription>
            Crie novos produtos aqui. Clique em Criar Produto quando terminar.
          </DialogDescription>
        </DialogHeader>
        <AddProductForm onShouldInvalidate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
