import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { setClientSession } from "@/lib/clientAuth";

export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json();

  if (!token || !name || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  // Validate invite token
  const { rows: invites } = await pool.query(
    "SELECT * FROM invites WHERE token = $1 AND accepted_at IS NULL AND expires_at > NOW()",
    [token]
  );

  const invite = invites[0];
  if (!invite) {
    return NextResponse.json({ error: "This invite link is invalid or has expired." }, { status: 400 });
  }

  // Check user doesn't already exist
  const { rows: existing } = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [invite.email]
  );
  if (existing.length > 0) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email",
      [invite.email, name.trim(), password_hash]
    );
    const user = rows[0];

    // Create client record
    await client.query(
      "INSERT INTO clients (user_id) VALUES ($1)",
      [user.id]
    );

    // Mark invite accepted
    await client.query(
      "UPDATE invites SET accepted_at = NOW() WHERE id = $1",
      [invite.id]
    );

    // Link the site to this user if the invite had one
    if (invite.site_id) {
      await client.query(
        "UPDATE sites SET user_id = $1 WHERE id = $2",
        [user.id, invite.site_id]
      );
    }

    await client.query("COMMIT");
    await setClientSession(user.id, user.email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}
