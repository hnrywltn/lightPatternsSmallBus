import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";
import { referrerInviteEmail } from "@/lib/emails/referrer-invite";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, phone, commissionType, commissionAmount, referralCode, notes } = body as {
    name?: string;
    email: string;
    phone?: string;
    commissionType?: "flat" | "percentage";
    commissionAmount?: number;
    referralCode?: string;
    notes?: string;
  };

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const resolvedCommissionType = commissionType || "flat";
  const resolvedCommissionAmount = commissionAmount ?? 500;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Upsert referrer — if they already exist, update their info and resend
    const { rows: referrerRows } = await client.query(
      `INSERT INTO referrers (name, email, phone, commission_type, commission_amount, referral_code, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       ON CONFLICT (email) DO UPDATE SET
         name             = COALESCE(EXCLUDED.name, referrers.name),
         phone            = COALESCE(EXCLUDED.phone, referrers.phone),
         commission_type  = EXCLUDED.commission_type,
         commission_amount = EXCLUDED.commission_amount,
         referral_code    = COALESCE(EXCLUDED.referral_code, referrers.referral_code),
         notes            = COALESCE(EXCLUDED.notes, referrers.notes),
         updated_at       = NOW()
       RETURNING *`,
      [
        name?.trim() || null,
        normalizedEmail,
        phone || null,
        resolvedCommissionType,
        resolvedCommissionAmount,
        referralCode || null,
        notes || null,
      ]
    );

    const referrer = referrerRows[0];

    // Upsert invite token — refresh if one already exists for this referrer
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    await client.query(
      `INSERT INTO referrer_invites (referrer_id, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (referrer_id) DO UPDATE
         SET token = $2, expires_at = $3, accepted_at = NULL
       `,
      [referrer.id, token, expiresAt]
    );

    await client.query("COMMIT");

    if (resend) {
      const template = referrerInviteEmail({
        name: referrer.name,
        email: normalizedEmail,
        token,
        commissionType: referrer.commission_type,
        commissionAmount: referrer.commission_amount,
        referralCode: referrer.referral_code,
      });

      await resend.emails.send({
        from: "Light Patterns <admin@lightpatternsonline.com>",
        to: normalizedEmail,
        ...template,
      });
    }

    return NextResponse.json({ ok: true, referrerId: referrer.id });
  } catch (err: unknown) {
    await client.query("ROLLBACK");
    console.error("Referrer invite error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  } finally {
    client.release();
  }
}
