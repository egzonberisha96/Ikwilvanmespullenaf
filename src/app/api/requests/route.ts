import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requestFormSchema } from "@/lib/validations";
import { generateRequestNumber, normalizePostcode } from "@/lib/utils";
import { emailService } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const session = await getServerSession(authOptions);

    const count = await prisma.request.count();
    const requestNumber = generateRequestNumber(count + 1);
    const postcodePrefix = normalizePostcode(data.postcode).slice(0, 4);

    const request = await prisma.request.create({
      data: {
        requestNumber,
        type: data.type,
        categoryId: data.categoryId ?? undefined,
        description: data.description,
        postcode: data.postcode,
        city: data.city,
        street: data.street,
        houseNumber: data.houseNumber,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        userId: (session?.user as any)?.id ?? undefined,
        photos: {
          create: data.photos.map((p, i) => ({ url: p.url, key: p.key, sortOrder: i })),
        },
      },
    });

    // Bevestigingsmail naar de klant
    await emailService.sendNewRequestConfirmation(data.contactEmail, data.contactName, requestNumber);

    // Vind relevante, actieve, goedgekeurde partners in de regio en stuur notificatie + mail
    const matchingPartners = await prisma.partner.findMany({
      where: {
        isActive: true,
        isApproved: true,
        OR: [
          { workRegions: { has: data.city } },
          { workRegions: { has: postcodePrefix } },
          { basePostcode: { startsWith: postcodePrefix.slice(0, 2) } },
        ],
      },
      include: { user: true },
      take: 25,
    });

    await Promise.all(
      matchingPartners.map(async (partner) => {
        await prisma.notification.create({
          data: {
            userId: partner.userId,
            type: "NIEUWE_AANVRAAG",
            title: "Nieuwe aanvraag beschikbaar",
            message: `Nieuwe aanvraag ${requestNumber} in ${data.city}.`,
            link: "/partner/aanvragen",
          },
        });
        await emailService.sendNewRequestToPartner(partner.user.email, partner.companyName, requestNumber, data.city);
      })
    );

    return NextResponse.json({ requestNumber, id: request.id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/requests error:", error);
    return NextResponse.json({ error: "Er ging iets mis bij het verwerken van je aanvraag" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestNumber = searchParams.get("nummer");

  if (!requestNumber) {
    return NextResponse.json({ error: "Aanvraagnummer ontbreekt" }, { status: 400 });
  }

  const request = await prisma.request.findUnique({
    where: { requestNumber },
    include: {
      photos: true,
      bids: { include: { partner: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!request) {
    return NextResponse.json({ error: "Aanvraag niet gevonden" }, { status: 404 });
  }

  return NextResponse.json(request);
}
