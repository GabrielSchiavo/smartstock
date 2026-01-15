"use client";

import { deleteAllAlerts } from "@/actions";
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
import { Trash2Icon } from "lucide-react";
import { showToast } from "@/components/utils/show-toast";
import { ToastType } from "@/types";

export default function DeleteAlertsDialog({
  onDeleteSuccess,
}: {
  onDeleteSuccess: () => void;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await deleteAllAlerts();

      showToast({
        title: response.title,
        description: response.description,
        type: response.success ? ToastType.SUCCESS : ToastType.ERROR,
      });
      if (response.success) {
        onDeleteSuccess(); // Chama a função de atualização
      }
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size={"sm"}
          className="w-full bg-red-700! hover:bg-destructive!"
        >
          <span className="flex gap-1.5 items-center">
            <Trash2Icon className="size-4 shrink-0" />
            Excluir todos
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente todos
            os alertas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel title="Cancelar">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 hover:bg-destructive"
              title="Confirmar Exclusão"
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
