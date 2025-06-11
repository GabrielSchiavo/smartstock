import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { cookies } from "next/headers";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main>
      <SidebarProvider defaultOpen={defaultOpen} className="bg-sidebar">
        <AppSidebar />
        <SidebarInset className="m-0 ml-0! sm:m-2 rounded-none sm:rounded-xl shadow-sm">
          <SiteHeader />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
