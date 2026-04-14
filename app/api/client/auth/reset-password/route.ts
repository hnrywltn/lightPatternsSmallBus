import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT * FROM password_reset_tokens WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()",
    [token]
  );

  const resetToken = rows[0];
  if (!resetToken) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [password_hash, resetToken.user_id]);
    await client.query("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1", [resetToken.id]);
    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}
