import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { PARTNER_TYPE_LABELS } from "@/lib/utils";
import { PartnerApprovalToggle } from "@/components/admin/partner-approval-toggle";

export default async function AdminPartnersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/partners");

  const partners = await prisma.partner.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/partners">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Partners ({partners.length})</h1>
      <div className="space-y-3">
        {partners.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold text-ink-900">{p.companyName}</p>
              <p className="text-xs text-ink-500">
                {p.user.email} · {PARTNER_TYPE_LABELS[p.type]} · {p.baseCity ?? "Geen regio ingesteld"}
              </p>
            </div>
            <PartnerApprovalToggle partnerId={p.id} isApproved={p.isApproved} isActive={p.isActive} />
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
