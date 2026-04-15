import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json() as { status?: string; email?: string; notes?: string };

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (body.status !== undefined) { fields.push(`status = $${i++}`); values.push(body.status); }
  if (body.email  !== undefined) { fields.push(`email  = $${i++}`); values.push(body.email || null); }
  if (body.notes  !== undefined) { fields.push(`notes  = $${i++}`); values.push(body.notes || null); }

  if (!fields.length) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  fields.push(`updated_at = NOW()`);
  values.push(id);

  const { rows } = await pool.query(
    `UPDATE prospects SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );

  if (!rows.length) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ prospect: rows[0] });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM prospects WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
