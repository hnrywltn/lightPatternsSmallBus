import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";
import { clientInviteEmail } from "@/lib/emails/client-invite";

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
  const { email, siteId, siteData } = body as {
    email: string;
    // Option A: link to an existing site by id (from Sites page Send Invite)
    siteId?: string;
    // Option B: full site fields to create a new site (from Invite form)
    siteData?: {
      businessName: string;
      contactName?: string;
      contactPhone?: string;
      domain?: string;
      tier?: string;
      addOns?: string[];
      status?: string;
      dateInitiated?: string;
      datePublished?: string;
      monthlyRevenue?: number;
      buildFee?: number;
      notes?: string;
    };
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Make sure this email isn't already a full user account
    const { rows: existingUsers } = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );
    if (existingUsers.length > 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "A client account with this email already exists." },
        { status: 400 }
      );
    }

    // Resolve the site_id we'll link to
    let resolvedSiteId: string | null = null;

    if (siteId) {
      // Caller gave us an explicit site id (Sites page "Send Invite")
      const { rows } = await client.query("SELECT id FROM sites WHERE id = $1", [siteId]);
      if (rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json({ error: "Site not found." }, { status: 404 });
      }
      resolvedSiteId = siteId;
    } else {
      // Check if a site already has this contact email
      const { rows: byCE } = await client.query(
        "SELECT id FROM sites WHERE contact_email = $1 LIMIT 1",
        [normalizedEmail]
      );

      if (byCE.length > 0) {
        // Link invite to the existing site
        resolvedSiteId = byCE[0].id as string;
      } else if (siteData?.businessName?.trim()) {
        // Create a new site row from the form data
        const { rows: newSite } = await client.query(
          `INSERT INTO sites (
            business_name, contact_name, contact_email, contact_phone,
            domain, tier, add_ons, status,
            date_initiated, date_published,
            monthly_revenue, build_fee, notes
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
          RETURNING id`,
          [
            siteData.businessName.trim(),
            siteData.contactName || null,
            normalizedEmail,
            siteData.contactPhone || null,
            siteData.domain || null,
            siteData.tier || "Starter",
            siteData.addOns || [],
            siteData.status || "in_progress",
            siteData.dateInitiated || null,
            siteData.datePublished || null,
            siteData.monthlyRevenue || 0,
            siteData.buildFee || 0,
            siteData.notes || null,
          ]
        );
        resolvedSiteId = newSite[0].id as string;
      }
      // If no site data and no match, invite goes out without a site link (shouldn't happen with new UI)
    }

    // Create a Stripe customer if the site doesn't have one yet
    if (resolvedSiteId) {
      const { rows: siteRows } = await client.query(
        `SELECT stripe_customer_id, contact_name, business_name FROM sites WHERE id = $1`,
        [resolvedSiteId]
      );
      const site = siteRows[0];
      if (site && !site.stripe_customer_id) {
        try {
          const customer = await stripe.customers.create({
            email: normalizedEmail,
            name: site.contact_name || site.business_name || undefined,
            metadata: { site_id: resolvedSiteId },
          });
          await client.query(
            `UPDATE sites SET stripe_customer_id = $1 WHERE id = $2`,
            [customer.id, resolvedSiteId]
          );
        } catch (stripeErr) {
          // Non-fatal — log and continue, invite still goes out
          console.error("Stripe customer creation failed:", stripeErr);
        }
      }
    }

    // Upsert the invite, refreshing token/expiry if one already exists for this email
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 h

    await client.query(
      `INSERT INTO invites (email, token, expires_at, site_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
         SET token = $2, expires_at = $3, site_id = $4, accepted_at = NULL`,
      [normalizedEmail, token, expiresAt, resolvedSiteId]
    );

    await client.query("COMMIT");

    // Fetch site data for the email
    let siteEmailData: {
      contactName?: string;
      businessName?: string;
      tier?: string;
      addOns?: string[];
      monthlyRevenue?: number;
      buildFee?: number;
    } = {};
    if (resolvedSiteId) {
      const { rows: siteInfo } = await pool.query(
        `SELECT contact_name, business_name, tier, add_ons, monthly_revenue, build_fee FROM sites WHERE id = $1`,
        [resolvedSiteId]
      );
      if (siteInfo[0]) {
        const s = siteInfo[0];
        siteEmailData = {
          contactName: s.contact_name,
          businessName: s.business_name,
          tier: s.tier,
          addOns: s.add_ons ?? [],
          monthlyRevenue: s.monthly_revenue ?? 0,
          buildFee: s.build_fee ?? 0,
        };
      }
    }

    if (resend) {
      const template = clientInviteEmail({ email: normalizedEmail, token, ...siteEmailData });
      await resend.emails.send({
        from: "Light Patterns <hello@lightpatternsonline.com>",
        to: normalizedEmail,
        ...template,
      });
    }

    return NextResponse.json({ ok: true, siteId: resolvedSiteId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Invite error:", err);
    return NextResponse.json(
      { error: "Database error. Make sure DATABASE_URL is configured." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { rows } = await pool.query(`
      SELECT i.email, i.accepted_at, i.expires_at, i.created_at, i.site_id,
             s.business_name
      FROM invites i
      LEFT JOIN sites s ON s.id = i.site_id
      ORDER BY i.created_at DESC
    `);
    return NextResponse.json({ invites: rows });
  } catch (err) {
    console.error("Invites fetch error:", err);
    return NextResponse.json({ invites: [] });
  }
}
