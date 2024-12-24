"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import LoginButton from "../auth/login-button";
import { NavItem } from "@/types";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
  navItems: NavItem[];
  settings?: {
    logoText?: string;
    logoImage?: string;
  }
}

export function NavBar({ scroll = false, large = false, navItems, settings }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all",
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      )}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex gap-2 items-center space-x-1.5">
            
            {
              settings?.logoImage && (
                <img className="size-14 object-contain" src={settings?.logoImage} />
              )
            }
            {
              settings?.logoText && (
                <span className="font-satoshi text-xl font-bold">
                  {settings?.logoText}
                </span>
              )
            }

          </Link>

          {navItems.length > 0 && (
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    // item.href.startsWith(`/${selectedLayout}`)
                    //   ? "text-foreground"
                    //   : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3 space-x-3">

          <Link
            href="/#donate"
            className="hidden md:block"
          >
            <Button
              className="gap-2 px-4"
              variant="default"
              size="sm"
              rounded="xl"
            >
              <span>تبرع الأن</span>
            </Button>
          </Link>

          {session && (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-4"
                variant="default"
                size="sm"
                rounded="xl"
              >
                <span>لوحة التحكم</span>
              </Button>
            </Link>
          )}

        </div>
      </MaxWidthWrapper>
    </header>
  );
}