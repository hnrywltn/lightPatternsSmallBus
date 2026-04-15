import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { rows } = await pool.query(
    `SELECT contact_name, contact_email, stripe_customer_id FROM sites WHERE id = $1 LIMIT 1`,
    [id]
  );
  const site = rows[0];
  if (!site) return NextResponse.json({ error: "Site not found." }, { status: 404 });
  if (site.stripe_customer_id) {
    return NextResponse.json({ error: "Stripe customer already exists.", customerId: site.stripe_customer_id }, { status: 409 });
  }

  try {
    const customer = await stripe.customers.create({
      email: site.contact_email ?? undefined,
      name: site.contact_name ?? undefined,
    });

    await pool.query(
      `UPDATE sites SET stripe_customer_id = $1, updated_at = NOW() WHERE id = $2`,
      [customer.id, id]
    );

    return NextResponse.json({ customerId: customer.id });
  } catch (err) {
    console.error("Stripe customer create error:", err);
    return NextResponse.json({ error: "Failed to create Stripe customer." }, { status: 500 });
  }
}
