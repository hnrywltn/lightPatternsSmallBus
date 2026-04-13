type Params = {
  name: string;
  proposalUrl?: string;
};

export function proposalSentEmail({ name, proposalUrl }: Params) {
  const firstName = name.split(" ")[0];

  return {
    subject: `Your Light Patterns proposal, ${firstName}`,
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
            Your proposal is ready, ${firstName}.
          </h1>
          <p style="margin:0;font-size:15px;color:#f2ede4;opacity:0.5;line-height:1.6;">
            Take your time reviewing — and reach out with any questions.
          </p>
        </td></tr>

        <!-- Amber accent bar -->
        <tr><td style="background:linear-gradient(90deg,#f59e0b,#d97706);height:3px;"></td></tr>

        <!-- Body -->
        <tr><td style="background:#ffffff;padding:36px 40px;">
          <p style="margin:0 0 16px;font-size:15px;color:#3d3730;line-height:1.7;">
            Hi ${firstName} — based on our conversation, we've put together a proposal outlining the scope, timeline, and pricing for your project.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#3d3730;line-height:1.7;">
            A few things to know before you review:
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            ${[
              ["No hidden fees", "The price in the proposal is the price you pay. No surprises."],
              ["Unlimited revisions during the build", "We don't move to launch until you're happy with the design."],
              ["14-day satisfaction guarantee", "If you're not happy after launch, we'll make it right or refund you."],
            ].map(([title, desc]) => `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0ede8;">
                <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1a1612;">✦ ${title}</p>
                <p style="margin:0;font-size:12px;color:#a0998c;line-height:1.5;">${desc}</p>
              </td>
            </tr>`).join("")}
          </table>
          ${proposalUrl ? `<a href="${proposalUrl}" style="display:inline-block;background:#f59e0b;color:#1a1612;font-size:13px;font-weight:800;text-decoration:none;padding:12px 24px;border-radius:10px;margin-right:8px;">View proposal →</a>` : ""}
          <a href="mailto:hello@lightpatternsonline.com" style="display:inline-block;background:#f5f4f0;color:#3d3730;font-size:13px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:10px;border:1px solid #e5e0d8;">Ask a question</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px 0;text-align:center;">
          <p style="margin:0 0 4px;font-size:12px;color:#c0b9b0;">Light Patterns — lightpatternsonline.com</p>
          <p style="margin:0;font-size:11px;color:#d0c9c0;">Reply to this email any time.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  };
}
