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
import { EditUserDialog } from "@/components/user/edit-user-dialog";
import DeleteUserDialog from "@/components/user/delete-user-dialog";
import { AddEditFormProps  } from "@/types";

export function DataTableDropdownUser({ rowItemId }: AddEditFormProps ) {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <EditUserDialog rowItemId={rowItemId} onOpenChange={() => setIsDropdownOpen(false)} />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DeleteUserDialog rowItemId={rowItemId} onOpenChange={() => setIsDropdownOpen(false)} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
