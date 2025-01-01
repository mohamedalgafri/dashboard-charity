// app/(protected)/layout.tsx
import { redirect } from "next/navigation";

import { getDashboardLinks } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { SearchCommand } from "@/components/dashboard/search-command";
import {
  DashboardSidebar,
  MobileSheetSidebar,
} from "@/components/layout/dashboard-sidebar";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getSiteSettings } from "@/lib/settings";
import { getUnreadCounts } from "@/lib/counts";
import { Toaster } from "@/components/ui/toaster";
import { NotificationsButton } from "@/components/content/NotificationsDropdown";
import { DashboardInit } from "@/components/content/DashboardInit";
import { MessagesProvider } from "@/components/MessagesProvider";
import { NotificationsProvider } from "@/components/NotificationsProvider";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await getCurrentUser();
  const settings = await getSiteSettings();
  const { unreadDonations, unreadMessages } = await getUnreadCounts();
  
  // if (!user) redirect("/login");

  const sidebarLinks = await getDashboardLinks(unreadDonations, unreadMessages);

  const filteredLinks = sidebarLinks.map((section) => ({
    ...section,
    items: section.items.filter(
      ({ authorizeOnly }) => !authorizeOnly || authorizeOnly === user?.role,
    ),
  }));

  return (

  
    <div dir="rtl" className="relative flex min-h-screen w-full">
      <DashboardInit />
      <Toaster />
      <NotificationsProvider />
      <MessagesProvider />
      <DashboardSidebar links={filteredLinks} settings={settings} />

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 bg-background px-4 lg:h-[60px] xl:px-8">
          <MaxWidthWrapper className="flex max-w-7xl items-center gap-x-3 px-0">
            <MobileSheetSidebar links={filteredLinks} settings={settings} />

            <div className="w-full flex-1">
              <SearchCommand links={filteredLinks} />
            </div>

            {/* <NotificationsButton /> */}
            <ModeToggle />
            <UserAccountNav />
          </MaxWidthWrapper>
        </header>

        <main className="flex-1 p-4 xl:px-8">
          <MaxWidthWrapper className="flex h-full max-w-7xl flex-col gap-4 px-0 lg:gap-6">
            {children}
          </MaxWidthWrapper>
        </main>
      </div>
    </div>
  );
}