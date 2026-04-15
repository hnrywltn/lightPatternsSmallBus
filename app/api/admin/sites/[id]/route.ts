import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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
  } = body;

  if (!businessName?.trim()) {
    return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE sites SET
        business_name = $1,
        contact_name = $2,
        contact_email = $3,
        contact_phone = $4,
        domain = $5,
        tier = $6,
        add_ons = $7,
        status = $8,
        date_initiated = $9,
        date_published = $10,
        monthly_revenue = $11,
        build_fee = $12,
        notes = $13,
        user_id = $14,
        updated_at = NOW()
      WHERE id = $15
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
        id,
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Site not found." }, { status: 404 });
    }

    return NextResponse.json({ site: rows[0] });
  } catch (err) {
    console.error("Site update error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rowCount } = await pool.query("DELETE FROM sites WHERE id = $1", [id]);
    if (rowCount === 0) {
      return NextResponse.json({ error: "Site not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Site delete error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
