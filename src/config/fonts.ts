import { Geist, Geist_Mono, Albert_Sans } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  variable: "--font-geist",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  variable: "--font-geist-mono",
});

export const albertSans = Albert_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
  variable: "--font-albert-sans",
});

