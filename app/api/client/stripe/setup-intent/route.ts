import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get("siteId");

  let customerId: string | null = null;

  if (siteId && isAdminAuthed(req)) {
    // Admin preview mode — look up by site ID directly
    const { rows } = await pool.query(
      `SELECT stripe_customer_id FROM sites WHERE id = $1 LIMIT 1`,
      [siteId]
    );
    customerId = rows[0]?.stripe_customer_id ?? null;
  } else {
    const session = await getClientSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { rows } = await pool.query(
      `SELECT stripe_customer_id FROM sites WHERE user_id = $1 AND stripe_customer_id IS NOT NULL LIMIT 1`,
      [session.sub]
    );
    customerId = rows[0]?.stripe_customer_id ?? null;
  }
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
