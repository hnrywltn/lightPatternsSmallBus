import { NextRequest, NextResponse } from "next/server";
import { verifyReferrerToken } from "@/lib/referrerAuth";
import pool from "@/lib/db";

async function getReferrerSession(req: NextRequest) {
  const token = req.cookies.get("lp_referrer_session")?.value;
  if (!token) return null;
  try {
    return await verifyReferrerToken(token);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const session = await getReferrerSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows: referrerRows } = await pool.query(
    "SELECT * FROM referrers WHERE id = $1",
    [session.sub]
  );
  const referrer = referrerRows[0];
  if (!referrer) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { rows: sites } = await pool.query(
    `SELECT id, business_name, status, date_initiated, date_published, tier
     FROM sites WHERE referrer_id = $1 ORDER BY created_at DESC`,
    [referrer.id]
  );

  return NextResponse.json({ referrer, sites });
}
