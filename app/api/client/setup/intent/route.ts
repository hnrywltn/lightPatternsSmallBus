import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT s.stripe_customer_id, s.build_fee, s.tier, s.add_ons, s.monthly_revenue, s.business_name
     FROM sites s
     WHERE s.user_id = $1
     LIMIT 1`,
    [session.sub]
  );

  const site = rows[0];
  if (!site?.stripe_customer_id) {
    return NextResponse.json({ error: "No Stripe customer linked to your account." }, { status: 400 });
  }

  const buildFee = site.build_fee ?? 0;

  try {
    if (buildFee > 0) {
      // Charge build fee immediately and save card for future subscription billing
      const paymentIntent = await stripe.paymentIntents.create({
        amount: buildFee * 100, // build_fee stored in dollars, convert to cents
        currency: "usd",
        customer: site.stripe_customer_id,
        setup_future_usage: "off_session",
        description: `Build fee — ${site.business_name ?? "Light Patterns"}`,
        metadata: { type: "build_fee" },
      });
      return NextResponse.json({
        type: "payment",
        clientSecret: paymentIntent.client_secret,
        buildFee,
        tier: site.tier,
        addOns: site.add_ons ?? [],
        monthlyRevenue: site.monthly_revenue ?? 0,
      });
    } else {
      // No build fee — just save card for future subscription
      const setupIntent = await stripe.setupIntents.create({
        customer: site.stripe_customer_id,
        payment_method_types: ["card"],
      });
      return NextResponse.json({
        type: "setup",
        clientSecret: setupIntent.client_secret,
        buildFee: 0,
        tier: site.tier,
        addOns: site.add_ons ?? [],
        monthlyRevenue: site.monthly_revenue ?? 0,
      });
    }
  } catch (err) {
    console.error("Setup intent error:", err);
    return NextResponse.json({ error: "Failed to initialize payment." }, { status: 500 });
  }
}
