import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  title,
  navItems,
  activeHref,
  children,
}: {
  title: string;
  navItems: DashboardNavItem[];
  activeHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page grid gap-6 py-8 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-20 md:h-fit">
        <h2 className="mb-4 px-2 text-lg font-extrabold text-ink-950">{title}</h2>
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition",
                activeHref === item.href ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
