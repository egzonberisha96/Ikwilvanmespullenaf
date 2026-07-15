import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminBlogPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/blog");

  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/blog">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink-950">Blog ({posts.length})</h1>
        <Link href="/admin/blog/nieuw" className="btn-primary text-sm">
          <Plus size={16} /> Nieuw artikel
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((p) => (
          <Link key={p.id} href={`/admin/blog/${p.id}`} className="card flex items-center justify-between p-5 hover:border-brand-300">
            <div>
              <p className="font-semibold text-ink-900">{p.title}</p>
              <p className="text-xs text-ink-500">{formatDate(p.createdAt)}</p>
            </div>
            <span className={`badge ${p.isPublished ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-600"}`}>
              {p.isPublished ? "Gepubliceerd" : "Concept"}
            </span>
          </Link>
        ))}
        {posts.length === 0 && <div className="card p-10 text-center text-sm text-ink-500">Nog geen blogartikelen.</div>}
      </div>
    </DashboardShell>
  );
}
