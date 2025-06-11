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
import { EditUserForm } from "@/components/user/edit-user-form";
import { useState } from "react";
import { AddEditFormProps } from "@/types";

export function EditUserDialog({ rowItemId, onOpenChange }: AddEditFormProps) {
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
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os usuários aqui. Clique em Atualizar Usuário quando terminar.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm rowItemId={rowItemId} onShouldInvalidate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
