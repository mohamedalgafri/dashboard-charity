import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "",
    items: [
      {
        href: "/admin",
        icon: "dashboard",
        title: "لوحة التحكم",
        authorizeOnly: UserRole.ADMIN,
      },
      // { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
    ],
  },
  {
    title: "المشاريع",
    items: [
      {
        href: "/admin/projects/new",
        icon: "package",
        title: "إنشاء مشروع",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/projects",
        icon: "package",
        title: "المشاريع",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "التبرعات والمتبرعين",
    items: [
      {
        href: "/admin/donations",
        icon: "post",
        title: "التبرعات",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/donors",
        icon: "post",
        title: "المتبرعين",
        authorizeOnly: UserRole.ADMIN,
      }
    ],
  },
  {
    title: "الصفحات",
    items: [
      {
        href: "/admin/pages/create-page",
        icon: "post",
        title: "إنشاء صفحة",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/pages",
        icon: "post",
        title: "الصفحات",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "خيارت",
    items: [
      { href: "/admin/settings", icon: "settings", title: "الاعدادات" },
      { href: "/", icon: "home", title: "الموقع الخارجي" },
    ],
  },
];
