import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, email, phone, commissionType, commissionAmount, referralCode, status, notes } = body;

  try {
    const { rows } = await pool.query(
      `UPDATE referrers SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = $3,
        commission_type = COALESCE($4, commission_type),
        commission_amount = COALESCE($5, commission_amount),
        referral_code = $6,
        status = COALESCE($7, status),
        notes = $8,
        updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [
        name?.trim() || null,
        email?.trim().toLowerCase() || null,
        phone || null,
        commissionType || null,
        commissionAmount ?? null,
        referralCode || null,
        status || null,
        notes || null,
        id,
      ]
    );
    if (!rows.length) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ referrer: rows[0] });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "A referrer with that email or referral code already exists." }, { status: 409 });
    }
    console.error("Referrer update error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { rowCount } = await pool.query(`DELETE FROM referrers WHERE id = $1`, [id]);
    if (!rowCount) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Referrer delete error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
