import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, partnerRegisterSchema } from "@/lib/validations";
import { emailService } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige invoer" }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Er bestaat al een account met dit e-mailadres" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email: email.toLowerCase(), passwordHash, role },
  });

  if (role === "PARTNER" && body.partner) {
    const partnerParsed = partnerRegisterSchema.safeParse(body.partner);
    if (partnerParsed.success) {
      const p = partnerParsed.data;
      await prisma.partner.create({
        data: {
          userId: user.id,
          companyName: p.companyName,
          type: p.type,
          kvkNumber: p.kvkNumber,
          basePostcode: p.basePostcode,
          baseCity: p.baseCity,
          workRadiusKm: p.workRadiusKm,
          workRegions: p.baseCity ? [p.baseCity] : [],
          isApproved: false,
        },
      });
      await emailService.sendNewPartnerWelcome(user.email, p.companyName);
    }
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
