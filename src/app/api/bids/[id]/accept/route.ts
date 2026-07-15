import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const bidId = params.id;

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: { request: true, partner: { include: { user: true } } },
  });

  if (!bid) return NextResponse.json({ error: "Bod niet gevonden" }, { status: 404 });

  await prisma.$transaction([
    prisma.bid.update({ where: { id: bidId }, data: { status: "GEACCEPTEERD" } }),
    prisma.bid.updateMany({
      where: { requestId: bid.requestId, id: { not: bidId } },
      data: { status: "AFGEWEZEN" },
    }),
    prisma.request.update({
      where: { id: bid.requestId },
      data: { status: "GEGUND", acceptedBidId: bidId },
    }),
    prisma.notification.create({
      data: {
        userId: bid.partner.userId,
        type: "BOD_GEACCEPTEERD",
        title: "Je bod is geaccepteerd!",
        message: `Je bod op aanvraag ${bid.request.requestNumber} is geaccepteerd.`,
        link: "/partner/aanvragen",
      },
    }),
  ]);

  await emailService.sendBidAccepted(bid.partner.user.email, bid.partner.companyName, bid.request.requestNumber);

  return NextResponse.json({ success: true });
}
