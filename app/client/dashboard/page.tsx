import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import ClientDashboardClient from "./ClientDashboardClient";

export default async function ClientDashboardPage() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { rows } = await pool.query(
    `SELECT
      u.name,
      u.email,
      s.id AS site_id,
      s.business_name,
      s.domain,
      s.tier,
      s.status AS site_status,
      s.stripe_customer_id,
      s.monthly_revenue,
      s.add_ons
     FROM users u
     LEFT JOIN sites s ON s.user_id = u.id
     WHERE u.id = $1
     LIMIT 1`,
    [session.sub]
  );

  const row = rows[0];
  if (!row) redirect("/client/login");

  return (
    <ClientDashboardClient
      client={{
        name: row.name,
        email: row.email,
        siteId: row.site_id ?? null,
        businessName: row.business_name ?? null,
        domain: row.domain ?? null,
        tier: row.tier ?? null,
        siteStatus: row.site_status ?? null,
        stripeCustomerId: row.stripe_customer_id ?? null,
        monthlyRevenue: row.monthly_revenue ?? 0,
        addOns: row.add_ons ?? [],
      }}
    />
  );
}
