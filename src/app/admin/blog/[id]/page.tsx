import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { BlogEditorForm } from "@/components/admin/blog-editor-form";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect(`/inloggen?callbackUrl=/admin/blog/${params.id}`);

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <DashboardShell title="Adminpaneel" navItems={ADMIN_NAV} activeHref="/admin/blog">
      <h1 className="mb-6 text-xl font-bold text-ink-950">Artikel bewerken</h1>
      <BlogEditorForm
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          isPublished: post.isPublished,
        }}
      />
    </DashboardShell>
  );
}
