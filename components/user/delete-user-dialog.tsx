"use client";

import { deleteUser } from "@/actions";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AddEditFormProps, ToastType } from "@/types";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { showToast } from "@/components/utils/show-toast";

export default function DeleteUserDialog({
  rowItemId,
  onOpenChange,
}: AddEditFormProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await deleteUser(rowItemId as string);

      if (response.success === true) {
        setOpen(false);
        if (onOpenChange) onOpenChange(false);
      }

      showToast({
        title: response.title,
        description: response.description,
        type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
      });
    } catch (error) {
      console.error("Algo deu errado:", error);
      showToast({
        title: "Erro!",
        description: "Algo deu errado.",
        type: ToastType.ERROR,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="flex justify-start items-center gap-2 cursor-pointer text-destructive! dark:hover:bg-destructive/12! hover:bg-destructive/15!"
          asChild
          title="Excluir"
        >
          <div>
            <Trash2Icon className="w-4 h-4" />
            Excluir
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel title="Cancel">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 hover:bg-destructive"
              title="Confirm Delete"
              type="submit"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
