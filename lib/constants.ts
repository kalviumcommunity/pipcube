import type { NavItem } from "@/types";

export const navigationItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Tickets", href: "/tickets" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Cancellations", href: "/cancellations" },
  { label: "Refunds", href: "/refunds" },
];

export const siteConfig = {
  name: "PIPcube",
  description: "Intercity bus ticket cancellation and refund system",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};
