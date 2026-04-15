const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

interface InviteEmailParams {
  email: string;
  token: string;
  contactName?: string | null;
  businessName?: string | null;
  tier?: string | null;
  addOns?: string[];
  monthlyRevenue?: number;
  buildFee?: number;
}

function formatCurrency(cents: number) {
  return `$${cents.toLocaleString()}`;
}

export function clientInviteEmail({
  email,
  token,
  contactName,
  businessName,
  tier,
  addOns = [],
  monthlyRevenue = 0,
  buildFee = 0,
}: InviteEmailParams) {
  const signupUrl = `${SITE_URL}/client/signup?token=${token}`;
  const firstName = contactName ? contactName.split(" ")[0] : null;
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const planLabel = tier === "Premium" ? "Premium Plan" : "Essential Plan";

  const addOnRows = addOns.length > 0
    ? addOns.map((ao) => `
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#555;border-bottom:1px solid #f0f0ee;">${ao}</td>
          <td style="padding:8px 0;font-size:14px;color:#555;text-align:right;border-bottom:1px solid #f0f0ee;">Add-on</td>
        </tr>`).join("")
    : "";

  return {
    subject: businessName
      ? `Your Light Patterns portal is ready — ${businessName}`
      : "Your Light Patterns portal is ready",
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
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">Light Patterns</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 12px;">${greeting}</p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 28px;">
              ${businessName
                ? `Your <strong>${businessName}</strong> client portal is set up and ready to go.`
                : "Your Light Patterns client portal is set up and ready to go."
              }
              Click below to create your password and complete your account setup.
            </p>

            <!-- CTA -->
            <p style="margin:0 0 36px;">
              <a href="${signupUrl}" style="display:inline-block;background:#d97706;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.01em;">
                Set Up Your Account →
              </a>
            </p>

            ${tier || buildFee > 0 || monthlyRevenue > 0 ? `
            <!-- Plan summary -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #eceae5;border-radius:8px;overflow:hidden;margin-bottom:28px;">
              <tr>
                <td style="padding:16px 20px;background:#f2ede4;border-bottom:1px solid #eceae5;">
                  <span style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Your plan</span>
                </td>
              </tr>
              <tr><td style="padding:0 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${tier ? `
                  <tr>
                    <td style="padding:12px 0 8px;font-size:15px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #f0f0ee;">${planLabel}</td>
                    <td style="padding:12px 0 8px;font-size:15px;font-weight:700;color:#1a1a1a;text-align:right;border-bottom:1px solid #f0f0ee;">${monthlyRevenue > 0 ? `${formatCurrency(monthlyRevenue)}/mo` : ""}</td>
                  </tr>` : ""}
                  ${addOnRows}
                  ${buildFee > 0 ? `
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#555;border-bottom:1px solid #f0f0ee;">One-time build fee</td>
                    <td style="padding:8px 0;font-size:14px;color:#555;text-align:right;border-bottom:1px solid #f0f0ee;">${formatCurrency(buildFee)}</td>
                  </tr>` : ""}
                  ${monthlyRevenue > 0 ? `
                  <tr>
                    <td style="padding:12px 0;font-size:13px;color:#999;">Recurring after launch</td>
                    <td style="padding:12px 0;font-size:14px;font-weight:600;color:#d97706;text-align:right;">${formatCurrency(monthlyRevenue)}/mo</td>
                  </tr>` : ""}
                </table>
              </td></tr>
            </table>
            ` : ""}

            <p style="font-size:13px;color:#999;line-height:1.6;margin:0 0 8px;">This link expires in 48 hours.</p>
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
              Light Patterns · hello@lightpatternsonline.com<br/>
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
