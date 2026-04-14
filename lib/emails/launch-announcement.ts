export function launchAnnouncementEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return {
    subject: "Light Patterns is live — beautiful websites for small businesses",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#0c0a07;border-radius:16px 16px 0 0;padding:48px 40px 36px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#f59e0b;">Light Patterns</p>
          <h1 style="margin:0 0 16px;font-size:32px;font-weight:900;color:#f2ede4;letter-spacing:-0.02em;line-height:1.15;">
            We're live. 💡
          </h1>
          <p style="margin:0;font-size:16px;color:#f2ede4;opacity:0.6;line-height:1.7;">
            After months of building, Light Patterns is officially open. We build beautiful, high-performance websites for small businesses — and keep them running.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- What we do -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">What we offer</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${[
              ["Custom design", "No templates. Every site is built for your business specifically."],
              ["Fast & mobile-ready", "Sites that load in under 2 seconds and look great on any screen."],
              ["Subscription model", "One build fee, then a flat monthly rate. No surprise invoices."],
              ["Ongoing maintenance", "We handle updates, security, and hosting — so you don't have to."],
            ].map(([title, desc]) => `
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1a1612;">✦ ${title}</p>
                <p style="margin:0;font-size:13px;color:#a0998c;line-height:1.5;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>
        </td></tr>

        <!-- Pricing teaser -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Pricing</p>
          <p style="margin:0 0 20px;font-size:15px;color:#3d3730;line-height:1.6;">Plans start at a one-time build fee plus a simple monthly subscription. No lock-in, no hidden costs.</p>
          <a href="https://lightpatternsonline.com/#pricing" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">See pricing →</a>
        </td></tr>

        <!-- CTA -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:32px 40px;border-radius:0 0 16px 16px;">
          <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#1a1612;">Ready to get started?</p>
          <p style="margin:0 0 20px;font-size:13px;color:#a0998c;line-height:1.6;">Tell us about your business and what you're looking for. We'll get back to you within one business day.</p>
          <a href="https://lightpatternsonline.com/#contact" style="display:inline-block;background:#0c0a07;color:#f2ede4;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">Get in touch</a>
          <a href="https://lightpatternsonline.com" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">See the site</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">You're receiving this because you're part of our launch list. <a href="${unsubscribeUrl}" style="color:#d0c9c0;">Unsubscribe</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
