import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function isAdminAuthed(req: NextRequest) {
  const session = req.cookies.get("lp_session")?.value;
  return !!process.env.ADMIN_SESSION_TOKEN && session === process.env.ADMIN_SESSION_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { article, feedback } = await req.json();
  if (!feedback?.trim()) {
    return NextResponse.json({ error: "Feedback is required." }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json({ ok: true });
  }

  await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: "admin@lightpatternsonline.com",
    subject: `Guide feedback: ${article}`,
    html: `
      <p style="font-family:sans-serif;font-size:14px;color:#333;">
        <strong>Article:</strong> ${article}<br/><br/>
        <strong>Feedback:</strong><br/>
        ${feedback.trim().replace(/\n/g, "<br/>")}
      </p>
    `,
  });

  return NextResponse.json({ ok: true });
}
