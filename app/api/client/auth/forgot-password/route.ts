import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";
import { passwordResetEmail } from "@/lib/emails/password-reset";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  // Always return ok — don't reveal whether the email exists
  const { rows } = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email.toLowerCase().trim()]
  );

  if (rows.length > 0 && resend) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [rows[0].id, token, expiresAt]
    );

    const template = passwordResetEmail({ token });
    await resend.emails.send({
      from: "Light Patterns <hello@lightpatternsonline.com>",
      to: email,
      ...template,
    });
  }

  return NextResponse.json({ ok: true });
}
