"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Lock, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Drawer } from "vaul";

import { useMediaQuery } from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/shared/user-avatar";

export function UserAccountNav() {
  const { data: session } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  const { isMobile } = useMediaQuery();

  if (!user)
    return (
      <div className="size-8 animate-pulse rounded-full border bg-muted" />
    );

  if (isMobile) {
    return (
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger onClick={() => setOpen(true)}>
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
            className="size-9 border"
          />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-40 h-full bg-background/80 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-muted-foreground">
                    {user?.email}
                  </p>
                )}
              </div>
            </div>

            <ul role="list" className="mb-14 mt-1 w-full text-muted-foreground">
              <li className="rounded-lg text-foreground hover:bg-muted">
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <LayoutDashboard className="size-4" />
                  <p className="text-sm">لوحة التحكم</p>
                </Link>
              </li>

              <li className="rounded-lg text-foreground hover:bg-muted">
                <Link
                  href="/dashboard/settings"
                  onClick={closeDrawer}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <Settings className="size-4" />
                  <p className="text-sm">الاعدادات</p>
                </Link>
              </li>

              <li
                className="rounded-lg text-foreground hover:bg-muted"
                onClick={(event) => {
                  event.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  });
              }}
              >
                
                <div className="flex w-full items-center gap-3 px-2.5 py-2">
                  <LogOut className="size-4" />
                  <p className="text-sm">تسجيل الخروج</p>
                </div>
              </li>
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} >
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="size-8 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="rtl:text-end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />


        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard" className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-start">
            <LayoutDashboard className="size-4" />
            <p className="text-sm">لوحة التحكم</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-start"
          >
            <Settings className="size-4" />
            <p className="text-sm">الاعدادات</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
            });
          }}
        >
          <div className="flex items-center gap-2 rtl:flex-row-reverse rtl:justify-start w-full ">
            <LogOut className="size-4" />
            <p className="text-sm">تسجيل الخروج</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
