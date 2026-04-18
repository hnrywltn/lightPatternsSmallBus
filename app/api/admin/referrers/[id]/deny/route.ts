import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.ADMIN_SESSION_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { rows } = await pool.query(
    "SELECT name, email FROM referrers WHERE id = $1 AND status = 'pending'",
    [id]
  );
  const referrer = rows[0];

  if (!referrer) {
    return new NextResponse(html("Already actioned", "This referrer has already been approved or denied."), {
      headers: { "Content-Type": "text/html" },
    });
  }

  await pool.query(
    "UPDATE referrers SET status = 'denied', updated_at = NOW() WHERE id = $1",
    [id]
  );

  return new NextResponse(
    html("Referrer denied", `${referrer.name} (${referrer.email}) has been denied and will not receive an invite.`),
    { headers: { "Content-Type": "text/html" } }
  );
}

function html(title: string, message: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
  <style>body{font-family:sans-serif;background:#0c0a07;color:#f2ede4;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
  .card{background:#1a1714;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:40px;max-width:420px;text-align:center;}
  h1{font-size:18px;margin:0 0 12px;}p{font-size:14px;color:rgba(242,237,228,0.5);margin:0;line-height:1.6;}</style>
  </head><body><div class="card"><h1>${title}</h1><p>${message}</p></div></body></html>`;
}
