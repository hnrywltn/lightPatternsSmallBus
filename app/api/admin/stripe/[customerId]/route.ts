import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { customerId } = await params;

  try {
    const [customer, subscriptions] = await Promise.all([
      stripe.customers.retrieve(customerId),
      stripe.subscriptions.list({ customer: customerId, limit: 10 }),
    ]);

    if (customer.deleted) {
      return NextResponse.json({ error: "Customer not found in Stripe." }, { status: 404 });
    }

    const activeSub = subscriptions.data.find((s) =>
      ["active", "trialing", "past_due"].includes(s.status)
    ) ?? subscriptions.data[0] ?? null;

    return NextResponse.json({
      customer: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
      subscription: activeSub
        ? {
            id: activeSub.id,
            status: activeSub.status,
            billingCycleAnchor: activeSub.billing_cycle_anchor,
            cancelAt: activeSub.cancel_at,
            cancelAtPeriodEnd: activeSub.cancel_at_period_end,
            items: activeSub.items.data.map((item) => ({
              id: item.id,
              name: (item.price.product as { name?: string })?.name ?? item.price.id,
              amount: item.price.unit_amount,
              interval: item.price.recurring?.interval,
            })),
          }
        : null,
    });
  } catch (err) {
    if ((err as { type?: string }).type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: "Invalid Stripe customer ID." }, { status: 400 });
    }
    console.error("Stripe fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch Stripe data." }, { status: 500 });
  }
}
