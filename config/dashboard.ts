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
    ],
  },
  {
    title: "الحملات",
    items: [
      {
        href: "/admin/projects/new",
        icon: "add", // Using "add" from your available icons
        title: "إنشاء حملة",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/projects",
        icon: "HandHeart", // Using "media" from your available icons
        title: "الحملات",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "التبرعات والمتبرعين",
    items: [
      {
        href: "/admin/donations",
        icon: "Wallet", // Using existing icon
        title: "التبرعات",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/donors",
        icon: "Users", // Using "users" if it's available, otherwise we'll need to change this
        title: "المتبرعين",
        authorizeOnly: UserRole.ADMIN,
      }
    ],
  },
  {
    title: "تواصل معنا",
    items: [
      {
        href: "/admin/contacts",
        icon: "MessagesSquare", // Using existing icon
        title: "رسائل التواصل",
        authorizeOnly: UserRole.ADMIN,
      },
    ],
  },
  {
    title: "الصفحات",
    items: [
      {
        href: "/admin/pages/create-page",
        icon: "add", // Using "add" from your available icons
        title: "إنشاء صفحة",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/admin/pages",
        icon: "post", // Using existing icon
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