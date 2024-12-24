import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { getSiteSettings } from "@/lib/settings";
import * as lucideIcons from 'lucide-react';

export async function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {

  const settings = await getSiteSettings();

  return (
    <footer className={cn("border-t", className)}>

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
          <p className="text-left text-sm text-muted-foreground">
              {settings?.siteName}
          </p>
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

            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
