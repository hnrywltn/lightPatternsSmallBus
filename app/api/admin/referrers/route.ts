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
      SELECT * FROM referrers ORDER BY created_at DESC
    `);
    return NextResponse.json({ referrers: rows });
  } catch (err) {
    console.error("Referrers fetch error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, phone, commissionType, commissionAmount, referralCode, status, notes } = body;

  if (!name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email?.trim()) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  try {
    const { rows } = await pool.query(
      `INSERT INTO referrers (name, email, phone, commission_type, commission_amount, referral_code, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        commissionType || "flat",
        commissionAmount || 0,
        referralCode || null,
        status || "active",
        notes || null,
      ]
    );
    return NextResponse.json({ referrer: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "A referrer with that email or referral code already exists." }, { status: 409 });
    }
    console.error("Referrer create error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
