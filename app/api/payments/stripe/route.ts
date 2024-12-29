// app/api/payments/stripe/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { donationId } = body;

    const donation = await db.donation.findUnique({
      where: { id: donationId },
      include: { project: true }
    });

    if (!donation) {
      return new NextResponse("Donation not found", { status: 404 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(donation.amount * 100),
      currency: "USD",
      metadata: {
        donationId: donation.id.toString(),
        projectId: donation.project.id.toString(),
      }
    });

    await db.transaction.create({
      data: {
        donationId: donation.id,
        amount: donation.amount,
        paymentIntent: paymentIntent.id,
        status: "pending",
      }
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}