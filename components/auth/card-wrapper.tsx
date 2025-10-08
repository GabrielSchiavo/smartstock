"use client";

import { BackButton } from "@/components/auth/back-button";
import { CardWrapperProps } from "@/types";

export const CardWrapper = ({
  children,
  headerTitle,
  headerLabel,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <section className="w-full max-w-xs">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{headerTitle}</h1>
          <p className="text-muted-foreground text-sm text-balance">
            {headerLabel}
          </p>
        </div>
        {children}
        <div>
          {backButtonLabel === "" ? (
            <></>
          ) : (
            <BackButton label={backButtonLabel} href={backButtonHref} />
          )}
        </div>
      </div>
    </section>
  );
};