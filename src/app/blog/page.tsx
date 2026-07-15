import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips en inspiratie over het verkopen van spullen, inboedels ontruimen en meer.",
};

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="mb-8 text-3xl font-extrabold text-ink-950">Blog</h1>
      <div className="space-y-6">
        {posts.map((p) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="card block p-6 hover:border-brand-300">
            <p className="text-xs text-ink-400">{p.publishedAt && formatDate(p.publishedAt)}</p>
            <h2 className="mt-1 text-lg font-bold text-ink-950">{p.title}</h2>
            {p.excerpt && <p className="mt-2 text-sm text-ink-600">{p.excerpt}</p>}
          </Link>
        ))}
        {posts.length === 0 && <p className="text-sm text-ink-500">Binnenkort meer artikelen.</p>}
      </div>
    </div>
  );
}
