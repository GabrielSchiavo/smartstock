import "@/app/globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarMain } from "@/components/layout/sidebar-main";
import { HeaderMain } from "@/components/layout/header-main";
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
      <SidebarProvider defaultOpen={defaultOpen} className="bg-sidebar overflow-x-hidden">
        <SidebarMain />
        <SidebarInset className="m-0 ml-0! sm:m-2 rounded-none sm:rounded-xl shadow-sm">
          <HeaderMain />
          <div className="p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
