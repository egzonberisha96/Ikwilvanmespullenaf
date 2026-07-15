import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PartnerRequestList } from "@/components/partner/partner-request-list";
import { Inbox, Settings, MapPin, CreditCard, BarChart3 } from "lucide-react";

const NAV = [
  { href: "/partner", label: "Nieuwe aanvragen", icon: Inbox },
  { href: "/partner/werkgebied", label: "Werkgebied", icon: MapPin },
  { href: "/partner/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/partner/statistieken", label: "Statistieken", icon: BarChart3 },
  { href: "/partner/profiel", label: "Profiel", icon: Settings },
];

export default async function PartnerDashboard() {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) redirect("/inloggen?callbackUrl=/partner");

  const partner = await prisma.partner.findUnique({ where: { id: partnerId } });

  if (!partner?.isApproved) {
    return (
      <DashboardShell title="Partnerdashboard" navItems={NAV} activeHref="/partner">
        <div className="card p-8 text-center">
          <h1 className="mb-2 text-lg font-bold text-ink-950">Je account wordt beoordeeld</h1>
          <p className="text-sm text-ink-600">
            Zodra je account is goedgekeurd door ons team, kun je aanvragen bekijken en biedingen uitbrengen.
          </p>
        </div>
      </DashboardShell>
    );
  }

  const requests = await prisma.request.findMany({
    where: {
      status: { in: ["NIEUW", "IN_BEHANDELING", "BIEDINGEN_ONTVANGEN"] },
      OR: [
        { city: { in: partner.workRegions } },
        { postcode: { startsWith: partner.basePostcode?.slice(0, 2) ?? "___" } },
      ],
    },
    include: { photos: true, bids: { where: { partnerId } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <DashboardShell title="Partnerdashboard" navItems={NAV} activeHref="/partner">
      <h1 className="mb-1 text-xl font-bold text-ink-950">Nieuwe aanvragen</h1>
      <p className="mb-6 text-sm text-ink-600">Aanvragen binnen jouw werkgebied ({partner.workRadiusKm} km rondom {partner.baseCity}).</p>
      <PartnerRequestList requests={JSON.parse(JSON.stringify(requests))} />
    </DashboardShell>
  );
}
