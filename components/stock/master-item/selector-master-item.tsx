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
import { DataTableMasterItems } from "@/components/tables/data-table-master-item";
import { columnsTableMasterItems } from "@/components/tables/_columns/columns-master-item";
import { Input } from "@/components/ui/input";

interface SelectorMasterItemProps {
  masterItems: MasterProduct[];
  onSelect: (masterProduct: MasterProduct) => void;
  selectedId?: string;
  disabled?: boolean;
}

export function SelectorMasterItem({
  masterItems,
  onSelect,
  selectedId,
  disabled,
}: SelectorMasterItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = masterItems.find(
    (item) => item.id.toString() === selectedId
  );

  const handleSelect = (item: MasterProduct) => {
    onSelect(item);
    setIsOpen(false);
  };

  const columns = columnsTableMasterItems({
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
          <DataTableMasterItems
            addButton={false}
            data={masterItems}
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
