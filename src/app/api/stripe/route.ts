import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

const settingsUrl = process.env.NEXTAUTH_URL + "/settings";

export async function GET() {
  try {
    // We don't show a page before hitting this endpoint, thats why we need
    // to know if the user is authorized to hit this endpoint
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized User", { status: 401 });
    }

    const userSubscription = await prisma.userSubscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    /**
     *  If the user is trying to cancel the subscription.
     *  Cancel at the billing portal.
     */
    if (userSubscription && userSubscription.stripeCustomerId) {
      //create a stripe session
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    /**
     * If the user is a first time subscriber
     */
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: settingsUrl,
      cancel_url: settingsUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email ?? "",
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "CourseGPT Pro",
              description: "Unlimited Course Generations!",
            },
            unit_amount: 50000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      // Very Imp for webHook.
      metadata: {
        userId: session.user.id,
      },
    });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("[STRIPE ERROR]", error);
    return new NextResponse("[STRIPE ERROR] Internal Servor Error", {
      status: 500,
    });
  }
}
