import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ClipboardList, Settings, Gavel } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Mijn aanvragen", icon: ClipboardList },
  { href: "/dashboard/biedingen", label: "Ontvangen biedingen", icon: Gavel },
  { href: "/dashboard/instellingen", label: "Profielinstellingen", icon: Settings },
];

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/inloggen?callbackUrl=/dashboard/instellingen");

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) redirect("/inloggen");

  return (
    <DashboardShell title="Mijn dashboard" navItems={NAV} activeHref="/dashboard/instellingen">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Profielinstellingen</h1>
      <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone ?? "" }} />
    </DashboardShell>
  );
}
