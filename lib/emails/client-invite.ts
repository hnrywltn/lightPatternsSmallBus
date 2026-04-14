const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

export function clientInviteEmail({ email, token }: { email: string; token: string }) {
  const signupUrl = `${SITE_URL}/client/signup?token=${token}`;

  return {
    subject: "You've been invited to Light Patterns",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#05050a;padding:28px 40px;">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">Light Patterns</span>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">Hi there,</p>
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">
              You've been invited to access your Light Patterns client portal. Click the button below to set your password and log in.
            </p>
            <p style="margin:0 0 32px;">
              <a href="${signupUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:14px;font-weight:600;padding:13px 28px;border-radius:6px;text-decoration:none;">
                Set Up Your Account
              </a>
            </p>
            <p style="font-size:13px;color:#999;line-height:1.6;margin:0 0 8px;">This link expires in 48 hours.</p>
            <p style="font-size:13px;color:#999;line-height:1.6;margin:0;">
              Or copy this URL into your browser:<br/>
              <span style="color:#7c3aed;">${signupUrl}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f7;border-top:1px solid #eee;padding:24px 40px;">
            <p style="font-size:12px;color:#aaa;margin:0;">
              Light Patterns · hello@lightpatternsonline.com<br/>
              If you didn't expect this invitation, you can ignore this email.
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
