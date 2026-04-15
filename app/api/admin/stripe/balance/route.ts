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
    const balance = await stripe.balance.retrieve();

    const available = balance.available.reduce((sum, b) => sum + b.amount, 0);
    const pending = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return NextResponse.json({ available, pending });
  } catch (err) {
    console.error("Stripe balance fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch balance." }, { status: 500 });
  }
}
