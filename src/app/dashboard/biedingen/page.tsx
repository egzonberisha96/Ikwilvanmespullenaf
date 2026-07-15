import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { ClipboardList, Settings, Gavel } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Mijn aanvragen", icon: ClipboardList },
  { href: "/dashboard/biedingen", label: "Ontvangen biedingen", icon: Gavel },
  { href: "/dashboard/instellingen", label: "Profielinstellingen", icon: Settings },
];

export default async function BidsOverviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen?callbackUrl=/dashboard/biedingen");

  const bids = await prisma.bid.findMany({
    where: { request: { userId: (session.user as any).id } },
    include: { request: true, partner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell title="Mijn dashboard" navItems={NAV} activeHref="/dashboard/biedingen">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Ontvangen biedingen</h1>
      {bids.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-500">Je hebt nog geen biedingen ontvangen.</div>
      ) : (
        <div className="space-y-3">
          {bids.map((b) => (
            <Link
              key={b.id}
              href={`/aanvraag/${b.request.requestNumber}`}
              className="card flex flex-wrap items-center justify-between gap-3 p-5 hover:border-brand-300"
            >
              <div>
                <p className="font-semibold text-ink-900">{b.partner.companyName}</p>
                <p className="text-xs text-ink-500">
                  {b.request.requestNumber} · {formatDateTime(b.createdAt)}
                </p>
              </div>
              <span className="text-lg font-bold text-brand-700">{formatCurrency(Number(b.amount))}</span>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
