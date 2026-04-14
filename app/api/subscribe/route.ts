import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (!resend || !process.env.RESEND_LEADS_AUDIENCE_ID) {
    console.warn("Resend not configured. Set RESEND_API_KEY and RESEND_LEADS_AUDIENCE_ID.");
    return NextResponse.json({ ok: true });
  }

  const { error } = await resend.contacts.create({
    email,
    audienceId: process.env.RESEND_LEADS_AUDIENCE_ID,
    unsubscribed: false,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
