import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.ikwilvanmespullenaf.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/aanvraag",
    "/hoe-werkt-het",
    "/voor-partners",
    "/veelgestelde-vragen",
    "/blog",
    "/contact",
    "/privacybeleid",
    "/algemene-voorwaarden",
    "/inloggen",
    "/registreren",
    "/partner/registreren",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const [posts, cityPages] = await Promise.all([
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.cityLandingPage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const blogRoutes = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cityRoutes = cityPages.map((c) => ({
    url: `${BASE_URL}/spullen-verkopen/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...cityRoutes];
}
