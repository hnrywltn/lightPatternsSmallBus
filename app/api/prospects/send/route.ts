import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { coldOutreachNoWebsiteEmail } from "@/lib/emails/cold-outreach-no-website";
import { unsubscribeUrl } from "@/lib/unsubscribeUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Contact {
  name: string;
  email: string;
}

export async function POST(request: NextRequest) {
  const { contacts }: { contacts: Contact[] } = await request.json();

  if (!contacts?.length) {
    return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
  }

  const results = await Promise.all(
    contacts.map(async ({ name, email }) => {
      const { error } = await resend.emails.send({
        from: "Light Patterns <hello@lightpatternsonline.com>",
        to: email,
        ...coldOutreachNoWebsiteEmail({
          businessName: name,
          unsubscribeUrl: unsubscribeUrl(email),
        }),
      });

      return { email, success: !error, error: error?.message };
    })
  );

  const failed = results.filter((r) => !r.success).length;
  return NextResponse.json({ results, failed });
}
