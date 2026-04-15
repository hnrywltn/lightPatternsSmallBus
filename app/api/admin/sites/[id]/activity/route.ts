import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { description } = await req.json();
  if (!description?.trim()) {
    return NextResponse.json({ error: "Description is required." }, { status: 400 });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO site_activity (site_id, description) VALUES ($1, $2) RETURNING *`,
      [id, description.trim()]
    );
    return NextResponse.json({ entry: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("Activity insert error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT * FROM site_activity WHERE site_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [id]
  );
  return NextResponse.json({ activity: rows });
}
