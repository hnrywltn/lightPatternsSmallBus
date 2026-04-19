import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
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
    const { rows } = await pool.query(`
      SELECT
        s.id AS site_id,
        s.business_name,
        s.date_published,
        s.build_fee,
        s.monthly_revenue,
        r.id AS referrer_id,
        r.name AS referrer_name,
        r.email AS referrer_email,
        r.commission_type,
        r.commission_amount,
        r.stripe_connect_id
      FROM sites s
      JOIN referrers r ON r.id = s.referrer_id
      WHERE s.status = 'active'
        AND s.commission_paid_at IS NULL
      ORDER BY s.date_published DESC NULLS LAST
    `);

    const commissions = rows.map((row) => {
      const commissionDue =
        row.commission_type === "percentage"
          ? Math.floor((row.build_fee * row.commission_amount) / 100)
          : row.commission_amount;
      return {
        siteId: row.site_id,
        businessName: row.business_name,
        datePublished: row.date_published,
        buildFee: row.build_fee,
        monthlyRevenue: row.monthly_revenue,
        referrerId: row.referrer_id,
        referrerName: row.referrer_name,
        referrerEmail: row.referrer_email,
        commissionType: row.commission_type,
        commissionAmount: row.commission_amount,
        commissionDue,
        stripeConnectId: row.stripe_connect_id ?? null,
      };
    });

    return NextResponse.json({ commissions });
  } catch (err) {
    console.error("Pending commissions fetch error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { siteId, transfer, amountDollars } = await req.json();
    if (!siteId) {
      return NextResponse.json({ error: "siteId is required." }, { status: 400 });
    }

    // Look up the commission to get referrer's stripe_connect_id
    const { rows } = await pool.query(
      `SELECT s.id, s.commission_paid_at, r.stripe_connect_id, r.name AS referrer_name
       FROM sites s JOIN referrers r ON r.id = s.referrer_id
       WHERE s.id = $1`,
      [siteId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Site not found." }, { status: 404 });
    }

    const row = rows[0];

    if (row.commission_paid_at) {
      return NextResponse.json({ error: "Commission already paid." }, { status: 409 });
    }

    let transferId: string | null = null;

    if (transfer && row.stripe_connect_id && amountDollars > 0) {
      const cents = Math.round(amountDollars * 100);
      const stripeTransfer = await stripe.transfers.create({
        amount: cents,
        currency: "usd",
        destination: row.stripe_connect_id,
        metadata: { site_id: siteId, referrer_name: row.referrer_name },
      });
      transferId = stripeTransfer.id;
    }

    await pool.query(
      `UPDATE sites SET commission_paid_at = NOW() WHERE id = $1`,
      [siteId]
    );

    return NextResponse.json({ ok: true, transferId });
  } catch (err) {
    console.error("Mark commission paid error:", err);
    const stripeErr = err as { type?: string; message?: string };
    if (stripeErr.type?.startsWith("Stripe")) {
      return NextResponse.json({ error: stripeErr.message ?? "Stripe transfer failed." }, { status: 400 });
    }
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
