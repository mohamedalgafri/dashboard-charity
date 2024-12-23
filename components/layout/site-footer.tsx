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
      {/* <div className="container grid max-w-6xl grid-cols-2 gap-6 py-14 md:grid-cols-5">
        {footerLinks.map((section) => (
          <div key={section.title}>
            <span className="text-sm font-medium text-foreground">
              {section.title}
            </span>
            <ul className="mt-4 list-inside space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-full flex flex-col items-end sm:col-span-1 md:col-span-2">
          <NewsletterForm />
        </div>
      </div> */}

      <div className="border-t py-4">
        <div className="container flex max-w-6xl items-center justify-between">
          {/* <span className="text-muted-foreground text-sm">
            Copyright &copy; 2024. All rights reserved.
          </span> */}
          <p className="text-left text-sm text-muted-foreground">
            مؤسسة العطاء
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
