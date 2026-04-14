type Params = {
  name: string;
  unsubscribeUrl: string;
};

export function followUp1Email({ name, unsubscribeUrl }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `Still thinking it over, ${firstName}?`,
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
            Just checking in, ${firstName}.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            You reached out a few days ago — we wanted to make sure you didn't get lost in the shuffle.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            Hi ${firstName} — we saw your inquiry come in and wanted to follow up. If you're still weighing your options or have questions about what a website would cost or look like for your business, we're happy to walk you through it.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d3730;line-height:1.7;">
            No pressure at all — just reply to this email or hit the button below and we'll find a time to chat.
          </p>
          <a href="https://lightpatternsonline.com/#contact" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">Let's connect</a>
          <a href="https://lightpatternsonline.com/#pricing" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">See pricing</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">You're receiving this because you submitted an inquiry. <a href="${unsubscribeUrl}" style="color:#d0c9c0;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
