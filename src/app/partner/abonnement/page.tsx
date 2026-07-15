import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SubscriptionCard } from "@/components/partner/subscription-card";
import { Inbox, Settings, MapPin, CreditCard, BarChart3 } from "lucide-react";

const NAV = [
  { href: "/partner", label: "Nieuwe aanvragen", icon: Inbox },
  { href: "/partner/werkgebied", label: "Werkgebied", icon: MapPin },
  { href: "/partner/abonnement", label: "Abonnement", icon: CreditCard },
  { href: "/partner/statistieken", label: "Statistieken", icon: BarChart3 },
  { href: "/partner/profiel", label: "Profiel", icon: Settings },
];

const PLANS = [
  { id: "GRATIS", name: "Gratis", price: 0, features: ["Beperkt aantal aanvragen per maand", "Basis zichtbaarheid"] },
  { id: "BASIS", name: "Basis", price: 29, features: ["Onbeperkt aanvragen bekijken", "Reageren op aanvragen", "E-mailnotificaties"] },
  { id: "PRO", name: "Pro", price: 79, features: ["Alles in Basis", "Prioriteit bij nieuwe aanvragen", "Statistieken dashboard"] },
  { id: "UNLIMITED", name: "Unlimited", price: 149, features: ["Alles in Pro", "Onbeperkt werkgebied", "Persoonlijke accountmanager"] },
];

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) redirect("/inloggen?callbackUrl=/partner/abonnement");

  const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
  if (!partner) redirect("/inloggen");

  return (
    <DashboardShell title="Partnerdashboard" navItems={NAV} activeHref="/partner/abonnement">
      <h1 className="mb-1 text-xl font-bold text-ink-950">Abonnement beheren</h1>
      <p className="mb-6 text-sm text-ink-600">Je huidige abonnement: <strong>{partner.subscriptionPlan}</strong></p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <SubscriptionCard key={plan.id} plan={plan} isCurrent={partner.subscriptionPlan === plan.id} />
        ))}
      </div>
    </DashboardShell>
  );
}
