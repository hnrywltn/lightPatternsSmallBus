import { NextRequest, NextResponse } from "next/server";
import { decodeUnsubscribeEmail } from "@/lib/unsubscribeUrl";

export async function POST(request: NextRequest) {
  const { encoded } = await request.json();
  const email = decodeUnsubscribeEmail(encoded);

  if (!email) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const audienceId = process.env.RESEND_OUTREACH_AUDIENCE_ID!;
  const apiKey = process.env.RESEND_API_KEY!;

  // Mark unsubscribed in Resend — works whether or not they're already a contact
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, unsubscribed: true }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 502 });
  }

  return NextResponse.json({ success: true, email });
}
