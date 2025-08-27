import "@/styles/globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/providers/active-theme-provider";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import ToastProvider from "@/components/providers/toast-provider";
import { Metadata, Viewport } from "next";
import { META_THEME_COLORS, siteConfig } from "@/config/site";
import { BASE_URL } from "@/config/routes";
import { albertSans, geist, geistMono } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s`,
  },
  metadataBase: new URL(BASE_URL),
  description: siteConfig.description,
  keywords: ["Gestão", "Estoque", "Alimentos", "Software", "Sistema"],
  authors: [
    {
      name: siteConfig.shortName,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.shortName,
  publisher: siteConfig.shortName,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "",
  },
  icons: {
    icon: "/assets/images/favicons/favicon.ico",
    shortcut: "/assets/images/favicons/favicon.ico",
    apple: "/assets/images/favicons/apple-touch-icon.png",
  },
  manifest: `${siteConfig.manifest}`,
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.dark,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");

  return (
    <SessionProvider session={session}>
      <html lang="pt-br" 
      className={`${geist.variable} ${geistMono.variable} ${albertSans.variable} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning>
        <body className={cn(
          `bg-background overscroll-none`,
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : ""
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              <ToastProvider />
              {children}
            </ActiveThemeProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
