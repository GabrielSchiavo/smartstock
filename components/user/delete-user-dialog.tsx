"use client";

import { deleteUser } from "@/actions/user";
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
import { toast } from "sonner";

interface DeleteDialogProps {
  userId: {
    id: string;
  };
}

export default function DeleteUserDialog({ userId }: DeleteDialogProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deleteUser(userId.id);

      toast.success(`Usuário com ID ${userId.id} excluído com sucesso`);
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Falha ao excluir usuário");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size={"sm"}
          className="flex justify-start items-center gap-2 cursor-pointer text-destructive! dark:hover:bg-destructive/12! hover:bg-destructive/15!"
          asChild
          title="Delete"
        >
          <div>
            <Trash2Icon className="w-4 h-4" />
            Excluir
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel title="Cancel">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-700 hover:bg-destructive" title="Confirm Delete" type="submit">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}