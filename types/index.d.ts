import { User, UserRole } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export interface Input {
  id: number;
  label: string | null;
  type: string | null;
  value: string | null;
  sectionId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: number;
  title: string | null;
  pageId: number;
  layoutType: string | null;
  order: number | null;
  isVisible: boolean;
  showBgColor: boolean;
  bgColor: string | null;
  inputs: Input[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: number;
  title: string;
  slug: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  headerTitle: string | null;
  headerDescription: string | null;
  showHeader: boolean | null;
  isPublished: boolean;
  publishedAt: Date | null;
  sections: Section[];
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  mailSupport: string;
  links: {
    twitter: string;
    github: string;
  };
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
  mainNav: MainNavItem[];
};

export type SidebarNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

