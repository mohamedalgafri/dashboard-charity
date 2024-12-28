// config/dashboard.ts
import { UserRole } from "@prisma/client";
import { SidebarNavItem } from "@/types";

export async function getDashboardLinks(unreadDonations: number = 0, unreadMessages: number = 0) {
  return [
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
          icon: "add",
          title: "إنشاء حملة",
          authorizeOnly: UserRole.ADMIN,
        },
        {
          href: "/admin/projects",
          icon: "HandHeart",
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
          icon: "Wallet",
          title: "التبرعات",
          badge: unreadDonations,
          authorizeOnly: UserRole.ADMIN,
        },
        {
          href: "/admin/donors",
          icon: "Users",
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
          icon: "MessagesSquare",
          title: "رسائل التواصل",
          // badge: unreadMessages,
          authorizeOnly: UserRole.ADMIN,
        },
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
  ] as SidebarNavItem[];
}