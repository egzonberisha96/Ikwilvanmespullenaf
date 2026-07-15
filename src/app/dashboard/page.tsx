import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { REQUEST_TYPE_LABELS, formatDate } from "@/lib/utils";
import { ClipboardList, Settings, Gavel } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Mijn aanvragen", icon: ClipboardList },
  { href: "/dashboard/biedingen", label: "Ontvangen biedingen", icon: Gavel },
  { href: "/dashboard/instellingen", label: "Profielinstellingen", icon: Settings },
];

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen?callbackUrl=/dashboard");

  const requests = await prisma.request.findMany({
    where: { userId: (session.user as any).id },
    include: { bids: true, photos: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell title="Mijn dashboard" navItems={NAV} activeHref="/dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-950">Mijn aanvragen</h1>
        <Link href="/aanvraag" className="btn-primary text-sm">
          Nieuwe aanvraag
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-500">
          Je hebt nog geen aanvragen geplaatst.{" "}
          <Link href="/aanvraag" className="font-semibold text-brand-700">
            Plaats je eerste aanvraag
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/aanvraag/${r.requestNumber}`}
              className="card flex flex-wrap items-center justify-between gap-3 p-5 transition hover:border-brand-300"
            >
              <div>
                <p className="font-semibold text-ink-900">{REQUEST_TYPE_LABELS[r.type]}</p>
                <p className="text-xs text-ink-500">
                  {r.requestNumber} · {formatDate(r.createdAt)} · {r.bids.length} bieding(en)
                </p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
