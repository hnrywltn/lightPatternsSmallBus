import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import pool from "@/lib/db";

// Map event type → env var holding the signing secret
const secretEnvMap: Record<string, string> = {
  "email.sent":       "RESEND_WEBHOOK_SECRET_SENT",
  "email.delivered":  "RESEND_WEBHOOK_SECRET_DELIVERED",
  "email.opened":     "RESEND_WEBHOOK_SECRET_OPENED",
  "email.clicked":    "RESEND_WEBHOOK_SECRET_CLICKED",
  "email.bounced":    "RESEND_WEBHOOK_SECRET_BOUNCED",
  "email.complained": "RESEND_WEBHOOK_SECRET_COMPLAINED",
};

// Status priority — only upgrade, never downgrade
const statusPriority: Record<string, number> = {
  sent: 1, delivered: 2, opened: 3, clicked: 4, bounced: 5, complained: 6,
};

// Map event type → { status, timestampColumn }
const eventMeta: Record<string, { status: string; col: string } | null> = {
  "email.sent":       null, // already recorded on send; no-op
  "email.delivered":  { status: "delivered",  col: "delivered_at"  },
  "email.opened":     { status: "opened",     col: "opened_at"     },
  "email.clicked":    { status: "clicked",    col: "clicked_at"    },
  "email.bounced":    { status: "bounced",    col: "bounced_at"    },
  "email.complained": { status: "complained", col: "complained_at" },
};

export async function POST(req: NextRequest) {
  const body = await req.text();

  // Parse event type first (unverified — used only to select the correct secret)
  let parsed: { type: string; data: { email_id: string } };
  try {
    parsed = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = parsed;
  const secretEnv = secretEnvMap[type];
  if (!secretEnv) return NextResponse.json({ error: "Unknown event type" }, { status: 400 });

  const secret = process.env[secretEnv];
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });

  // Verify signature using the correct per-event secret
  const svixId        = req.headers.get("svix-id")        ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";

  try {
    new Webhook(secret).verify(body, {
      "svix-id":        svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const meta = eventMeta[type];
  if (!meta) return NextResponse.json({ ok: true }); // email.sent — already recorded

  const { status: newStatus, col } = meta;
  const newPriority = statusPriority[newStatus];

  // Only update if the new status is higher priority than the current one
  await pool.query(
    `UPDATE outreach_sends
     SET status = $1,
         ${col} = NOW()
     WHERE resend_id = $2
       AND COALESCE(
         CASE status
           WHEN 'complained' THEN 6
           WHEN 'bounced'    THEN 5
           WHEN 'clicked'    THEN 4
           WHEN 'opened'     THEN 3
           WHEN 'delivered'  THEN 2
           ELSE 1
         END, 0
       ) < $3`,
    [newStatus, data.email_id, newPriority]
  );

  return NextResponse.json({ ok: true });
}
