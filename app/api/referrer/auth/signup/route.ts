import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";
import { setReferrerSession } from "@/lib/referrerAuth";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // Validate invite token
  const { rows: inviteRows } = await pool.query(
    `SELECT ri.*, r.email, r.name AS referrer_name, r.id AS referrer_id
     FROM referrer_invites ri
     JOIN referrers r ON r.id = ri.referrer_id
     WHERE ri.token = $1 AND ri.accepted_at IS NULL AND ri.expires_at > NOW()`,
    [token]
  );

  const invite = inviteRows[0];
  if (!invite) {
    return NextResponse.json({ error: "This invite link is invalid or has expired." }, { status: 400 });
  }

  // Don't allow re-registration if account already exists
  const { rows: existingUser } = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [invite.email]
  );
  if (existingUser.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  }

  const resolvedName = name?.trim() || invite.referrer_name || invite.email;
  const password_hash = await bcrypt.hash(password, 12);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create user account
    const { rows: userRows } = await client.query(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email",
      [invite.email, resolvedName, password_hash]
    );
    const user = userRows[0];

    // Update name on referrer record if they filled it in
    await client.query(
      "UPDATE referrers SET name = $1, user_id = $2, updated_at = NOW() WHERE id = $3",
      [resolvedName, user.id, invite.referrer_id]
    );

    // Mark invite accepted
    await client.query(
      "UPDATE referrer_invites SET accepted_at = NOW() WHERE id = $1",
      [invite.id]
    );

    await client.query("COMMIT");

    // Create Stripe customer (non-fatal)
    try {
      const customer = await stripe.customers.create({
        email: invite.email,
        name: resolvedName,
        metadata: { referrer_id: invite.referrer_id },
      });
      await pool.query(
        "UPDATE referrers SET stripe_customer_id = $1 WHERE id = $2",
        [customer.id, invite.referrer_id]
      );
    } catch (stripeErr) {
      console.error("Stripe customer creation failed:", stripeErr);
    }

    // Notify admin (non-fatal)
    if (resend) {
      resend.emails.send({
        from: "Light Patterns <admin@lightpatternsonline.com>",
        to: "admin@lightpatternsonline.com",
        subject: `${resolvedName} just created their referrer account`,
        html: `<p style="font-family:sans-serif;font-size:14px;color:#333;">
          <strong>${resolvedName}</strong> (${invite.email}) has signed up as a referral partner and created their account.
        </p>`,
      }).catch(err => console.error("Admin notification failed:", err));
    }

    await setReferrerSession(invite.referrer_id, invite.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Referrer signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}
