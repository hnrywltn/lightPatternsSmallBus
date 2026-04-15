import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import pool from "@/lib/db";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing signature or secret." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await pool.query(
          `UPDATE sites
           SET stripe_subscription_id = $1,
               stripe_subscription_status = $2,
               updated_at = NOW()
           WHERE stripe_customer_id = $3`,
          [sub.id, sub.status, sub.customer as string]
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await pool.query(
          `UPDATE sites
           SET stripe_subscription_status = 'canceled',
               updated_at = NOW()
           WHERE stripe_customer_id = $1`,
          [sub.customer as string]
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.parent?.subscription_details?.subscription) {
          await pool.query(
            `UPDATE sites
             SET stripe_subscription_status = 'active',
                 updated_at = NOW()
             WHERE stripe_customer_id = $1`,
            [invoice.customer as string]
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.parent?.subscription_details?.subscription) {
          await pool.query(
            `UPDATE sites
             SET stripe_subscription_status = 'past_due',
                 updated_at = NOW()
             WHERE stripe_customer_id = $1`,
            [invoice.customer as string]
          );
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
