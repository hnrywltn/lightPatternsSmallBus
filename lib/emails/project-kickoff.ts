type Params = {
  name: string;
  businessName?: string;
};

export function projectKickoffEmail({ name, businessName }: Params) {
  const firstName = name.split(" ")[0];
  const project = businessName || "your project";

  return {
    subject: `We're building your site, ${firstName} — here's what to expect`,
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
            ${project} is in the build queue. 🚀
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            We're excited to get started, ${firstName}. Here's exactly what happens next.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Timeline -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Build timeline</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Days 1–3", "Discovery & design direction", "We review everything you shared and map out the structure and look of your site."],
              ["Days 4–7", "Initial design", "We build the first version and share it with you for feedback."],
              ["Days 8–11", "Revisions", "We refine until you're completely happy — no limit on rounds."],
              ["Days 12–14", "Launch", "We handle the technical setup, go live, and hand you the keys."],
            ].map(([days, title, desc]) => `
            <tr>
              <td style="padding:14px 0;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 1px;font-size:11px;font-weight:700;color:#f59e0b;text-transform:uppercase;letter-spacing:0.08em;">${days}</p>
                <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#1a1612;">${title}</p>
                <p style="margin:0;font-size:12px;color:#a0998c;line-height:1.5;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>
        </td></tr>

        <!-- What we need -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">What we may need from you</p>
          <p style="margin:0 0 16px;font-size:13px;color:#a0998c;line-height:1.6;">We'll reach out as things come up, but having these ready speeds things up:</p>
          <ul style="margin:0;padding-left:20px;font-size:13px;color:#3d3730;line-height:2;">
            <li>Logo files (if you have them)</li>
            <li>Photos of your business, team, or products</li>
            <li>Any copy/text you want on the site</li>
            <li>Login for your domain registrar (if we're handling DNS)</li>
          </ul>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:28px 40px;border-radius:0 0 16px 16px;">
          <p style="margin:0 0 16px;font-size:13px;color:#a0998c;">Questions at any point? Just reply to this email — we're always here.</p>
          <a href="mailto:hello@lightpatternsonline.com" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">Get in touch</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
