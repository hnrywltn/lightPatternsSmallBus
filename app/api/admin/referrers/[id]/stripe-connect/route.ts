import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rows } = await pool.query(`SELECT * FROM referrers WHERE id = $1`, [id]);
    if (!rows.length) return NextResponse.json({ error: "Referrer not found." }, { status: 404 });
    const referrer = rows[0];

    let accountId: string = referrer.stripe_connect_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: referrer.email,
        capabilities: { transfers: { requested: true } },
        metadata: { referrer_id: id, referrer_name: referrer.name },
      });
      accountId = account.id;
      await pool.query(`UPDATE referrers SET stripe_connect_id = $1 WHERE id = $2`, [accountId, id]);
    }

    const origin = new URL(req.url).origin;
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/admin/referrers`,
      return_url: `${origin}/admin/referrers`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url, accountId });
  } catch (err) {
    console.error("Stripe Connect setup error:", err);
    return NextResponse.json({ error: "Failed to set up Stripe payout." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await pool.query(`UPDATE referrers SET stripe_connect_id = NULL WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
