import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { setClientSession } from "@/lib/clientAuth";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { siteId } = await params;

  const { rows } = await pool.query(
    `SELECT u.id, u.email FROM users u
     JOIN sites s ON s.user_id = u.id
     WHERE s.id = $1 LIMIT 1`,
    [siteId]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "No linked user for this site." }, { status: 404 });
  }

  const { id, email } = rows[0];
  await setClientSession(id, email);

  return NextResponse.json({ ok: true });
}
