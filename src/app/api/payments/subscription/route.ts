import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mollieClient, SUBSCRIPTION_PRICES } from "@/lib/mollie";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const partnerId = (session?.user as any)?.partnerId;
  if (!session || !partnerId) return NextResponse.json({ error: "Niet ingelogd als partner" }, { status: 401 });

  const { plan } = await req.json();
  const price = SUBSCRIPTION_PRICES[plan];
  if (!price) return NextResponse.json({ error: "Ongeldig abonnement" }, { status: 400 });

  try {
    const payment = await mollieClient.payments.create({
      amount: { currency: "EUR", value: price.toFixed(2) },
      description: `IkWilVanMeSpullenAf.nl — ${plan} abonnement`,
      redirectUrl: `${APP_URL}/partner/abonnement?status=success`,
      webhookUrl: `${APP_URL}/api/payments/webhook`,
      metadata: { partnerId, plan, type: "ABONNEMENT" },
    });

    await prisma.payment.create({
      data: {
        molliePaymentId: payment.id,
        partnerId,
        type: "ABONNEMENT",
        amount: price,
        status: "PENDING",
        description: `${plan} abonnement`,
        checkoutUrl: payment.getCheckoutUrl() ?? undefined,
      },
    });

    return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error("Mollie checkout error:", error);
    return NextResponse.json({ error: "Betaling starten is mislukt" }, { status: 500 });
  }
}
