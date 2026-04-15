import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

async function getStripeCustomerId(userId: string): Promise<string | null> {
  const { rows } = await pool.query(
    `SELECT stripe_customer_id FROM sites WHERE user_id = $1 AND stripe_customer_id IS NOT NULL LIMIT 1`,
    [userId]
  );
  return rows[0]?.stripe_customer_id ?? null;
}

export async function GET(req: NextRequest) {
  const session = await getClientSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const customerId = await getStripeCustomerId(session.sub);
  if (!customerId) return NextResponse.json({ subscription: null, invoices: [] });

  try {
    const [subscriptions, invoices] = await Promise.all([
      stripe.subscriptions.list({ customer: customerId, limit: 5 }),
      stripe.invoices.list({ customer: customerId, limit: 12 }),
    ]);

    const activeSub = subscriptions.data.find((s) =>
      ["active", "trialing", "past_due", "unpaid"].includes(s.status)
    ) ?? subscriptions.data[0] ?? null;

    // Get payment method details if subscription has one
    let paymentMethod = null;
    const pmId = activeSub?.default_payment_method ?? null;
    if (pmId && typeof pmId === "string") {
      const pm = await stripe.paymentMethods.retrieve(pmId);
      if (pm.card) {
        paymentMethod = { brand: pm.card.brand, last4: pm.card.last4, expMonth: pm.card.exp_month, expYear: pm.card.exp_year };
      }
    } else if (customerId) {
      // Fall back to customer default
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.deleted && customer.invoice_settings?.default_payment_method) {
        const pmIdFallback = customer.invoice_settings.default_payment_method;
        if (typeof pmIdFallback === "string") {
          const pm = await stripe.paymentMethods.retrieve(pmIdFallback);
          if (pm.card) {
            paymentMethod = { brand: pm.card.brand, last4: pm.card.last4, expMonth: pm.card.exp_month, expYear: pm.card.exp_year };
          }
        }
      }
    }

    return NextResponse.json({
      subscription: activeSub
        ? {
            id: activeSub.id,
            status: activeSub.status,
            cancelAtPeriodEnd: activeSub.cancel_at_period_end,
            cancelAt: activeSub.cancel_at,
            billingCycleAnchor: activeSub.billing_cycle_anchor,
            items: activeSub.items.data.map((item) => ({
              name: (item.price.product as { name?: string })?.name ?? item.price.id,
              amount: item.price.unit_amount,
              interval: item.price.recurring?.interval,
            })),
          }
        : null,
      paymentMethod,
      invoices: invoices.data.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amount: inv.amount_paid,
        status: inv.status,
        date: inv.created,
        pdfUrl: inv.invoice_pdf,
        hostedUrl: inv.hosted_invoice_url,
      })),
    });
  } catch (err) {
    console.error("Billing fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch billing data." }, { status: 500 });
  }
}
