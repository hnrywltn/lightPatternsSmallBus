import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT stripe_customer_id FROM sites WHERE user_id = $1 AND stripe_customer_id IS NOT NULL LIMIT 1`,
    [session.sub]
  );
  const customerId = rows[0]?.stripe_customer_id;
  if (!customerId) return NextResponse.json({ error: "No Stripe customer linked." }, { status: 400 });

  try {
    const subscriptions = await stripe.subscriptions.list({ customer: customerId, limit: 10 });
    const activeSub = subscriptions.data.find((s) =>
      ["active", "trialing", "past_due"].includes(s.status)
    );
    if (!activeSub) return NextResponse.json({ error: "No active subscription found." }, { status: 400 });

    const updated = await stripe.subscriptions.update(activeSub.id, { cancel_at_period_end: true });
    return NextResponse.json({ cancelAt: updated.cancel_at });
  } catch (err) {
    console.error("Cancel error:", err);
    return NextResponse.json({ error: "Failed to cancel subscription." }, { status: 500 });
  }
}
