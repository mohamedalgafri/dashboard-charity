
import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getMarketingConfig } from "@/config/marketing";
import { getSiteSettings } from "@/lib/settings";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: DocsLayoutProps) {
  const dynamicNavItems = await getMarketingConfig();
  const navItems = dynamicNavItems.mainNav;
  const settings = await getSiteSettings();


  return (
    <div className="flex flex-col " dir="rtl">
      <NavMobile navItems={navItems}  />
      <NavBar navItems={navItems} settings={settings} />
      <MaxWidthWrapper className="min-h-screen" >
        {children}
      </MaxWidthWrapper>
      <SiteFooter className="border-t" />
    </div>
  );
}