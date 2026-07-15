import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { formatCurrency } from "@/lib/utils";
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

const NAV = [
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

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin");

  const [userCount, partnerCount, pendingPartners, requestCount, openRequests, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.partner.count(),
    prisma.partner.count({ where: { isApproved: false } }),
    prisma.request.count(),
    prisma.request.count({ where: { status: { in: ["NIEUW", "IN_BEHANDELING", "BIEDINGEN_ONTVANGEN"] } } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  const stats = [
    { label: "Gebruikers", value: userCount },
    { label: "Partners", value: partnerCount, sub: pendingPartners > 0 ? `${pendingPartners} in afwachting` : undefined },
    { label: "Totaal aanvragen", value: requestCount },
    { label: "Open aanvragen", value: openRequests },
    { label: "Totale omzet", value: formatCurrency(Number(revenue._sum.amount ?? 0)) },
  ];

  return (
    <DashboardShell title="Adminpaneel" navItems={NAV} activeHref="/admin">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-2xl font-extrabold text-ink-950">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
            {s.sub && <p className="mt-1 text-xs font-semibold text-amber-600">{s.sub}</p>}
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
