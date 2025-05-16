"use client";

import { deleteProduct } from "@/actions/product";
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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteDialogProps {
  product: {
    id: number;
  };
}

export default function DeleteProductDialog({ product }: DeleteDialogProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deleteProduct(product.id);

      toast.success(`Product ID ${product.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
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
            <Trash2 className="w-4 h-4" />
            Delete
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            This action cannot be undone. This will permanently delete the plant
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <AlertDialogFooter className="flex gap-4">
            <AlertDialogCancel title="Cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-700 hover:bg-destructive" title="Confirm Delete" type="submit">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
