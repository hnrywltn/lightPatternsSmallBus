import { Resend } from "resend";
import { launchAnnouncementEmail } from "../lib/emails/launch-announcement";
import { coldOutreachNoWebsiteEmail } from "../lib/emails/cold-outreach-no-website";
import { followUp1Email } from "../lib/emails/follow-up-1";
import { followUp2Email } from "../lib/emails/follow-up-2";
import { proposalSentEmail } from "../lib/emails/proposal-sent";
import { projectKickoffEmail } from "../lib/emails/project-kickoff";
import { siteLaunchedEmail } from "../lib/emails/site-launched";
import { monthlyCheckinEmail } from "../lib/emails/monthly-checkin";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = "hnrywltn@gmail.com";
const FROM = "Light Patterns <hello@lightpatternsonline.com>";

const TEST_UNSUB = "https://lightpatternsonline.com/unsubscribe?e=dGVzdEBleGFtcGxlLmNvbQ";

const emails = [
  launchAnnouncementEmail({ unsubscribeUrl: TEST_UNSUB }),
  coldOutreachNoWebsiteEmail({ businessName: "Henry's Barbershop", ownerName: "Henry Walton", unsubscribeUrl: TEST_UNSUB }),
  followUp1Email({ name: "Henry Walton", unsubscribeUrl: TEST_UNSUB }),
  followUp2Email({ name: "Henry Walton", unsubscribeUrl: TEST_UNSUB }),
  proposalSentEmail({ name: "Henry Walton", proposalUrl: "https://lightpatternsonline.com" }),
  projectKickoffEmail({ name: "Henry Walton", businessName: "Henry's Barbershop" }),
  siteLaunchedEmail({ name: "Henry Walton", siteUrl: "https://lightpatternsonline.com", businessName: "Henry's Barbershop" }),
  monthlyCheckinEmail({ name: "Henry Walton", siteUrl: "https://lightpatternsonline.com", month: "April 2026", uptimePercent: "99.98%", pageViews: "1,240", unsubscribeUrl: TEST_UNSUB }),
];

async function run() {
  for (const email of emails) {
    const { error } = await resend.emails.send({ from: FROM, to: TO, ...email });
    if (error) {
      console.error(`Failed: ${email.subject}`, error);
    } else {
      console.log(`Sent: ${email.subject}`);
    }
  }
}

run();
