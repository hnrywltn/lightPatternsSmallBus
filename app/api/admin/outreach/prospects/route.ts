import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(`
    SELECT
      p.*,
      s.status      AS email_status,
      s.sent_at     AS last_sent_at,
      s.opened_at,
      s.clicked_at,
      s.bounced_at,
      s.complained_at
    FROM prospects p
    LEFT JOIN LATERAL (
      SELECT * FROM outreach_sends
      WHERE prospect_id = p.id
      ORDER BY sent_at DESC
      LIMIT 1
    ) s ON true
    ORDER BY p.created_at DESC
  `);

  return NextResponse.json({ prospects: rows });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prospects } = await req.json() as {
    prospects: { place_id: string; name: string; email?: string; phone?: string; full_address?: string; type?: string }[]
  };

  if (!prospects?.length) return NextResponse.json({ error: "No prospects provided." }, { status: 400 });

  const client = await pool.connect();
  try {
    let upserted = 0;
    for (const p of prospects) {
      await client.query(
        `INSERT INTO prospects (place_id, name, email, phone, full_address, type)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (place_id) DO UPDATE SET
           name         = EXCLUDED.name,
           email        = COALESCE(EXCLUDED.email, prospects.email),
           phone        = COALESCE(EXCLUDED.phone, prospects.phone),
           full_address = COALESCE(EXCLUDED.full_address, prospects.full_address),
           type         = COALESCE(EXCLUDED.type, prospects.type),
           updated_at   = NOW()`,
        [p.place_id, p.name, p.email || null, p.phone || null, p.full_address || null, p.type || null]
      );
      upserted++;
    }
    return NextResponse.json({ upserted });
  } finally {
    client.release();
  }
}
