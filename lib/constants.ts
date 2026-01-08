import type { NavItem } from "@/types";

export const navigationItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "News", href: "/news" },
];

export const siteConfig = {
  name: "PIPcube",
  description: "Next.js application demonstrating SSG, SSR, and ISR",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
