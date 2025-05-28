import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { EditProductDialog } from "@/components/product/edit-product-dialog";
import DeleteProductDialog from "@/components/product/delete-product-dialog";
import { AddEditFormProps  } from "@/types";

export function DataTableDropdownProduct({ rowItemId }: AddEditFormProps ) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <EditProductDialog rowItemId={rowItemId} onOpenChange={() => setIsDropdownOpen(false)} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteProductDialog rowItemId={rowItemId} onOpenChange={() => setIsDropdownOpen(false)} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
