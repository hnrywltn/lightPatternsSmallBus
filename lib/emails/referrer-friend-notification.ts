const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lightpatternsonline.com";

interface ReferrerFriendNotificationParams {
  pendingReferrerId: string;
  pendingName: string;
  pendingEmail: string;
  referredByName: string;
  referredByEmail: string;
  adminSecret: string;
}

export function referrerFriendNotificationEmail({
  pendingReferrerId,
  pendingName,
  pendingEmail,
  referredByName,
  referredByEmail,
  adminSecret,
}: ReferrerFriendNotificationParams) {
  const approveUrl = `${SITE_URL}/api/admin/referrers/${pendingReferrerId}/approve?secret=${adminSecret}`;
  const denyUrl = `${SITE_URL}/api/admin/referrers/${pendingReferrerId}/deny?secret=${adminSecret}`;

  return {
    subject: `New referrer application — ${pendingName} (referred by ${referredByName})`,
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
            <span style="display:block;font-size:12px;color:#ffffff60;margin-top:4px;">Referral Program — Admin Notification</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="font-size:15px;color:#333;line-height:1.7;margin:0 0 20px;">
              <strong>${referredByName}</strong> has referred a friend to join the referral program. They need your approval before receiving an invite.
            </p>

            <!-- Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border:1px solid #eceae5;border-radius:8px;overflow:hidden;margin-bottom:32px;">
              <tr>
                <td style="padding:16px 20px;background:#f2ede4;border-bottom:1px solid #eceae5;">
                  <span style="font-size:11px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Application details</span>
                </td>
              </tr>
              <tr><td style="padding:0 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:12px 0 8px;font-size:13px;color:#999;border-bottom:1px solid #f0f0ee;width:140px;">Applicant name</td>
                    <td style="padding:12px 0 8px;font-size:14px;font-weight:600;color:#1a1a1a;border-bottom:1px solid #f0f0ee;">${pendingName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 8px;font-size:13px;color:#999;border-bottom:1px solid #f0f0ee;">Applicant email</td>
                    <td style="padding:10px 0 8px;font-size:14px;color:#444;border-bottom:1px solid #f0f0ee;">${pendingEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 8px;font-size:13px;color:#999;border-bottom:1px solid #f0f0ee;">Referred by</td>
                    <td style="padding:10px 0 8px;font-size:14px;color:#444;border-bottom:1px solid #f0f0ee;">${referredByName} (${referredByEmail})</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0 14px;font-size:13px;color:#999;">Bonus on approval</td>
                    <td style="padding:10px 0 14px;font-size:13px;color:#d97706;">$100 one-time to ${referredByName} when first payout earned</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Approve / Deny -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
                    ✓ Approve
                  </a>
                </td>
                <td>
                  <a href="${denyUrl}" style="display:inline-block;background:#dc2626;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
                    ✕ Deny
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:12px;color:#bbb;line-height:1.6;margin:24px 0 0;">
              These links are single-use and secured. Approving will automatically send ${pendingName} a referrer invite email.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#faf9f7;border-top:1px solid #eceae5;padding:24px 40px;">
            <p style="font-size:12px;color:#aaa;margin:0;line-height:1.6;">
              Light Patterns · admin@lightpatternsonline.com
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
