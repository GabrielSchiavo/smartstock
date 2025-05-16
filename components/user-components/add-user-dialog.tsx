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
import { Plus } from "lucide-react";
import { AddUserForm } from "@/components/user-components/add-user-form";

export function AddUserDialog({}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Plus />
          <span className="hidden lg:inline">Create User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] sm:max-h-[90vh] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Create new users here. Click Create User when done.
          </DialogDescription>
        </DialogHeader>
        <AddUserForm />
      </DialogContent>
    </Dialog>
  );
}
