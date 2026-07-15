import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { formatCurrency } from "@/lib/utils";
import { Inbox, Settings, MapPin, CreditCard, BarChart3, TrendingUp, Gavel, Trophy } from "lucide-react";

const NAV = [
  { href: "/partner", label: "Nieuwe aanvragen", icon: Inbox },
  { href: "/partner/werkgebied", label: "Werkgebied", icon: MapPin },
  { href: "/partner/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/partner/statistieken", label: "Statistieken", icon: BarChart3 },
  { href: "/partner/profiel", label: "Profiel", icon: Settings },
];

export default async function PartnerStatsPage() {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) redirect("/inloggen?callbackUrl=/partner/statistieken");

  const [totalBids, wonBids, totalSpent] = await Promise.all([
    prisma.bid.count({ where: { partnerId } }),
    prisma.bid.count({ where: { partnerId, status: "GEACCEPTEERD" } }),
    prisma.payment.aggregate({ where: { partnerId, status: "PAID" }, _sum: { amount: true } }),
  ]);

  const winRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 100) : 0;

  const stats = [
    { label: "Uitgebrachte biedingen", value: totalBids, icon: Gavel },
    { label: "Gewonnen opdrachten", value: wonBids, icon: Trophy },
    { label: "Winratio", value: `${winRate}%`, icon: TrendingUp },
    { label: "Totaal besteed", value: formatCurrency(Number(totalSpent._sum.amount ?? 0)), icon: CreditCard },
  ];

  return (
    <DashboardShell title="Partnerdashboard" navItems={NAV} activeHref="/partner/statistieken">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Statistieken</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <s.icon className="mb-2 text-brand-600" size={20} />
            <p className="text-2xl font-extrabold text-ink-950">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
