type Params = {
  name: string;
  siteUrl: string;
  month: string; // e.g. "April 2026"
  uptimePercent?: string; // e.g. "99.98%"
  pageViews?: string; // e.g. "1,240"
  unsubscribeUrl: string;
};

export function monthlyCheckinEmail({ name, siteUrl, month, uptimePercent, pageViews, unsubscribeUrl }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `Your site report for ${month}, ${firstName}`,
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
            ${month} site report
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            Here's a quick look at how your site performed this month, ${firstName}.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Stats -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">This month</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${uptimePercent ? `
              <td style="padding:16px 20px;background:#faf9f7;border-radius:12px;text-align:center;width:50%;">
                <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#1a1612;">${uptimePercent}</p>
                <p style="margin:0;font-size:11px;font-weight:700;color:#a0998c;text-transform:uppercase;letter-spacing:0.08em;">Uptime</p>
              </td>
              <td style="width:16px;"></td>` : ""}
              ${pageViews ? `
              <td style="padding:16px 20px;background:#faf9f7;border-radius:12px;text-align:center;width:50%;">
                <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#1a1612;">${pageViews}</p>
                <p style="margin:0;font-size:11px;font-weight:700;color:#a0998c;text-transform:uppercase;letter-spacing:0.08em;">Page views</p>
              </td>` : ""}
            </tr>
          </table>
        </td></tr>

        <!-- What we handled -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">What we handled this month</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              "Security patches and dependency updates applied",
              "Uptime monitoring active 24/7",
              "SSL certificate valid and renewed automatically",
            ].map(item => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f0ede8;font-size:13px;color:#3d3730;">
                <span style="color:#f59e0b;margin-right:8px;">✓</span>${item}
              </td>
            </tr>`).join("")}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:28px 40px;border-radius:0 0 16px 16px;">
          <p style="margin:0 0 16px;font-size:13px;color:#a0998c;">Need a content update or have something to add to your site? Just reply and let us know.</p>
          <a href="${siteUrl}" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">View your site</a>
          <a href="mailto:hello@lightpatternsonline.com" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">Request a change</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">You're receiving this as part of your subscription. <a href="${unsubscribeUrl}" style="color:#d0c9c0;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
