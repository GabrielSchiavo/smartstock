"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableProducts } from "@/components/tables/data-table-products";
import { columnsTableProducts } from "@/components/tables/_columns/columns-table-products";
import {
  ProductWithMasterProductResponse,
  SelectorProductProps,
} from "@/types";

export function SelectorProduct({
  products,
  onSelect,
  selectedId,
  disabled,
  isLoading = false,
}: SelectorProductProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = products.find(
    (item) => item.id.toString() === selectedId
  );

  const handleSelect = (item: ProductWithMasterProductResponse) => {
    onSelect(item);
    setIsOpen(false);
  };

  const columns = columnsTableProducts({
    isSelectingAction: true,
    onSelect: handleSelect,
    selectedProductId: selectedId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full items-center gap-4">
          <Input
            className="default-height"
            defaultValue={undefined}
            value={
              !selectedItem
                ? ""
                : `${selectedItem.id.toString()} - ${selectedItem.name}`
            }
            disabled={true}
            placeholder="Selecione um produto..."
          />
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            size={"sm"}
          >
            Selecionar
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] sm:max-h-[90vh] max-h-[80vh] rounded-xl overflow-hidden flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle>Selecionar Produto</DialogTitle>
          <DialogDescription>
            Clique em Selecionar para escolher o Produto.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <DataTableProducts
            addButton={false}
            data={products}
            columns={columns}
            groupBy="masterProduct.group.name"
            isLoading={isLoading}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
