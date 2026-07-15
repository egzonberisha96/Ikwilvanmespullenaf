import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/inloggen?callbackUrl=/admin/blog/nieuw");

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/blog">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Nieuw artikel</h1>
      <BlogEditorForm
        initial={{ title: "", slug: "", excerpt: "", content: "", metaTitle: "", metaDescription: "", isPublished: false }}
      />
    </DashboardShell>
  );
}
