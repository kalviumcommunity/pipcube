import Link from "next/link";
import { navigationItems } from "@/lib/constants";

export function Navigation() {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            PIPcube
          </Link>
          <ul className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
