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
import { MasterProduct } from "@prisma/client";
import { DataTableMasterProducts } from "@/components/tables/data-table-master-product";
import { columnsTableMasterProducts } from "@/components/tables/_columns/columns-master-product";
import { Input } from "@/components/ui/input";

interface SelectorMasterProductProps {
  masterProducts: MasterProduct[];
  onSelect: (masterProduct: MasterProduct) => void;
  selectedId?: string;
  disabled?: boolean;
}

export function SelectorMasterProduct({
  masterProducts,
  onSelect,
  selectedId,
  disabled,
}: SelectorMasterProductProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = masterProducts.find(
    (item) => item.id.toString() === selectedId
  );

  const handleSelect = (item: MasterProduct) => {
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
          <Input className="default-height" defaultValue={undefined} value={!selectedItem ? "" : `${selectedItem.id.toString()} - ${selectedItem.name}`} disabled={true} placeholder="Selecione um produto mestre..." />
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

        <div className="flex-1 overflow-hidden p-1">
          <DataTableMasterProducts
            addButton={false}
            data={masterProducts}
            columns={columns}
            groupBy="category"
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
