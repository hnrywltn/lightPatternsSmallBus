import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import SetupClient from "./SetupClient";

export default async function SetupPage() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { rows } = await pool.query(
    `SELECT s.build_fee, s.build_fee_discount, s.tier, s.add_ons, s.monthly_revenue, s.business_name, s.stripe_customer_id, u.name
     FROM sites s
     JOIN users u ON u.id = s.user_id
     WHERE s.user_id = $1
     LIMIT 1`,
    [session.sub]
  );

  const site = rows[0];

  // If no site linked yet, go to dashboard
  if (!site) redirect("/client/dashboard");

  return (
    <SetupClient
      name={site.name}
      businessName={site.business_name ?? null}
      tier={site.tier ?? null}
      addOns={site.add_ons ?? []}
      monthlyRevenue={site.monthly_revenue ?? 0}
      buildFee={site.build_fee ?? 0}
      buildFeeDiscount={site.build_fee_discount ?? 0}
      hasStripeCustomer={!!site.stripe_customer_id}
    />
  );
}
