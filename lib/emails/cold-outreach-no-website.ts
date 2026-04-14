type Params = {
  businessName: string;
  ownerName?: string;
  unsubscribeUrl: string;
};

export function coldOutreachNoWebsiteEmail({ businessName, ownerName, unsubscribeUrl }: Params) {
  const greeting = ownerName ? `Hi ${ownerName.split(" ")[0]},` : `Hi there,`;

  return {
    subject: `Help welcome us to the neighborhood 👋`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#0c0a07;border-radius:16px 16px 0 0;padding:40px 40px 32px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#f59e0b;">Light Patterns</p>
          <h1 style="margin:0 0 12px;font-size:26px;font-weight:900;color:#f2ede4;letter-spacing:-0.02em;line-height:1.2;">
            We just launched — and we'd love to help ${businessName} grow.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            We build websites for local businesses like yours. Simple, affordable, and done right.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1612;line-height:1.7;">${greeting}</p>
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            We're Light Patterns — a small web studio that just opened up, and we're looking to work with great local businesses in the area. We noticed ${businessName} doesn't have a website yet, and we think we could help.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d3730;line-height:1.7;">
            We'd love to build you something you're proud of — fast to launch, easy to maintain, and built to show up when customers search for you.
          </p>

          <!-- Pricing highlight -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fffbf2;border:1px solid #f59e0b33;border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#d97706;">Starter plan</p>
              <p style="margin:0 0 8px;font-size:28px;font-weight:900;color:#1a1612;letter-spacing:-0.02em;">$59<span style="font-size:15px;font-weight:500;color:#a0998c;">/mo</span></p>
              <p style="margin:0;font-size:13px;color:#6b5f55;line-height:1.6;">Includes your website, hosting, maintenance, and updates — everything covered, no surprises. One-time build fee to get started.</p>
            </td></tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border-radius:12px;padding:0;margin-bottom:24px;">
            ${[
              ["Live in 10–14 days", "A real site up fast — not months from now."],
              ["Built for Google", "We handle the SEO so customers can actually find you."],
              ["We handle everything", "Hosting, updates, security — all included in your subscription."],
            ].map(([title, desc]) => `
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1612;">✦ ${title}</p>
                <p style="margin:0;font-size:12px;color:#a0998c;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>

          <p style="margin:0 0 20px;font-size:14px;color:#3d3730;line-height:1.7;">
            No commitment — just reply and we'll show you what a site for ${businessName} could look like.
          </p>
          <a href="https://lightpatternsonline.com/#contact" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">Let's talk</a>
          <a href="https://lightpatternsonline.com/#pricing" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">See all plans</a>
        </td></tr>

        <!-- Prep form -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:28px 40px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Got 2 minutes?</p>
          <p style="margin:0 0 16px;font-size:13px;color:#6b5f55;line-height:1.6;">Fill out a quick form and we'll put together some ideas for ${businessName} before we even talk. No commitment — just a head start.</p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSddGi0AElRozx3U4ZAm3S1liDiSgUkROA3_Qanj77MqlnWZ-g/viewform?usp=publish-editor" style="display:inline-block;background:#0c0a07;color:#f2ede4;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">Fill out the form →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;"><a href="${unsubscribeUrl}" style="color:#d0c9c0;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
