import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { REQUEST_TYPE_LABELS, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";
import Link from "next/link";

export default async function AdminRequestsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/aanvragen");

  const requests = await prisma.request.findMany({
    include: { bids: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/aanvragen">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Aanvragen ({requests.length})</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink-50 text-xs uppercase text-ink-500">
            <tr>
              <th className="px-4 py-3">Nummer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Plaats</th>
              <th className="px-4 py-3">Biedingen</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Datum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <Link href={`/aanvraag/${r.requestNumber}`} className="font-medium text-brand-700 hover:underline">
                    {r.requestNumber}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{REQUEST_TYPE_LABELS[r.type]}</td>
                <td className="px-4 py-3 text-ink-600">{r.city}</td>
                <td className="px-4 py-3 text-ink-600">{r.bids.length}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-ink-500">{formatDate(r.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
