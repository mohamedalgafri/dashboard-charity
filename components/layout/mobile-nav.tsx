"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import LoginButton from "../auth/login-button";
import { ModeToggle } from "./mode-toggle";
import { NavItem } from "@/types";

interface NavMobileProps {
  scroll?: boolean;
  large?: boolean;
  navItems: NavItem[];
}

export function NavMobile({ scroll = false, large = false, navItems }: NavMobileProps) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";


  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-2 top-2.5 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
      >
        {open ? (
          <X className="size-5 text-muted-foreground" />
        ) : (
          <Menu className="size-5 text-muted-foreground" />
        )}
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-20 hidden w-full overflow-auto bg-background px-5 py-16 lg:hidden",
          open && "block",
        )}
      >
        <div className="flex flex-col">
          <Link href="/" className="flex items-center space-x-1.5 mb-6" onClick={() => setOpen(false)}>
            <Icons.logo />
            <span className="font-satoshi text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>

          <ul className="grid divide-y divide-muted">
            {navItems.map((item, index) => (
              <li key={index} className="py-3">
                <Link
                  href={item.disabled ? "#" : item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex w-full font-medium transition-colors hover:text-foreground/80",
                    // item.href.startsWith(`/${selectedLayout}`)
                    //   ? "text-foreground"
                    //   : "text-foreground/60",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4 border-t">
            {session ? (
              <Link
                href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
                onClick={() => setOpen(false)}
              >
                <Button
                  className="w-full gap-2"
                  variant="default"
                  size="sm"
                  rounded="xl"
                >
                  <span>Dashboard</span>
                </Button>
              </Link>
            ) : status === "unauthenticated" ? (
              <LoginButton mode="modal" asChild>
                <Button variant="default" className="w-full">
                  Sign In
                </Button>
              </LoginButton>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              <Link 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noreferrer"
                className="text-foreground/60 hover:text-foreground"
              >
                <Icons.gitHub className="size-6" />
                <span className="sr-only">GitHub</span>
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}