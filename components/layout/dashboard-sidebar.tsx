"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem, SidebarNavItem } from "@/types";
import { Menu, PanelLeftClose, PanelRightClose } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Icons } from "@/components/shared/icons";
import { useSocket } from "@/hooks/useSocket";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface DashboardSidebarProps {
  links: SidebarNavItem[];
  settings?: {
    logoText?: string;
    logoImage?: string;
  }
}

export function DashboardSidebar({ links: initialLinks, settings }: DashboardSidebarProps) {
  const [links, setLinks] = useState(initialLinks);
  const path = usePathname();
  const socket = useSocket();
  const { isTablet } = useMediaQuery();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(!isTablet);
  const playNotificationSound = useNotificationSound();

  useEffect(() => {
    if (!socket) return;

    socket.on('new-donation', (data) => {
      // تشغيل الصوت أولاً
      playNotificationSound();
      console.log('Playing notification sound'); // للتأكد من تنفيذ الكود

      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/donations') {
            return {
              ...item,
              badge: (item.badge || 0) + 1
            };
          }
          return item;
        })
      })));
    });

    return () => {
      socket.off('new-donation');
    };
}, [socket, playNotificationSound]);

  // تصفير العداد عند زيارة الصفحات
  useEffect(() => {
    if (path === '/admin/donations') {
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/donations') {
            return { ...item, badge: undefined };
          }
          return item;
        })
      })));
    } else if (path === '/admin/contacts') {
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/contacts') {
            return { ...item, badge: undefined };
          }
          return item;
        })
      })));
    }
  }, [path]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    setIsSidebarExpanded(!isTablet);
  }, [isTablet]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 h-full">
        <ScrollArea className="h-full overflow-y-auto ltr:border-r rtl:border-l">
          <aside
            className={cn(
              isSidebarExpanded ? "w-[220px] xl:w-[260px]" : "w-[68px]",
              "hidden h-screen md:block",
            )}
          >
            <div className="flex h-full max-h-screen flex-1 flex-col gap-2">
              <div className="flex h-14 items-center p-4 lg:h-[60px] rtl:flex-row-reverse">
                {isSidebarExpanded ? 
                  <Link href="/" className="flex gap-2 items-center space-x-1.5">
                    {settings?.logoText && (
                      <span className="font-satoshi text-lg font-bold">
                        {settings?.logoText}
                      </span>
                    )}
                    {settings?.logoImage && (
                      <img className="size-14 object-contain" src={settings?.logoImage} alt="Logo" />
                    )}
                  </Link> 
                : null}

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-9 lg:size-8 rtl:ml-0 rtl:mr-auto"
                  onClick={toggleSidebar}
                >
                  {isSidebarExpanded ? (
                    <PanelLeftClose size={18} className="stroke-muted-foreground" />
                  ) : (
                    <PanelRightClose size={18} className="stroke-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </div>

              <nav className="flex flex-1 flex-col gap-4 px-4 pt-1 rtl:text-end">
                {links.map((section) => (
                  <section key={section.title} className="flex flex-col gap-0.5">
                    {isSidebarExpanded ? (
                      <p className="text-xs py-1 text-muted-foreground">
                        {section.title}
                      </p>
                    ) : (
                      <div className="h-4" />
                    )}
                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            {isSidebarExpanded ? (
                              <Link
                                key={`link-${item.title}`}
                                href={item.disabled ? "#" : item.href}
                                className={cn(
                                  "flex items-center gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted rtl:flex-row-reverse",
                                  path === item.href
                                    ? "bg-muted"
                                    : "text-muted-foreground hover:text-accent-foreground",
                                  item.disabled &&
                                    "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                )}
                              >
                                <Icon className="size-5" />
                                {item.title}
                                {item.badge && (
                                  <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                    {item.badge}
                                  </Badge>
                                )}
                              </Link>
                            ) : (
                              <Tooltip key={`tooltip-${item.title}`}>
                                <TooltipTrigger asChild>
                                  <Link
                                    key={`link-tooltip-${item.title}`}
                                    href={item.disabled ? "#" : item.href}
                                    className={cn(
                                      "flex items-center gap-3 rounded-md py-2 text-sm font-medium hover:bg-muted",
                                      path === item.href
                                        ? "bg-muted"
                                        : "text-muted-foreground hover:text-accent-foreground",
                                      item.disabled &&
                                        "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                                    )}
                                  >
                                    <span className="flex size-full items-center justify-center">
                                      <Icon className="size-5" />
                                    </span>
                                    {item.badge && (
                                      <Badge className="absolute top-1 right-1 size-4 items-center justify-center rounded-full p-0">
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  {item.title}
                                  {item.badge && ` (${item.badge})`}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}
              </nav>
            </div>
          </aside>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}

export function MobileSheetSidebar({ links: initialLinks, settings }: DashboardSidebarProps) {
  const [links, setLinks] = useState(initialLinks);
  const socket = useSocket();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { isSm, isMobile } = useMediaQuery();
  const playNotificationSound = useNotificationSound();

  useEffect(() => {
    if (!socket) return;

    // الاستماع لإشعارات التبرعات الجديدة
    socket.on('new-donation', (data) => {
      playNotificationSound();
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/donations') {
            return {
              ...item,
              badge: (item.badge || 0) + 1
            };
          }
          return item;
        })
      })));
    });

    // الاستماع لإشعارات الرسائل الجديدة
    socket.on('new-message', (data) => {
      playNotificationSound();
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/contacts') {
            return {
              ...item,
              badge: (item.badge || 0) + 1
            };
          }
          return item;
        })
      })));
    });

    return () => {
      socket.off('new-donation');
      socket.off('new-message');
    };
  }, [socket, playNotificationSound]);

  // تصفير العداد عند زيارة الصفحات
  useEffect(() => {
    if (path === '/admin/donations') {
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/donations') {
            return { ...item, badge: undefined };
          }
          return item;
        })
      })));
    } else if (path === '/admin/contacts') {
      setLinks(prevLinks => prevLinks.map(section => ({
        ...section,
        items: section.items.map(item => {
          if (item.href === '/admin/contacts') {
            return { ...item, badge: undefined };
          }
          return item;
        })
      })));
    }
  }, [path]);

  if (isSm || isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="size-9 shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col p-0">
          <ScrollArea className="h-full overflow-y-auto">
            <div className="flex h-screen flex-col">
              <nav className="flex flex-1 flex-col gap-y-8 p-6 text-lg font-medium">
                <Link href="/" className="flex gap-2 rtl:flex-row-reverse rtl:justify-start items-center space-x-1.5">
                  {settings?.logoImage && (
                    <img className="size-14 object-contain" src={settings?.logoImage} alt="Logo" />
                  )}
                  {settings?.logoText && (
                    <span className="font-satoshi text-lg font-bold">
                      {settings?.logoText}
                    </span>
                  )}
                </Link>

                {links.map((section) => (
                  <section key={section.title} className="flex flex-col justify-center gap-0.5">
                    <p className="text-xs rtl:text-end text-muted-foreground">
                      {section.title}
                    </p>

                    {section.items.map((item) => {
                      const Icon = Icons[item.icon || "arrowRight"];
                      return (
                        item.href && (
                          <Fragment key={`link-fragment-${item.title}`}>
                            <Link
                              key={`link-${item.title}`}
                              onClick={() => {
                                if (!item.disabled) setOpen(false);
                              }}
                              href={item.disabled ? "#" : item.href}
                              className={cn(
                                "flex items-center rtl:flex-row-reverse gap-3 rounded-md p-2 text-sm font-medium hover:bg-muted",
                                path === item.href
                                  ? "bg-muted"
                                  : "text-muted-foreground hover:text-accent-foreground",
                                item.disabled &&
                                  "cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground",
                              )}
                            >
                              <Icon className="size-5" />
                              {item.title}
                              {item.badge && (
                                <Badge className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </Fragment>
                        )
                      );
                    })}
                  </section>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex size-9 animate-pulse rounded-lg bg-muted md:hidden" />
  );
}