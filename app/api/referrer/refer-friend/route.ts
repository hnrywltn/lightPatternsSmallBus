import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyReferrerToken } from "@/lib/referrerAuth";
import { referrerFriendNotificationEmail } from "@/lib/emails/referrer-friend-notification";
import pool from "@/lib/db";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function getReferrer(req: NextRequest) {
  const token = req.cookies.get("lp_referrer_session")?.value;
  if (!token) return null;
  try {
    return await verifyReferrerToken(token);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const session = await getReferrer(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { friendName, friendEmail } = await req.json();

  if (!friendName?.trim() || !friendEmail?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const normalizedEmail = friendEmail.trim().toLowerCase();

  const { rows: referrerRows } = await pool.query(
    "SELECT id, name, email FROM referrers WHERE id = $1",
    [session.sub]
  );
  const referrer = referrerRows[0];
  if (!referrer) return NextResponse.json({ error: "Referrer not found." }, { status: 404 });

  // Check if this email is already a referrer
  const { rows: existing } = await pool.query(
    "SELECT id FROM referrers WHERE email = $1",
    [normalizedEmail]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: "Someone with that email is already in the program." }, { status: 409 });
  }

  // Create pending referrer record
  const { rows: newRows } = await pool.query(
    `INSERT INTO referrers (name, email, commission_type, commission_amount, status, referred_by_referrer_id)
     VALUES ($1, $2, 'flat', 500, 'pending', $3)
     RETURNING id`,
    [friendName.trim(), normalizedEmail, referrer.id]
  );
  const pendingReferrer = newRows[0];

  if (!resend) return NextResponse.json({ error: "Email not configured." }, { status: 500 });

  const adminSecret = process.env.ADMIN_SESSION_TOKEN!;
  const template = referrerFriendNotificationEmail({
    pendingReferrerId: pendingReferrer.id,
    pendingName: friendName.trim(),
    pendingEmail: normalizedEmail,
    referredByName: referrer.name,
    referredByEmail: referrer.email,
    adminSecret,
  });

  await resend.emails.send({
    from: "Light Patterns <admin@lightpatternsonline.com>",
    to: "admin@lightpatternsonline.com",
    ...template,
  });

  return NextResponse.json({ ok: true });
}
