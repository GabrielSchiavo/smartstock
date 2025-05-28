import "@/app/globals.css";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
