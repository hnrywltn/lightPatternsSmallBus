import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rows } = await pool.query(
    `SELECT a.id, a.description, a.created_at
     FROM site_activity a
     JOIN sites s ON s.id = a.site_id
     WHERE s.user_id = $1
     ORDER BY a.created_at DESC
     LIMIT 20`,
    [session.sub]
  );
  return NextResponse.json({ activity: rows });
}
