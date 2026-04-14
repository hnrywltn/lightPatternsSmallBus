import { Resend } from "resend";
import { coldOutreachNoWebsiteEmail } from "../lib/emails/cold-outreach-no-website";
import { unsubscribeUrl } from "../lib/unsubscribeUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

async function run() {
  const { error } = await resend.emails.send({
    from: "Light Patterns <hello@lightpatternsonline.com>",
    to: "hnrywltn@gmail.com",
    ...coldOutreachNoWebsiteEmail({
      businessName: "Henry's Barbershop",
      ownerName: "Henry Walton",
      unsubscribeUrl: unsubscribeUrl("hnrywltn@gmail.com"),
    }),
  });

  if (error) console.error("Failed:", error);
  else console.log("Sent.");
}

run();
