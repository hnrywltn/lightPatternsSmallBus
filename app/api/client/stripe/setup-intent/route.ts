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
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    console.error("SetupIntent error:", err);
    return NextResponse.json({ error: "Failed to create setup intent." }, { status: 500 });
  }
}
