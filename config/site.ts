import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";


const site_url = env.NEXT_PUBLIC_APP_URL;


export const siteConfig: SiteConfig = {
  name: "العطاء",
  description:
    "مؤسسة العطاء المستدام",
  url: site_url,
  ogImage: ``,
  links: {
    twitter: "",
    github: "",
  },
  mailSupport: "support@next-starter.fake",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  }
];
