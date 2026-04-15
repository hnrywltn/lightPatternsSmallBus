import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payouts = await stripe.payouts.list({ limit: 20 });

    return NextResponse.json({
      payouts: payouts.data.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        arrivalDate: p.arrival_date,
        created: p.created,
        description: p.description,
        method: p.method,
      })),
    });
  } catch (err) {
    console.error("Stripe payouts fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch payouts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount } = body as { amount: number };

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json({ error: "Amount must be at least $1.00 (in cents)." }, { status: 400 });
    }

    const payout = await stripe.payouts.create({
      amount,
      currency: "usd",
    });

    return NextResponse.json({
      id: payout.id,
      amount: payout.amount,
      status: payout.status,
      arrivalDate: payout.arrival_date,
    });
  } catch (err) {
    const stripeErr = err as { type?: string; message?: string };
    if (stripeErr.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: stripeErr.message ?? "Invalid request." }, { status: 400 });
    }
    console.error("Stripe payout create error:", err);
    return NextResponse.json({ error: "Failed to create payout." }, { status: 500 });
  }
}
