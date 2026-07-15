import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  CONCEPT: "Concept",
  VERZONDEN: "Verzonden",
  BETAALD: "Betaald",
  ACHTERSTALLIG: "Achterstallig",
  GEANNULEERD: "Geannuleerd",
};

export default async function AdminInvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/facturen");

  const invoices = await prisma.invoice.findMany({
    include: { partner: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/facturen">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Facturen ({invoices.length})</h1>
      {invoices.length === 0 ? (
        <div className="card p-10 text-center text-sm text-ink-500">
          Nog geen facturen aangemaakt. Facturen worden automatisch gegenereerd op basis van het commissiemodel.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-4 py-3">Factuurnummer</th>
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Bedrag</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-medium text-ink-900">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-ink-600">{inv.partner.companyName}</td>
                  <td className="px-4 py-3 text-ink-600">{formatCurrency(Number(inv.amount))}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-ink-100 text-ink-700">{STATUS_LABELS[inv.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(inv.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
