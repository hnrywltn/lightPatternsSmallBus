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
      COUNT(DISTINCT p.id)                                                          AS total_prospects,
      COUNT(DISTINCT s.id)                                                          AS total_sends,
      COUNT(DISTINCT CASE WHEN s.delivered_at IS NOT NULL THEN s.id END)            AS total_delivered,
      COUNT(DISTINCT CASE WHEN s.opened_at IS NOT NULL THEN s.id END)               AS total_opened,
      COUNT(DISTINCT CASE WHEN s.clicked_at IS NOT NULL THEN s.id END)              AS total_clicked,
      COUNT(DISTINCT CASE WHEN p.status = 'replied'   THEN p.id END)               AS total_replied,
      COUNT(DISTINCT CASE WHEN p.status = 'converted' THEN p.id END)               AS total_converted
    FROM prospects p
    LEFT JOIN outreach_sends s ON s.prospect_id = p.id
  `);

  const r = rows[0];
  const delivered = Number(r.total_delivered);
  const opened    = Number(r.total_opened);
  const clicked   = Number(r.total_clicked);

  return NextResponse.json({
    totalProspects: Number(r.total_prospects),
    totalSends:     Number(r.total_sends),
    totalDelivered: delivered,
    totalOpened:    opened,
    totalClicked:   clicked,
    totalReplied:   Number(r.total_replied),
    totalConverted: Number(r.total_converted),
    openRate:   delivered > 0 ? Math.round((opened  / delivered) * 100) : 0,
    clickRate:  delivered > 0 ? Math.round((clicked / delivered) * 100) : 0,
  });
}
