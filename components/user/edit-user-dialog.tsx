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

interface EditDialogProps {
  userId: {
    id: string;
  };
}

export function EditUserDialog({ userId }: EditDialogProps) {
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
            <PencilIcon className="w-4 h-4" />
            Editar
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize os usuários aqui. Clique em Atualizar Usuário quando terminar.
          </DialogDescription>
        </DialogHeader>
        <EditUserForm userId={userId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
