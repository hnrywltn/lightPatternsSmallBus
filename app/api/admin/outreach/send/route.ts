import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import pool from "@/lib/db";
import { coldOutreachNoWebsiteEmail } from "@/lib/emails/cold-outreach-no-website";
import { unsubscribeUrl } from "@/lib/unsubscribeUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prospectIds } = await req.json() as { prospectIds: string[] };
  if (!prospectIds?.length) return NextResponse.json({ error: "No prospect IDs provided." }, { status: 400 });

  const { rows } = await pool.query(
    `SELECT id, name, email FROM prospects WHERE id = ANY($1) AND email IS NOT NULL AND email != ''`,
    [prospectIds]
  );

  if (!rows.length) return NextResponse.json({ error: "No prospects with email addresses found." }, { status: 400 });

  const audienceId = process.env.RESEND_OUTREACH_AUDIENCE_ID!;

  const results = await Promise.all(
    rows.map(async (p: { id: string; name: string; email: string }) => {
      try {
        // Add to Resend audience
        await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: p.email, first_name: p.name, unsubscribed: false }),
        });

        const { data, error } = await resend.emails.send({
          from: "Light Patterns <hello@lightpatternsonline.com>",
          to: p.email,
          ...coldOutreachNoWebsiteEmail({
            businessName: p.name,
            unsubscribeUrl: unsubscribeUrl(p.email),
          }),
        });

        if (error || !data?.id) {
          return { prospectId: p.id, email: p.email, success: false, error: error?.message };
        }

        // Record the send
        await pool.query(
          `INSERT INTO outreach_sends (prospect_id, resend_id, status) VALUES ($1, $2, 'sent')
           ON CONFLICT (resend_id) DO NOTHING`,
          [p.id, data.id]
        );

        // Mark prospect as contacted
        await pool.query(
          `UPDATE prospects SET status = 'contacted', updated_at = NOW()
           WHERE id = $1 AND status = 'new'`,
          [p.id]
        );

        return { prospectId: p.id, email: p.email, success: true };
      } catch (err) {
        return { prospectId: p.id, email: p.email, success: false, error: String(err) };
      }
    })
  );

  const failed = results.filter((r) => !r.success).length;
  return NextResponse.json({ results, sent: results.length - failed, failed });
}
