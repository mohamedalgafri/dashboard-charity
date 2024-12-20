
import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { getMarketingConfig } from "@/config/marketing";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: DocsLayoutProps) {
  const dynamicNavItems = await getMarketingConfig();
  const navItems = dynamicNavItems.mainNav;


  return (
    <div className="flex flex-col">
      <NavMobile navItems={navItems} />
      <NavBar navItems={navItems} />
      <MaxWidthWrapper className="min-h-screen" large>
        {children}
      </MaxWidthWrapper>
      <SiteFooter className="border-t" />
    </div>
  );
}