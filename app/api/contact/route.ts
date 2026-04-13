import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

  const { error } = await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: process.env.CONTACT_EMAIL,
    replyTo: email,
    subject: `New inquiry${business ? ` from ${business}` : ""} — ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; color: #1a1a1a;">
        <h2 style="margin-bottom: 4px;">New contact form submission</h2>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #666; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #d97706;">${email}</a></td></tr>
          ${business ? `<tr><td style="padding: 8px 0; color: #666;">Business</td><td style="padding: 8px 0;">${business}</td></tr>` : ""}
        </table>
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
        <p style="font-size: 13px; color: #666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Goals</p>
        <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${goals}</p>
      </div>
    `,
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
