type Params = {
  businessName: string;
  ownerName?: string;
  unsubscribeUrl: string;
};

export function coldOutreachNoWebsiteEmail({ businessName, ownerName, unsubscribeUrl }: Params) {
  const greeting = ownerName ? `Hi ${ownerName.split(" ")[0]},` : `Hi there,`;

  return {
    subject: `${businessName} — your customers are searching for you online`,
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
            Your customers are looking for you — but can't find you.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            We noticed ${businessName} doesn't have a website yet. We can fix that.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#1a1612;line-height:1.7;">${greeting}</p>
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            Over 80% of customers search online before visiting or calling a local business. Without a website, you're invisible to most of them — and your competitors aren't.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d3730;line-height:1.7;">
            We build custom websites for small businesses like ${businessName} — fast, mobile-ready, and built to show up in Google search results.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border-radius:12px;padding:0;margin-bottom:24px;">
            ${[
              ["Launched in 10–14 days", "You'll have a live site fast — not months from now."],
              ["Flat monthly subscription", "Hosting, maintenance, and updates all included. No surprises."],
              ["Built for search", "We handle the technical SEO so customers can find you."],
            ].map(([title, desc]) => `
            <tr>
              <td style="padding:14px 20px;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1612;">✦ ${title}</p>
                <p style="margin:0;font-size:12px;color:#a0998c;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>

          <p style="margin:0 0 20px;font-size:14px;color:#3d3730;line-height:1.7;">
            I'd love to show you what a site for ${businessName} could look like. No commitment — just a quick conversation.
          </p>
          <a href="https://lightpatternsonline.com/#contact" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">Let's talk</a>
          <a href="https://lightpatternsonline.com/#pricing" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">See pricing</a>
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
