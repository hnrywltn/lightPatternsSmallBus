import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/clientAuth";
import pool from "@/lib/db";
import ClientDashboardClient from "./ClientDashboardClient";

export default async function ClientDashboardPage() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");

  const { rows } = await pool.query(
    `SELECT u.name, u.email, c.site_url, c.plan, c.billing_status
     FROM users u
     JOIN clients c ON c.user_id = u.id
     WHERE u.id = $1`,
    [session.sub]
  );

  const client = rows[0];
  if (!client) redirect("/client/login");

  return <ClientDashboardClient client={client} />;
}
