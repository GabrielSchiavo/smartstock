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
import React from "react";
import { EditProductForm } from "@/components/product-components/edit-product-form";

interface EditDialogProps {
  product: {
    id: number;
  };
}

export function EditProductDialog({ product }: EditDialogProps) {
  return (
    <Dialog>
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
            Edit
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Edit new products here. Click Update Product when done.
          </DialogDescription>
        </DialogHeader>
        <EditProductForm product={product} />
      </DialogContent>
    </Dialog>
  );
}
