import * as React from "react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { HelpCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VersionBadge } from "@/components/shared/version-badge";
import { DialogTitle } from "@radix-ui/react-dialog";
import { LogoWithText } from "@/components/shared/logo-with-text";

export function AboutButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <HelpCircleIcon />
          Sobre
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle>Sobre</DialogTitle>
          </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4">
          <LogoWithText
            imageSize="size-14"
            textSize="text-4xl"
          />
          <div className="flex w-full flex-col items-center gap-2">
            <Separator />
            <p className="text-md font-light">
              O melhor serviço de gestão de estoque
            </p>
            <Separator />
          </div>

            <p className="text-md text-muted-foreground">
              Copyright &copy; {new Date().getFullYear()} SmartStock
            </p>
            <span className="flex items-center gap-2">
              <p className="text-md">
                <span className="font-semibold">Versão:</span>
              </p>
              <VersionBadge />
            </span>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
