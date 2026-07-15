import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PartnerProfileForm } from "@/components/partner/partner-profile-form";
import { Inbox, Settings, MapPin, CreditCard, BarChart3 } from "lucide-react";

const NAV = [
  { href: "/partner", label: "Nieuwe aanvragen", icon: Inbox },
  { href: "/partner/werkgebied", label: "Werkgebied", icon: MapPin },
  { href: "/partner/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/partner/statistieken", label: "Statistieken", icon: BarChart3 },
  { href: "/partner/profiel", label: "Profiel", icon: Settings },
];

export default async function PartnerProfilePage() {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) redirect("/inloggen?callbackUrl=/partner/profiel");

  const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
  if (!partner) redirect("/inloggen");

  return (
    <DashboardShell title="Partnerdashboard" navItems={NAV} activeHref="/partner/profiel">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Bedrijfsprofiel</h1>
      <PartnerProfileForm
        initial={{
          companyName: partner.companyName,
          description: partner.description ?? "",
          website: partner.website ?? "",
          kvkNumber: partner.kvkNumber ?? "",
        }}
      />
    </DashboardShell>
  );
}
