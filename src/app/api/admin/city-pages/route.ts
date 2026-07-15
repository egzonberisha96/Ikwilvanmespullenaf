import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
  }

  const { city } = await req.json();
  if (!city) return NextResponse.json({ error: "Plaatsnaam is verplicht" }, { status: 400 });

  const slug = slugify(city);

  const page = await prisma.cityLandingPage.upsert({
    where: { city },
    update: {},
    create: {
      city,
      slug,
      metaTitle: `Spullen verkopen in ${city} | IkWilVanMeSpullenAf.nl`,
      metaDescription: `Wil je van je spullen af in ${city}? Upload foto's en ontvang binnen 24 uur een bod van lokale partners.`,
    },
  });

  return NextResponse.json(page, { status: 201 });
}
