const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

interface ReferrerInviteEmailParams {
  name?: string | null;
  email: string;
  token: string;
  commissionType: "flat" | "percentage";
  commissionAmount: number;
  referralCode?: string | null;
}

export function referrerInviteEmail({
  name,
  email,
  token,
  commissionType,
  commissionAmount,
  referralCode,
}: ReferrerInviteEmailParams) {
  const signupUrl = `${SITE_URL}/referrer/signup?token=${token}`;
  const firstName = name ? name.split(" ")[0] : null;
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  const commissionDisplay =
    commissionType === "flat"
      ? `$${commissionAmount.toLocaleString()}`
      : `${commissionAmount}%`;

  const commissionLine =
    commissionType === "flat"
      ? `You'll earn <strong>${commissionDisplay}</strong> for every business you refer whose site goes live with us.`
      : `You'll earn <strong>${commissionDisplay} of the build fee</strong> for every business you refer whose site goes live with us.`;

  return {
    subject: firstName
      ? `${firstName}, you're invited to the Light Patterns referral program`
      : "You're invited to the Light Patterns referral program",
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
            <div style="display:inline-block;background:#ffffff;padding:8px 20px;border-radius:8px;"><img src="https://lightpatternsonline.com/logo-vertical.png" alt="Light Patterns" style="height:48px;width:auto;display:block;" /></div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 12px;">${greeting}</p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 20px;">
              We'd love to have you as a referral partner. Light Patterns builds professional websites for small businesses — and when you send someone our way, we make it worth your while.
            </p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 32px;">
              ${commissionLine} Once a site goes live, we'll reach out to arrange your payout.
            </p>

            <!-- Commission callout -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #eceae5;border-radius:8px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="padding:16px 20px;background:#f2ede4;border-bottom:1px solid #eceae5;">
                  <span style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Your referral details</span>
                </td>
              </tr>
              <tr><td style="padding:0 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:14px 0 10px;font-size:14px;color:#555;border-bottom:1px solid #f0f0ee;">Payout per referral (site live)</td>
                    <td style="padding:14px 0 10px;font-size:15px;font-weight:700;color:#d97706;text-align:right;border-bottom:1px solid #f0f0ee;">${commissionDisplay}</td>
                  </tr>
                  ${referralCode ? `
                  <tr>
                    <td style="padding:10px 0 14px;font-size:14px;color:#555;">Your referral code</td>
                    <td style="padding:10px 0 14px;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right;font-family:monospace;letter-spacing:0.05em;">${referralCode}</td>
                  </tr>` : `
                  <tr>
                    <td colspan="2" style="padding:10px 0 14px;font-size:13px;color:#aaa;">A referral code will be assigned to your account.</td>
                  </tr>`}
                </table>
              </td></tr>
            </table>

            <!-- CTA -->
            <p style="margin:0 0 28px;">
              <a href="${signupUrl}" style="display:inline-block;background:#d97706;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
                Create Your Account →
              </a>
            </p>

            <p style="font-size:13px;color:#999;line-height:1.6;margin:0 0 8px;">This link expires in 7 days. Questions? Just reply to this email.</p>
            <p style="font-size:13px;color:#bbb;line-height:1.6;margin:0;">
              Or copy this URL:<br/>
              <span style="color:#d97706;">${signupUrl}</span>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf9f7;border-top:1px solid #eceae5;padding:24px 40px;">
            <p style="font-size:12px;color:#aaa;margin:0;line-height:1.6;">
              Light Patterns · admin@lightpatternsonline.com<br/>
              If you didn't expect this invitation, you can safely ignore this email.
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
