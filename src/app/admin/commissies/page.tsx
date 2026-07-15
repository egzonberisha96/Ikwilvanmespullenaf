import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { CommissionSettingsForm } from "@/components/admin/commission-settings-form";

export default async function AdminCommissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/commissies");

  const settings = await prisma.setting.findMany({
    where: { key: { in: ["commission_type", "commission_fixed_amount", "commission_percentage"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/commissies">
      <h1 className="mb-1 text-xl font-bold text-ink-950">Commissiemodel</h1>
      <p className="mb-6 text-sm text-ink-600">
        Stel het platformbrede commissiemodel in. Individuele partners kunnen hiervan afwijken via hun partnerprofiel.
      </p>
      <CommissionSettingsForm
        initial={{
          type: map.commission_type ?? "VAST_BEDRAG",
          fixedAmount: map.commission_fixed_amount ?? "15",
          percentage: map.commission_percentage ?? "10",
        }}
      />
    </DashboardShell>
  );
}
