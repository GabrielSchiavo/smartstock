"use client";

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

export default function DeleteProductDialog() {
  return (
    <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size={"sm"}
                className="w-full cursor-pointer text-destructive! dark:hover:bg-destructive/12! hover:bg-destructive/15!"
              >
                <Trash2Icon />
                Excluir alertas
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
              <form>
                <AlertDialogFooter className="flex gap-4">
                  <AlertDialogCancel title="Cancelar">
                    Cancelar
                  </AlertDialogCancel>
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
