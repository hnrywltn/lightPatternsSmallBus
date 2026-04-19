import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

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
        r.commission_amount
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
    const { siteId } = await req.json();
    if (!siteId) {
      return NextResponse.json({ error: "siteId is required." }, { status: 400 });
    }

    const { rowCount } = await pool.query(
      `UPDATE sites SET commission_paid_at = NOW() WHERE id = $1 AND commission_paid_at IS NULL`,
      [siteId]
    );

    if (rowCount === 0) {
      return NextResponse.json({ error: "Commission already paid or site not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Mark commission paid error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
