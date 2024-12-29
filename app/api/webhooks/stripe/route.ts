// app/api/webhooks/stripe/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "payment_intent.succeeded") {
    try {
      const donation = await db.donation.update({
        where: {
          id: Number(session.metadata.donationId),
        },
        data: {
          status: "completed",
        },
      });

      // تحديث مبلغ المشروع
      await db.project.update({
        where: { id: Number(session.metadata.projectId) },
        data: {
          currentAmount: {
            increment: donation.amount,
          },
        },
      });

    } catch (error) {
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}