import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import ClientDashboardClient from "./ClientDashboardClient";

export default async function ClientDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("lp_session")?.value;
  const isAdminAuthed = !!process.env.ADMIN_SESSION_TOKEN && adminSession === process.env.ADMIN_SESSION_TOKEN;

  const { preview: previewSiteId } = await searchParams;

  // Admin preview mode — load site by ID, no client session needed
  if (isAdminAuthed && previewSiteId) {
    const { rows } = await pool.query(
      `SELECT
        s.id AS site_id,
        s.business_name,
        s.domain,
        s.tier,
        s.status AS site_status,
        s.stripe_customer_id,
        s.monthly_revenue,
        s.add_ons,
        s.contact_name,
        s.contact_email
       FROM sites s
       WHERE s.id = $1
       LIMIT 1`,
      [previewSiteId]
    );
    const row = rows[0];
    if (!row) redirect("/dashboard/sites");

    return (
      <ClientDashboardClient
        isAdminPreview={true}
        client={{
          name: row.contact_name ?? "Client",
          email: row.contact_email ?? "—",
          siteId: row.site_id,
          businessName: row.business_name,
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

  // Normal client session
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
      isAdminPreview={isAdminAuthed}
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
