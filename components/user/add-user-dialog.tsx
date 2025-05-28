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
import { AddUserForm } from "@/components/user/add-user-form";
import { useState } from "react";

export function AddUserDialog({}) {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <PlusIcon />
          <span className="hidden lg:inline">Criar Usuário</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Criar Usuário</DialogTitle>
          <DialogDescription>
            Crie novos usuários aqui. Clique em Criar Usuário quando terminar.
          </DialogDescription>
        </DialogHeader>
        <AddUserForm onShouldInvalidate={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
