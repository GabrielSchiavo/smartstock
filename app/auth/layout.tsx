"use client";

import { LogoWithText } from "@/components/shared/logo-with-text";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BackgroundImage from "@/public/assets/images/background-image.webp";
import quoteList from "@/data/quote-list.json";
import { QuoteProps } from "@/types";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const [quotes, setQuote] = useState<QuoteProps>();

  useEffect(() => {
    async function loadQuotes() {
      const randomQuote =
        quoteList[Math.floor(Math.random() * quoteList.length)];
      setQuote(randomQuote);
    }

    loadQuotes();
  }, []);

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={BackgroundImage}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Imagem de background"
          aria-hidden="true"
        />
        <div className="absolute w-full bottom-0 left-0 p-6 md:p-10">
          <blockquote className="text-base bg-background/50 backdrop-blur-xs p-4 rounded-2xl shadow space-y-0.5">
            <p>&ldquo;{quotes ? quotes.quote : ""}&rdquo;</p>
            <cite className="text-sm">- {quotes ? quotes.author : ""}</cite>
          </blockquote>
        </div>
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
