import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { coldOutreachNoWebsiteEmail } from "@/lib/emails/cold-outreach-no-website";
import { unsubscribeUrl } from "@/lib/unsubscribeUrl";
import pool from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Contact {
  name: string;
  email: string;
  place_id?: string;
  phone?: string;
  full_address?: string;
  type?: string;
}

export async function POST(request: NextRequest) {
  const { contacts }: { contacts: Contact[] } = await request.json();

  if (!contacts?.length) {
    return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
  }

  const audienceId = process.env.RESEND_OUTREACH_AUDIENCE_ID!;

  const results = await Promise.all(
    contacts.map(async (contact) => {
      const { name, email, place_id, phone, full_address, type } = contact;

      // Add to Resend outreach audience
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name: name, unsubscribed: false }),
      });

      // Send the email
      const { error } = await resend.emails.send({
        from: "Light Patterns <hello@lightpatternsonline.com>",
        to: email,
        ...coldOutreachNoWebsiteEmail({
          businessName: name,
          unsubscribeUrl: unsubscribeUrl(email),
        }),
      });

      // Write to DB regardless of email success so the prospect is tracked
      try {
        const client = await pool.connect();
        try {
          const pid = place_id || `manual:${email}`;

          // Upsert prospect
          const { rows } = await client.query<{ id: number }>(
            `INSERT INTO prospects (place_id, name, email, phone, full_address, type)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (place_id) DO UPDATE SET
               name         = EXCLUDED.name,
               email        = COALESCE(EXCLUDED.email, prospects.email),
               phone        = COALESCE(EXCLUDED.phone, prospects.phone),
               full_address = COALESCE(EXCLUDED.full_address, prospects.full_address),
               type         = COALESCE(EXCLUDED.type, prospects.type),
               updated_at   = NOW()
             RETURNING id`,
            [pid, name, email || null, phone || null, full_address || null, type || null]
          );

          const prospectId = rows[0]?.id;
          if (prospectId) {
            await client.query(
              `INSERT INTO outreach_sends (prospect_id, status, sent_at)
               VALUES ($1, $2, NOW())`,
              [prospectId, error ? "failed" : "sent"]
            );
          }
        } finally {
          client.release();
        }
      } catch (dbErr) {
        console.error("[prospects/send] DB write failed:", dbErr);
      }

      return { email, success: !error, error: error?.message };
    })
  );

  const failed = results.filter((r) => !r.success).length;
  return NextResponse.json({ results, failed });
}
