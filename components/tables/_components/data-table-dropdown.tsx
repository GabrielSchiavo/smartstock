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
import { DataTableDropdownProps, ModeType } from "@/types";
import { AddEditDialog } from "@/components/shared/add-edit-dialog";
import DeleteDialog from "@/components/shared/delete-dialog";
import { useState } from "react";

export function DataTableDropdown<T extends string | number>({
  rowItemId,
  formComponent,
  deleteAction,
  entity,
  onOpenChange,
}: DataTableDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
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
            <AddEditDialog
              entity={entity}
              mode={ModeType.EDIT}
              rowItemId={rowItemId}
              formComponent={formComponent}
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteDialog
              rowItemId={rowItemId}
              deleteAction={deleteAction}
              onOpenChange={() => setOpen(false)}
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
