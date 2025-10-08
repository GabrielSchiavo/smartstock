"use client";

import Link from "next/link";
import { BackButtonProps } from "@/types";

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <p className="text-muted-foreground text-sm font-normal text-center">
      Voltar para{" "}
      <Link href={href} className="h-fit! w-fit! underline underline-offset-4 hover:text-foreground">
        {label}
      </Link>
    </p>
  );
};
