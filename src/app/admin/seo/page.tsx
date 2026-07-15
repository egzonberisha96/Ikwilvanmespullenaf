import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { CityPageForm } from "@/components/admin/city-page-form";

export default async function AdminSeoPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/seo");

  const cityPages = await prisma.cityLandingPage.findMany({ orderBy: { city: "asc" } });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/seo">
      <h1 className="mb-1 text-xl font-bold text-ink-950">SEO — Stadslandingspagina&apos;s</h1>
      <p className="mb-6 text-sm text-ink-600">
        Voeg per stad een landingspagina toe, bijv. <code>/spullen-verkopen/utrecht</code>, voor betere vindbaarheid in Google.
      </p>
      <CityPageForm />
      <div className="mt-8 space-y-2">
        {cityPages.map((c) => (
          <div key={c.id} className="card flex items-center justify-between p-4 text-sm">
            <span className="font-medium text-ink-900">{c.city}</span>
            <a href={`/spullen-verkopen/${c.slug}`} target="_blank" className="text-brand-700 hover:underline">
              /spullen-verkopen/{c.slug}
            </a>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
