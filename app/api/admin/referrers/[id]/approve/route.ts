import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";
import { referrerInviteEmail } from "@/lib/emails/referrer-invite";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.ADMIN_SESSION_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { rows } = await pool.query(
    "SELECT * FROM referrers WHERE id = $1 AND status = 'pending'",
    [id]
  );
  const referrer = rows[0];

  if (!referrer) {
    return new NextResponse(html("Already actioned", "This referrer has already been approved or denied."), {
      headers: { "Content-Type": "text/html" },
    });
  }

  // Activate the referrer
  await pool.query(
    "UPDATE referrers SET status = 'active', updated_at = NOW() WHERE id = $1",
    [id]
  );

  // Generate and store invite token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await pool.query(
    `INSERT INTO referrer_invites (referrer_id, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (referrer_id) DO UPDATE SET token = $2, expires_at = $3, accepted_at = NULL`,
    [id, token, expiresAt]
  );

  // Send invite email
  if (resend) {
    const template = referrerInviteEmail({
      name: referrer.name,
      email: referrer.email,
      token,
      commissionType: referrer.commission_type,
      commissionAmount: referrer.commission_amount,
      referralCode: referrer.referral_code,
    });
    await resend.emails.send({
      from: "Light Patterns <admin@lightpatternsonline.com>",
      to: referrer.email,
      ...template,
    });
  }

  return new NextResponse(
    html("Referrer approved ✓", `${referrer.name} (${referrer.email}) has been approved and sent an invite email.`),
    { headers: { "Content-Type": "text/html" } }
  );
}

function html(title: string, message: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>body{font-family:sans-serif;background:#0c0a07;color:#f2ede4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
  .card{background:#1a1714;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:40px;max-width:420px;text-align:center;}
  h1{font-size:18px;margin:0 0 12px;}p{font-size:14px;color:rgba(242,237,228,0.5);margin:0;line-height:1.6;}</style>
  </head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;
}
