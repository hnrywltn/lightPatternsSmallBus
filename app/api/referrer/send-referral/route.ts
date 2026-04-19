import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyReferrerToken } from "@/lib/referrerAuth";
import { referrerWarmOutreachEmail } from "@/lib/emails/referrer-warm-outreach";
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

  const { recipientName, recipientEmail } = await req.json();

  if (!recipientName?.trim() || !recipientEmail?.trim()) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const { rows } = await pool.query(
    "SELECT name FROM referrers WHERE id = $1",
    [session.sub]
  );
  const referrer = rows[0];
  if (!referrer) return NextResponse.json({ error: "Referrer not found." }, { status: 404 });

  if (!resend) return NextResponse.json({ error: "Email not configured." }, { status: 500 });

  const template = referrerWarmOutreachEmail({
    recipientName: recipientName.trim(),
    recipientEmail: recipientEmail.trim().toLowerCase(),
    referrerName: referrer.name,
  });

  const { error } = await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: recipientEmail.trim().toLowerCase(),
    replyTo: "hello@lightpatternsonline.com",
    ...template,
  });

  if (error) {
    console.error("Referral email error:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }

  await pool.query(
    "INSERT INTO referral_sends (referrer_id, recipient_name, recipient_email) VALUES ($1, $2, $3)",
    [session.sub, recipientName.trim(), recipientEmail.trim().toLowerCase()]
  );

  return NextResponse.json({ ok: true });
}
