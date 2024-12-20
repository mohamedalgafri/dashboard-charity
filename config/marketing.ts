// lib/pages.ts
import { db } from "@/lib/db";

export async function getNavigationPages() {
  try {
    const pages = await db.page.findMany({
      where: {
        isPublished: true,
      },
      select: {
        title: true,
        slug: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    return pages.map(page => ({
      title: page.title,
      href: `/${page.slug}`,
    }));
  } catch (error) {
    console.error('Error fetching navigation pages:', error);
    return [];
  }
}

// config/marketing.ts
import { MarketingConfig } from "@/types";

const staticNav = [
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Projects",
    href: "/projects",
  },
];

export async function getMarketingConfig(): Promise<MarketingConfig> {
  const dynamicPages = await getNavigationPages();
  
  return {
    mainNav: [...staticNav, ...dynamicPages],
  };
}
