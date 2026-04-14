import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";
import { clientInviteEmail } from "@/lib/emails/client-invite";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if already a user
  const { rows: users } = await pool.query("SELECT id FROM users WHERE email = $1", [normalizedEmail]);
  if (users.length > 0) {
    return NextResponse.json({ error: "A user with this email already exists." }, { status: 400 });
  }

  // Upsert invite — if one exists, refresh the token and expiry
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours

  await pool.query(`
    INSERT INTO invites (email, token, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO UPDATE
      SET token = $2, expires_at = $3, accepted_at = NULL
  `, [normalizedEmail, token, expiresAt]);

  if (resend) {
    const template = clientInviteEmail({ email: normalizedEmail, token });
    await resend.emails.send({
      from: "Light Patterns <hello@lightpatternsonline.com>",
      to: normalizedEmail,
      ...template,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows } = await pool.query(`
    SELECT email, accepted_at, expires_at, created_at
    FROM invites
    ORDER BY created_at DESC
  `);

  return NextResponse.json({ invites: rows });
}
