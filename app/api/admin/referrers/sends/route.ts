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

  const { rows } = await pool.query(`
    SELECT
      rs.id,
      rs.recipient_name,
      rs.recipient_email,
      rs.sent_at,
      r.name AS referrer_name,
      r.email AS referrer_email
    FROM referral_sends rs
    JOIN referrers r ON r.id = rs.referrer_id
    ORDER BY rs.sent_at DESC
  `);

  return NextResponse.json({ sends: rows });
}
