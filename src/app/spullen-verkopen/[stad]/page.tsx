import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  const pages = await prisma.cityLandingPage.findMany({ where: { isPublished: true }, select: { slug: true } });
  return pages.map((p) => ({ stad: p.slug }));
}

export async function generateMetadata({ params }: { params: { stad: string } }): Promise<Metadata> {
  const page = await prisma.cityLandingPage.findUnique({ where: { slug: params.stad } });
  if (!page) return {};
  return {
    title: page.metaTitle ?? `Spullen verkopen in ${page.city}`,
    description: page.metaDescription ?? undefined,
    alternates: { canonical: `/spullen-verkopen/${page.slug}` },
  };
}

export default async function CityPage({ params }: { params: { stad: string } }) {
  const page = await prisma.cityLandingPage.findUnique({ where: { slug: params.stad } });
  if (!page || !page.isPublished) notFound();

  return (
    <div className="bg-ink-50 py-16">
      <div className="container-page max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold text-ink-950 sm:text-4xl">
          Spullen verkopen in {page.city}
        </h1>
        <p className="mt-4 text-ink-600">
          Woon je in {page.city} en wil je snel en zonder gedoe van je spullen af? Upload je foto&apos;s en
          ontvang binnen 24 uur een bod of offerte van partners bij jou in de buurt.
        </p>
        {page.content && <div className="mt-6 text-left text-sm text-ink-600">{page.content}</div>}
        <Link href="/aanvraag" className="btn-primary mt-8 inline-flex">
          Start je aanvraag in {page.city} <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
