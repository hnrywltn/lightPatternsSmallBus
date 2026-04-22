type Params = {
  name: string;
  phone: string;
  email: string;
  business?: string;
  goals: string;
};

export function contactNotificationEmail({ name, phone, email, business, goals }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `New inquiry${business ? ` from ${business}` : ""} — ${name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f5f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="background:#0c0a07;border-radius:16px 16px 0 0;padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div style="display:inline-block;background:#ffffff;padding:8px 20px;border-radius:8px;margin:0 0 4px;"><img src="https://lightpatternsonline.com/logo.png" alt="Light Patterns" style="height:32px;width:auto;display:block;" /></div>
                <h1 style="margin:0;font-size:24px;font-weight:900;color:#f2ede4;letter-spacing:-0.02em;">New inquiry</h1>
              </td>
              <td align="right" valign="middle">
                <div style="width:44px;height:44px;background:#f59e0b22;border:1px solid #f59e0b44;border-radius:50%;display:inline-block;text-align:center;line-height:44px;font-size:20px;">💡</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Contact details -->
        <tr><td style="background:#ffffff;padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Contact details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;width:110px;font-size:12px;color:#a0998c;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Name</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:15px;font-weight:700;color:#1a1612;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:12px;color:#a0998c;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Phone</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;font-size:15px;color:#1a1612;"><a href="tel:${phone}" style="color:#1a1612;text-decoration:none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;${business ? "border-bottom:1px solid #f0ede8;" : ""}font-size:12px;color:#a0998c;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Email</td>
              <td style="padding:10px 0;${business ? "border-bottom:1px solid #f0ede8;" : ""}font-size:15px;"><a href="mailto:${email}" style="color:#d97706;text-decoration:none;font-weight:600;">${email}</a></td>
            </tr>
            ${business ? `
            <tr>
              <td style="padding:10px 0;font-size:12px;color:#a0998c;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Business</td>
              <td style="padding:10px 0;font-size:15px;color:#1a1612;">${business}</td>
            </tr>` : ""}
          </table>
        </td></tr>

        <!-- Goals -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Their goals</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#3d3730;white-space:pre-wrap;">${goals}</p>
        </td></tr>

        <!-- Reply CTA -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:24px 40px;border-radius:0 0 16px 16px;">
          <a href="mailto:${email}" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:14px;font-weight:800;text-decoration:none;padding:12px 28px;border-radius:10px;letter-spacing:-0.01em;">Reply to ${firstName} →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#c0b9b0;">Sent via lightpatternsonline.com</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
