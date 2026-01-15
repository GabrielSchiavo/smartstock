"use client";

import { LogoWithText } from "@/components/shared/logo-with-text";
import Image from "next/image";
import React from "react";
import BackgroundImage from "@/assets/images/background-image.webp";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={BackgroundImage}
          className="absolute inset-0 h-full w-full object-cover saturate-130"
          alt="Imagem de background"
          aria-hidden="true"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-background">
        <div className="flex justify-center gap-2 md:justify-start">
          <LogoWithText
            imageSize="size-8 sm:size-10"
            textSize="text-1xl sm:text-2xl"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
