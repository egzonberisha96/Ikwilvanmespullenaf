import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt ?? undefined, images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || !post.isPublished) notFound();

  return (
    <article className="container-page max-w-2xl py-14">
      <p className="text-xs text-ink-400">{post.publishedAt && formatDate(post.publishedAt)}</p>
      <h1 className="mt-1 text-3xl font-extrabold text-ink-950">{post.title}</h1>
      <div className="prose prose-ink mt-8 max-w-none whitespace-pre-wrap text-ink-700">{post.content}</div>
    </article>
  );
}
