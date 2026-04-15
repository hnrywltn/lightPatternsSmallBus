import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT s.stripe_customer_id, s.build_fee, s.build_fee_discount, s.tier, s.add_ons, s.monthly_revenue, s.business_name
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
  const discount = site.build_fee_discount ?? 0;
  const finalAmount = buildFee - discount;

  try {
    if (buildFee > 0) {
      // Create invoice items — full build fee, then discount as negative line if applicable
      await stripe.invoiceItems.create({
        customer: site.stripe_customer_id,
        amount: buildFee * 100,
        currency: "usd",
        description: `Build fee — ${site.business_name ?? "Light Patterns"}`,
      });

      if (discount > 0) {
        await stripe.invoiceItems.create({
          customer: site.stripe_customer_id,
          amount: -(discount * 100),
          currency: "usd",
          description: "Discount",
        });
      }

      // Create and finalize invoice — Stripe generates a PaymentIntent for it
      const invoice = await stripe.invoices.create({
        customer: site.stripe_customer_id,
        collection_method: "charge_automatically",
        metadata: { type: "build_fee" },
      });

      const finalized = await stripe.invoices.finalizeInvoice(invoice.id, {
        auto_advance: false,
      });

      const clientSecret = finalized.confirmation_secret?.client_secret;
      if (!clientSecret) {
        return NextResponse.json({ error: "Invoice has no client secret." }, { status: 500 });
      }

      return NextResponse.json({
        type: "payment",
        clientSecret,
        buildFee,
        buildFeeDiscount: discount,
        finalAmount,
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
        buildFeeDiscount: 0,
        finalAmount: 0,
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
