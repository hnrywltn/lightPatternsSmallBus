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
        s.id,
        s.business_name,
        s.contact_name,
        s.contact_email,
        s.contact_phone,
        s.domain,
        s.tier,
        s.add_ons,
        s.status,
        s.date_initiated,
        s.date_published,
        s.monthly_revenue,
        s.build_fee,
        s.notes,
        s.user_id,
        s.stripe_customer_id,
        s.created_at,
        s.updated_at,
        u.email AS user_email,
        u.name AS user_name
      FROM sites s
      LEFT JOIN users u ON u.id = s.user_id
      ORDER BY s.created_at DESC
    `);
    return NextResponse.json({ sites: rows });
  } catch (err) {
    console.error("Sites fetch error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    businessName,
    contactName,
    contactEmail,
    contactPhone,
    domain,
    tier,
    addOns,
    status,
    dateInitiated,
    datePublished,
    monthlyRevenue,
    buildFee,
    notes,
    userId,
    stripeCustomerId,
  } = body;

  if (!businessName?.trim()) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO sites (
        business_name, contact_name, contact_email, contact_phone,
        domain, tier, add_ons, status,
        date_initiated, date_published,
        monthly_revenue, build_fee, notes, user_id, stripe_customer_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        businessName.trim(),
        contactName || null,
        contactEmail || null,
        contactPhone || null,
        domain || null,
        tier || "Starter",
        addOns || [],
        status || "in_progress",
        dateInitiated || null,
        datePublished || null,
        monthlyRevenue || 0,
        buildFee || 0,
        notes || null,
        userId || null,
        stripeCustomerId || null,
      ]
    );
    return NextResponse.json({ site: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Site create error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
