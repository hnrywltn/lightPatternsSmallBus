import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paymentMethodId } = await req.json();
  if (!paymentMethodId) return NextResponse.json({ error: "paymentMethodId required." }, { status: 400 });

  const { rows } = await pool.query(
    `SELECT stripe_customer_id FROM sites WHERE user_id = $1 AND stripe_customer_id IS NOT NULL LIMIT 1`,
    [session.sub]
  );
  const customerId = rows[0]?.stripe_customer_id;
  if (!customerId) return NextResponse.json({ error: "No Stripe customer linked." }, { status: 400 });

  try {
    // Attach to customer and set as default
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Update active subscriptions to use new payment method
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
    await Promise.all(
      subscriptions.data
        .filter((s) => ["active", "trialing", "past_due"].includes(s.status))
        .map((s) => stripe.subscriptions.update(s.id, { default_payment_method: paymentMethodId }))
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update payment method error:", err);
    return NextResponse.json({ error: "Failed to update payment method." }, { status: 500 });
  }
}
