import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) return NextResponse.json({ error: "Niet ingelogd als partner" }, { status: 401 });

  const { companyName, description, website, kvkNumber } = await req.json();

  await prisma.partner.update({
    where: { id: partnerId },
    data: { companyName, description, website, kvkNumber },
  });

  return NextResponse.json({ success: true });
}
