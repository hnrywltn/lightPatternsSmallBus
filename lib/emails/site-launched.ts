type Params = {
  name: string;
  siteUrl: string;
  businessName?: string;
};

export function siteLaunchedEmail({ name, siteUrl, businessName }: Params) {
  const firstName = name.split(" ")[0];
  const project = businessName || "your site";

  return {
    subject: `${project} is live! 🎉`,
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
          <div style="display:inline-block;background:#ffffff;padding:8px 20px;border-radius:8px;margin:0 0 20px;"><img src="https://lightpatternsonline.com/logo-vertical.png" alt="Light Patterns" style="height:48px;width:auto;display:block;" /></div>
          <h1 style="margin:0 0 12px;font-size:32px;font-weight:900;color:#f2ede4;letter-spacing:-0.02em;line-height:1.15;">
            You're live, ${firstName}. 💡
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            ${project} is now live and ready for the world.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Site link -->
        <tr><td style="background:#ffffff;padding:36px 40px;text-align:center;">
          <p style="margin:0 0 8px;font-size:13px;color:#a0998c;">Your new site is at</p>
          <a href="${siteUrl}" style="font-size:20px;font-weight:900;color:#d97706;text-decoration:none;letter-spacing:-0.01em;">${siteUrl.replace(/^https?:\/\//, "")}</a>
          <div style="margin-top:24px;">
            <a href="${siteUrl}" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">See your site →</a>
          </div>
        </td></tr>

        <!-- What's included -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">What's included going forward</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Hosting & uptime monitoring", "Your site is always on. We watch it so you don't have to."],
              ["Security updates", "We keep everything patched and protected."],
              ["Bug fixes", "Anything breaks, we fix it — included in your subscription."],
            ].map(([title, desc]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1612;">✦ ${title}</p>
                <p style="margin:0;font-size:12px;color:#a0998c;line-height:1.5;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>
        </td></tr>

        <!-- Referral ask -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:32px 40px;border-radius:0 0 16px 16px;">
          <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a1612;">Know someone who needs a site?</p>
          <p style="margin:0 0 16px;font-size:13px;color:#a0998c;line-height:1.6;">If you know another small business owner who could use a website, we'd love an introduction. Word of mouth means everything to us.</p>
          <a href="mailto:hello@lightpatternsonline.com?subject=Referral" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">Send a referral</a>
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
