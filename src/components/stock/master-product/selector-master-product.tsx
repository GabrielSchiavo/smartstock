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
import { DataTableMasterProducts } from "@/components/tables/data-table-master-products";
import { columnsTableMasterProducts } from "@/components/tables/_columns/columns-table-master-products";
import { Input } from "@/components/ui/input";
import { MasterProductWithCategoryGroupSubgroupResponse, SelectorMasterProductProps } from "@/types";

export function SelectorMasterProduct({
  masterProducts,
  onSelect,
  selectedId,
  disabled,
  isLoading = false,
}: SelectorMasterProductProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = masterProducts.find(
    (item) => item.id.toString() === selectedId
  );

  const handleSelect = (item: MasterProductWithCategoryGroupSubgroupResponse) => {
    onSelect(item);
    setIsOpen(false);
  };

  const columns = columnsTableMasterProducts({
    isSelectingAction: true,
    onSelect: handleSelect,
    selectedMasterProductId: selectedId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex w-full items-center gap-4">
          <Input className="default-btn-field-height" defaultValue={undefined} value={!selectedItem ? "" : `${selectedItem.id.toString()} - ${selectedItem.name}`} disabled={true} placeholder="Selecione um produto mestre..." />
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
          <DialogTitle>Selecionar Produto Mestre</DialogTitle>
          <DialogDescription>
            Clique em Selecionar para escolher o Produto Mestre.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-1">
          <DataTableMasterProducts
            addButton={false}
            data={masterProducts}
            columns={columns}
            groupBy="category.name"
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
