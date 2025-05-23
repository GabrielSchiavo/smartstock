"use client";

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Bell } from "lucide-react";

export function NotificationButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="cursor-pointer" title="Alertas">
          <Bell />
          <span className="sr-only">Alternar Alertas</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alertas</SheetTitle>
          <SheetDescription>
            Veja todos os alertas aqui.
          </SheetDescription>
        </SheetHeader>
        
        <SheetFooter>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
