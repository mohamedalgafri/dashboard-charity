"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import LoginButton from "../auth/login-button";
import { ModeToggle } from "./mode-toggle";
import { NavItem } from "@/types";
import * as lucideIcons from 'lucide-react';


interface NavMobileProps {
  scroll?: boolean;
  large?: boolean;
  navItems: NavItem[];
  settings;
}

export function NavMobile({ scroll = false, large = false, navItems,settings }: NavMobileProps) {
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
          "fixed left-2 top-2.5 z-50 rounded-full p-2 transition-colors duration-200 hover:bg-muted focus:outline-none active:bg-muted md:hidden",
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
            {session && (
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
                  <span>لوحة التحكم</span>
                </Button>
              </Link>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">

                {settings?.socialLinks?.map((item) => {
                  const iconName = item?.icon
                    ?.replace(/<|>|\//g, '')
                    ?.trim()
                    ?.replace(/^\w/, c => c.toUpperCase());

                  if (!iconName) return null;

                  const IconComponent = lucideIcons[iconName];
                  if (!IconComponent) return null;

                  return (
                    <Link target="_blank" key={item.name} href={item.url}>
                      <IconComponent className="size-5" />
                    </Link>
                  );
                })}

              </div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}