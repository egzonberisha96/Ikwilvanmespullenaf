import {
  LayoutDashboard,
  Users,
  Handshake,
  ClipboardList,
  Percent,
  Receipt,
  FileText,
  Star,
  Search,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/gebruikers", label: "Gebruikers", icon: Users },
  { href: "/admin/partners", label: "Partners", icon: Handshake },
  { href: "/admin/aanvragen", label: "Aanvragen", icon: ClipboardList },
  { href: "/admin/commissies", label: "Commissies", icon: Percent },
  { href: "/admin/facturen", label: "Facturen", icon: Receipt },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/seo", label: "SEO", icon: Search },
];
