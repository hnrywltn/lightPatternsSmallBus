import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { setClientSession } from "@/lib/clientAuth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT id, email, name, password_hash FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  const user = rows[0];
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setClientSession(user.id, user.email);
  return NextResponse.json({ ok: true, name: user.name });
}
