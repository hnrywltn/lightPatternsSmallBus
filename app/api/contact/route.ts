import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactNotificationEmail } from "@/lib/emails/contact-notification";
import { contactConfirmationEmail } from "@/lib/emails/contact-confirmation";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  const { name, phone, email, business, goals } = await req.json();

  if (!name || !phone || !email || !goals) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  if (!resend || !process.env.CONTACT_EMAIL) {
    console.warn("Resend not configured. Set RESEND_API_KEY and CONTACT_EMAIL.");
    return NextResponse.json({ ok: true });
  }

  const notification = contactNotificationEmail({ name, phone, email, business, goals });
  const { error } = await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    ...notification,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const confirmation = contactConfirmationEmail({ name });
  const { error: confirmError } = await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: email,
    replyTo: "hello@lightpatternsonline.com",
    ...confirmation,
  });

  if (confirmError) {
    console.error("Resend confirmation error:", confirmError);
  }

  return NextResponse.json({ ok: true });
}
