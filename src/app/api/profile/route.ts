import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });

  const { name, phone } = await req.json();

  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { name, phone },
  });

  return NextResponse.json({ success: true });
}
