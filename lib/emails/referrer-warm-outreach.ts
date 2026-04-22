const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

interface ReferrerWarmOutreachParams {
  recipientName: string;
  recipientEmail: string;
  referrerName: string;
}

export function referrerWarmOutreachEmail({
  recipientName,
  referrerName,
}: ReferrerWarmOutreachParams) {
  const firstName = recipientName.split(" ")[0];
  const referrerFirst = referrerName.split(" ")[0];

  return {
    subject: `${referrerFirst} thought you'd be a great fit for Light Patterns`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f2ede4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f2ede4;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0c0a07;padding:28px 40px;">
            <div style="display:inline-block;background:#ffffff;padding:8px 20px;border-radius:8px;"><img src="https://lightpatternsonline.com/logo.png" alt="Light Patterns" style="height:32px;width:auto;display:block;" /></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 12px;">Hi ${firstName},</p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
              Your friend <strong>${referrerName}</strong> thought your business could benefit from a professional website — and passed your name along to us.
            </p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
              At Light Patterns, we build clean, fast websites for small businesses at a price that actually makes sense. No templates, no page builders — just a site that represents your business the right way.
            </p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 32px;">
              If you're curious, just reply to this email or check us out below. No pressure at all — ${referrerFirst} just wanted to make sure you knew we existed.
            </p>

            <!-- CTA -->
            <p style="margin:0 0 36px;">
              <a href="${SITE_URL}" style="display:inline-block;background:#d97706;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
                See What We Do →
              </a>
            </p>

            <p style="font-size:13px;color:#bbb;line-height:1.6;margin:0;">
              Questions? Just reply to this email — we're happy to chat.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf9f7;border-top:1px solid #eceae5;padding:24px 40px;">
            <p style="font-size:12px;color:#aaa;margin:0;line-height:1.6;">
              Light Patterns · hello@lightpatternsonline.com<br/>
              You received this because ${referrerName} thought you'd be interested. Feel free to ignore if not.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
