type Params = {
  name: string;
};

export function followUp2Email({ name }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `Last note from us, ${firstName}`,
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
            We'll leave the light on.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            This is our last follow-up — no hard feelings either way.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            Hey ${firstName} — we know life gets busy. We won't keep filling your inbox, but we did want to leave the door open.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            When the timing is right, we're here. You can always reach us at <a href="mailto:hello@lightpatternsonline.com" style="color:#d97706;text-decoration:none;font-weight:600;">hello@lightpatternsonline.com</a> or come back to the site whenever you're ready.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d3730;line-height:1.7;">
            Wishing you and your business all the best. 💡
          </p>
          <a href="https://lightpatternsonline.com" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">Visit the site</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">You're receiving this because you submitted an inquiry. <a href="" style="color:#d0c9c0;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
