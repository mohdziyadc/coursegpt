// Why this file?
/**
 * Let's say a user subscribes using Stripe Checkout, we need information about who subscribed,
 * when did they subscribe etc. This is given to us using stripe webhooks.
 * So webhook is called when Stripe wants to relay smtg back to our website.
 * Here event is the event we are relaying through webhooks. We are constructing one initially
 * and
 * if event type == 'checkout.session.completed', we are creating a user subscription in our database.
 * if event type == 'invoice.payment_succeeded', we are updating our user's subscription.
 *  */
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // Here, we are retrieving the session object created in /api/stripe/route.ts
  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // session.subscription -> The ID of the subscription for Checkout Sessions in subscription mode.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session.metadata?.userId) {
      // From /api/stripe/route.ts
      return new NextResponse("[WEBHOOK ERROR] No User ID found");
    }
    // If there's a user, create a subscription
    await prisma.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // A user has renewed their subscription.
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await prisma.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }
  // Very Imp to do this, otherwise the webhook endpoint would be spammed.
  return new NextResponse(null, { status: 200 });
}
