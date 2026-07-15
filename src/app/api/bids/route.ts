import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bidSchema } from "@/lib/validations";
import { emailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId as string | undefined;

  if (!session || !partnerId) {
    return NextResponse.json({ error: "Alleen partners kunnen biedingen uitbrengen" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = bidSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" }, { status: 400 });
  }

  const { requestId, amount, message, isQuote } = parsed.data;

  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return NextResponse.json({ error: "Aanvraag niet gevonden" }, { status: 404 });

  const bid = await prisma.bid.upsert({
    where: { requestId_partnerId: { requestId, partnerId } },
    update: { amount, message, isQuote },
    create: { requestId, partnerId, amount, message, isQuote },
  });

  await prisma.request.update({
    where: { id: requestId },
    data: { status: "BIEDINGEN_ONTVANGEN" },
  });

  const partner = await prisma.partner.findUnique({ where: { id: partnerId } });

  if (request.contactEmail && partner) {
    await emailService.sendNewBidToCustomer(
      request.contactEmail,
      request.contactName,
      request.requestNumber,
      partner.companyName,
      amount.toFixed(2)
    );
  }

  if (request.userId) {
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: "NIEUW_BOD",
        title: "Nieuw bod ontvangen",
        message: `${partner?.companyName} heeft een bod uitgebracht op aanvraag ${request.requestNumber}.`,
        link: `/aanvraag/${request.requestNumber}`,
      },
    });
  }

  return NextResponse.json(bid, { status: 201 });
}
