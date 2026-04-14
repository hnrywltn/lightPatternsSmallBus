import { NextRequest, NextResponse } from "next/server";

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  const { contacts }: { contacts: ContactPayload[] } = await request.json();

  if (!contacts?.length) {
    return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID!;
  const apiKey = process.env.RESEND_API_KEY!;

  const results = await Promise.all(
    contacts.map(async ({ name, email }) => {
      const res = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            first_name: name,
            unsubscribed: false,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { email, success: false, error: err };
      }

      return { email, success: true };
    })
  );

  const failed = results.filter((r) => !r.success);
  return NextResponse.json({ results, failed: failed.length });
}
