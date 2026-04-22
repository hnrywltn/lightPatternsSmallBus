const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

export function passwordResetEmail({ token }: { token: string }) {
  const resetUrl = `${SITE_URL}/client/reset-password?token=${token}`;

  return {
    subject: "Reset your Light Patterns password",
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
            <div style="display:inline-block;background:#ffffff;padding:8px 20px;border-radius:8px;"><img src="https://lightpatternsonline.com/logo.png" alt="Light Patterns" style="height:32px;width:auto;display:block;" /></div>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">
              We received a request to reset your password. Click below to choose a new one.
            </p>
            <p style="margin:0 0 32px;">
              <a href="${resetUrl}" style="display:inline-block;background:#7c3aed;color:#ffffff;font-size:14px;font-weight:600;padding:13px 28px;border-radius:6px;text-decoration:none;">
                Reset Password
              </a>
            </p>
            <p style="font-size:13px;color:#999;line-height:1.6;margin:0 0 8px;">This link expires in 1 hour.</p>
            <p style="font-size:13px;color:#999;line-height:1.6;margin:0;">
              If you didn't request a password reset, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f7;border-top:1px solid #eee;padding:24px 40px;">
            <p style="font-size:12px;color:#aaa;margin:0;">Light Patterns · hello@lightpatternsonline.com</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}
