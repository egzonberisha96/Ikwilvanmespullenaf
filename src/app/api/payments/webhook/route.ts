import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mollieClient } from "@/lib/mollie";

// Mollie stuurt een POST met form-encoded 'id' veld naar deze endpoint bij elke statuswijziging.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const paymentId = formData.get("id") as string;

  if (!paymentId) return NextResponse.json({ error: "Geen payment id" }, { status: 400 });

  try {
    const molliePayment = await mollieClient.payments.get(paymentId);
    const localPayment = await prisma.payment.findUnique({ where: { molliePaymentId: paymentId } });

    if (!localPayment) return NextResponse.json({ received: true });

    let status: "PENDING" | "PAID" | "FAILED" | "CANCELED" | "EXPIRED" = "PENDING";
    if (molliePayment.status === "paid") status = "PAID";
    else if (molliePayment.status === "failed") status = "FAILED";
    else if (molliePayment.status === "canceled") status = "CANCELED";
    else if (molliePayment.status === "expired") status = "EXPIRED";

    await prisma.payment.update({ where: { id: localPayment.id }, data: { status } });

    if (status === "PAID" && molliePayment.metadata) {
      const meta = molliePayment.metadata as any;
      if (meta.type === "ABONNEMENT" && meta.partnerId && meta.plan) {
        await prisma.partner.update({
          where: { id: meta.partnerId },
          data: { subscriptionPlan: meta.plan },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Mollie webhook error:", error);
    return NextResponse.json({ error: "Webhook verwerking mislukt" }, { status: 500 });
  }
}
