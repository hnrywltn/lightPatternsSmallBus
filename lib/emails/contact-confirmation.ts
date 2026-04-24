type Params = {
  name: string;
};

export function contactConfirmationEmail({ name }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `We got your message, ${firstName} — Light Patterns`,
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
          <h1 style="margin:0 0 12px;font-size:28px;font-weight:900;color:#f2ede4;letter-spacing:-0.02em;line-height:1.2;">
            Thanks, ${firstName}.<br/>We'll be in touch soon.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            Someone from our team will follow up with you within one business day.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- What happens next -->
        <tr><td style="background:#ffffff;padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">What happens next</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td valign="top" style="width:32px;padding-top:2px;">
                <div style="width:22px;height:22px;background:#f59e0b;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#1a1612;">1</div>
              </td>
              <td style="padding:0 0 20px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1a1612;">We review your message</p>
                <p style="margin:0;font-size:13px;color:#a0998c;line-height:1.5;">We'll read through what you shared and put together some initial thoughts on your project.</p>
              </td>
            </tr>
            <tr>
              <td valign="top" style="width:32px;padding-top:2px;">
                <div style="width:22px;height:22px;background:#f59e0b;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#1a1612;">2</div>
              </td>
              <td style="padding:0 0 20px;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1a1612;">We reach out</p>
                <p style="margin:0;font-size:13px;color:#a0998c;line-height:1.5;">Expect a reply to this email — or a call if that's easier — within one business day.</p>
              </td>
            </tr>
            <tr>
              <td valign="top" style="width:32px;padding-top:2px;">
                <div style="width:22px;height:22px;background:#f59e0b;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:800;color:#1a1612;">3</div>
              </td>
              <td style="padding:0;">
                <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#1a1612;">We get to work</p>
                <p style="margin:0;font-size:13px;color:#a0998c;line-height:1.5;">Once we're aligned on scope and plan, your site goes into the build queue — usually live within 10–14 days.</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Optional prep form -->
        <tr><td style="background:#faf9f7;border-top:1px solid #f0ede8;padding:32px 40px;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#a0998c;">Optional — help us prepare</p>
          <p style="margin:0 0 24px;font-size:13px;color:#a0998c;line-height:1.6;">
            Got 2 minutes? Fill out a quick form to help us hit the ground running. The more context you share, the better our first conversation will be — but it's totally optional.
          </p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSddGi0AElRozx3U4ZAm3S1liDiSgUkROA3_Qanj77MqlnWZ-g/viewform?usp=publish-editor" style="display:inline-block;background:#0c0a07;color:#f2ede4;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;">Fill out the prep form →</a>
        </td></tr>

        <!-- Footer CTA -->
        <tr><td style="background:#ffffff;border-top:1px solid #f0ede8;padding:28px 40px;border-radius:0 0 16px 16px;">
          <p style="margin:0 0 16px;font-size:13px;color:#a0998c;">In the meantime, feel free to browse our work or check out pricing.</p>
          <a href="https://lightpatternsonline.com/#portfolio" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:11px 24px;border-radius:10px;margin-right:8px;">See our work</a>
          <a href="https://lightpatternsonline.com/#pricing" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:11px 24px;border-radius:10px;border:1px solid #e5e0d8;">View pricing</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">You're receiving this because you submitted an inquiry on our site.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
