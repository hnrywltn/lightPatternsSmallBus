"use client";

import { useState } from "react";
import {
  UserPlus,
  Send,
  LayoutDashboard,
  CreditCard,
  Rocket,
  Search,
  ChevronRight,
  MessageSquare,
  CheckCircle,
  Loader2,
  MailOpen,
  Wallet,
  Users,
} from "lucide-react";

const articles = [
  {
    id: "adding-a-client",
    icon: UserPlus,
    title: "Adding a new client",
    summary: "Create a site record with all the details before sending an invite.",
    content: [
      {
        heading: "Start with a site record",
        body: `Every client starts as a site record. Go to Sites → Add Site and fill in:
- **Business Name** — required. This shows in the client's portal.
- **Contact Name & Email** — used for the invite and in the Stripe customer.
- **Tier** — Essential ($59/mo) or Premium ($99/mo). This determines what shows in the invite email.
- **Build Fee** — the one-time fee. Enter the dollar amount (e.g. 1500 for $1,500). The client pays this on the setup page after signing up.
- **Monthly Revenue** — matches the tier pricing. This shows in the invite email and client portal.
- **Add-ons** — any extras they've agreed to (Advanced SEO, Business Setup, etc.).
- **Status** — set to "In Progress" until the site is live, then switch to "Active".`,
      },
      {
        heading: "What gets created automatically",
        body: `When you save a new site, nothing is charged yet. The record just lives in the database. When you send the invite (next step), a Stripe customer is automatically created using the contact name and email — you don't need to do this manually in Stripe.`,
      },
      {
        heading: "Editing a site later",
        body: `Expand any site row and click Edit to update any field at any time. Changing the tier or add-ons here won't affect an existing Stripe subscription — that still needs to be done in Stripe directly.`,
      },
    ],
  },
  {
    id: "sending-an-invite",
    icon: Send,
    title: "Sending an invite",
    summary: "What happens when you send an invite and what the client experiences.",
    content: [
      {
        heading: "How to send",
        body: `Expand any site row and click **Send Invite to [email]**. The button only appears if the site has a contact email and no linked user account yet.

You can also send from the **Client Invites** section on the main dashboard — useful if you want to send an invite before creating a full site record.`,
      },
      {
        heading: "What happens automatically",
        body: `When you hit Send Invite:
1. A Stripe customer is created for the contact (if one doesn't already exist) and the \`cus_...\` ID is saved to the site record.
2. A branded invite email goes out showing the client their plan, add-ons, build fee, and monthly cost.
3. An invite token is stored in the database (expires in 48 hours).`,
      },
      {
        heading: "What the client sees",
        body: `The email links to a signup page where the client sets their name and password. After creating their account they land on the **setup page**, which shows:
- A summary of what they agreed to (plan, add-ons, build fee)
- A payment form — the build fee is charged immediately and their card is saved for the future monthly subscription
- A "Skip for now" link if they need to come back later

After payment they're taken to their dashboard.`,
      },
      {
        heading: "Re-sending an invite",
        body: `Sending a new invite to the same email resets the token and expiry. The old link stops working. This is useful if a client lost the email or the 48-hour window expired.`,
      },
    ],
  },
  {
    id: "client-portal",
    icon: LayoutDashboard,
    title: "The client portal",
    summary: "What clients see, how to preview it, and how to log activity.",
    content: [
      {
        heading: "Previewing the portal",
        body: `Expand any site row and click **View Portal**. This opens the client dashboard in a new tab using your admin session — no linked user account required. An amber banner at the top reminds you it's a preview.`,
      },
      {
        heading: "What clients see",
        body: `The client portal shows:
- Their site name, domain (clickable), and status (Live / In Progress / etc.)
- Billing section — plan name, monthly cost, subscription status, next billing info
- Payment method — card on file with an "Update" button to change it
- Invoice history — all past invoices with PDF download links
- Activity log — recent work you've logged on their behalf
- Support — a mailto link to hello@lightpatternsonline.com
- Account — their email and a change password link`,
      },
      {
        heading: "Logging activity",
        body: `Expand any site row in the admin. You'll see the **Activity log** panel at the bottom with a text input. Type a short note about what you did — "Renewed SSL certificate", "Updated homepage copy", "Fixed mobile nav bug" — and click Add.

The entry appears immediately in the client's portal under "Recent activity". Use this to show clients they're getting value from the subscription.`,
      },
      {
        heading: "Cancellation",
        body: `Clients can cancel from their portal — there's a "Cancel subscription" link in the billing section. Clicking it sets \`cancel_at_period_end = true\` in Stripe, meaning they keep access until the end of the billing period. After that their site goes offline. The portal shows a red warning when cancellation is pending.`,
      },
    ],
  },
  {
    id: "billing-stripe",
    icon: CreditCard,
    title: "Billing & Stripe",
    summary: "How Stripe connects to the dashboard and what to do when payments fail.",
    content: [
      {
        heading: "How the Stripe customer ID gets linked",
        body: `When you send an invite, a Stripe customer is created automatically and the \`cus_...\` ID is saved to the site record. You can also paste an ID manually in the Edit modal (useful if you created the customer in Stripe first).

The ID looks like \`cus_ABC123xyz\`. You can find it in the Stripe dashboard under Customers.`,
      },
      {
        heading: "Viewing subscription status",
        body: `Expand any site row. If the site has a Stripe customer ID, you'll see a Stripe panel with a **Load** button. Click it to pull live subscription status from Stripe — shows status badge (active / past_due / canceled), plan name, price, and billing anchor date. Click the customer ID to open them directly in the Stripe dashboard.`,
      },
      {
        heading: "Failed payments",
        body: `If a client's card fails, Stripe will retry automatically (usually over 7 days). The subscription status in the Stripe panel will show **past_due**. You'll also see it in the client's portal billing section.

If the card is never fixed, Stripe will eventually cancel the subscription. You'll want to reach out to the client — their portal has an "Update card" button they can use at any time.`,
      },
      {
        heading: "Invoices",
        body: `All invoices are managed in Stripe. The build fee invoice is generated automatically when the client pays on the setup page. Monthly subscription invoices are generated automatically on each billing cycle. Clients can download PDF invoices from their portal.`,
      },
    ],
  },
  {
    id: "starting-subscription",
    icon: Rocket,
    title: "Launching a site & starting the subscription",
    summary: "The steps to take when a site is ready to go live.",
    content: [
      {
        heading: "Update the site record",
        body: `When the site is ready to launch:
1. Expand the site row → click Edit
2. Set **Status** to "Active"
3. Set **Date Published** to today
4. Make sure the **Domain** is filled in — clients see this as a clickable link in their portal

Save the record. The client's portal will immediately show the site as "Live".`,
      },
      {
        heading: "Start the subscription in Stripe",
        body: `The monthly subscription doesn't start automatically — you control when billing begins. To start it:
1. Go to stripe.com → Customers → find the client
2. Click **+ Create subscription**
3. Select the product matching their tier (e.g. "Essential Plan — Monthly Maintenance")
4. Add any add-on products (Advanced SEO, etc.)
5. Set the billing date and click Start subscription

Stripe will charge the card on file immediately and then on that date each month going forward.`,
      },
      {
        heading: "Log a launch activity entry",
        body: `After launch, add an activity log entry so the client sees something on their dashboard right away. Something like: "Your site is live at [domain] 🎉 — hosting, SSL, and uptime monitoring are all active."`,
      },
    ],
  },
  {
    id: "prospect-finder",
    icon: Search,
    title: "Prospect Finder",
    summary: "How to find businesses with no website and add them to your outreach list.",
    content: [
      {
        heading: "Finding businesses",
        body: `Go to **Prospect Finder** from the dashboard. Enter one or more zip codes and a business type, then click Search. Results come from Google Maps via Outscraper and show name, address, phone, rating, and any existing website.

The default filter shows businesses with **no website** — these are your warmest leads since they clearly need what you're selling.`,
      },
      {
        heading: "Filters",
        body: `Use the filter bar to narrow results:
- **Website** — default is "No". Switch to "Yes" if you want to target sites you'd redesign, or "Any" to see everything.
- **Email** — set to "Yes" to only show businesses with a known email address.
- **Reviews / Rating** — higher review counts mean more established businesses. A business with 50+ reviews and no website is a great lead.
- **Type** — if you searched a broad category, this lets you focus on a specific subcategory.`,
      },
      {
        heading: "Adding emails",
        body: `Many businesses won't have an email in the data. Click the pencil icon in the Email column to add one manually. This is worth doing for high-quality leads before saving them to Outreach.`,
      },
      {
        heading: "Saving to Outreach",
        body: `Check the boxes next to businesses you want to track, then click **Save to Outreach**. This stores them in your Outreach list in the database — permanently, across sessions.

The **Add to list** button still works for a quick in-session list if you want to send immediately without saving long-term.`,
      },
      {
        heading: "Converting a prospect to a client",
        body: `Once someone agrees to move forward, go to Sites → Add Site, fill in their details, and send an invite. In the Outreach page, mark that prospect's status as **Converted** so your stats stay accurate.`,
      },
    ],
  },
  {
    id: "outreach",
    icon: MailOpen,
    title: "Outreach",
    summary: "Managing your prospect list, sending emails, and tracking engagement.",
    content: [
      {
        heading: "How prospects get here",
        body: `Prospects are added to the Outreach page in two ways:
- **Save to Outreach** in the Prospect Finder — select rows and click the button
- They're stored in the database so they persist permanently, unlike the in-session list in the Prospect Finder

Once saved, a prospect stays in your list until you remove them manually.`,
      },
      {
        heading: "Sending emails",
        body: `Select one or more prospects using the checkboxes, then click **Send** in the bulk action bar. Only prospects with an email address count toward the send total — the button shows how many will actually receive it.

Emails go out using the same cold outreach template as the Prospect Finder. Each send is recorded, and the prospect's status automatically updates to **Contacted**.`,
      },
      {
        heading: "Email status badges",
        body: `After sending, each prospect shows an email engagement badge that updates automatically via Resend webhooks:
- **Sent** — email left our server
- **Delivered** — accepted by the recipient's mail server
- **Opened** — recipient opened the email (requires open tracking to be enabled in Resend)
- **Clicked** — recipient clicked a link
- **Bounced** — email couldn't be delivered (bad address or full inbox)
- **Complained** — marked as spam

Status only ever upgrades — if someone clicks, it stays "Clicked" even if a late "Delivered" webhook arrives.`,
      },
      {
        heading: "Prospect status",
        body: `Hover over a prospect's status badge to change it. The statuses are:
- **New** — just added, not yet contacted
- **Contacted** — email has been sent (set automatically on send)
- **Replied** — they responded — set this manually when you hear back
- **Converted** — became a client — set this when you create their site record
- **Dead** — not interested or unresponsive after follow-up

These drive your stats. Keeping them accurate makes the open rate, reply rate, and conversion rate at the top meaningful.`,
      },
      {
        heading: "Bulk actions",
        body: `When rows are selected, the action bar appears at the top of the table. You can:
- **Send** to everyone with an email
- **Mark replied / converted / dead** — updates status on all selected at once
- **Remove** — permanently deletes them from the list

Use bulk status updates after a follow-up campaign when you want to write off a batch of non-responders.`,
      },
      {
        heading: "Stats bar",
        body: `The numbers at the top update in real time:
- **Prospects** — total in your list
- **Sent / Delivered** — raw send counts
- **Open Rate** — opens ÷ delivered (not opens ÷ sent, which would be misleadingly low)
- **Click Rate** — clicks ÷ delivered
- **Replied / Converted** — manually tracked counts

A healthy cold email open rate is 30–50%. Below 20% usually means the subject line needs work or you're hitting spam filters.`,
      },
    ],
  },
  {
    id: "referrers",
    icon: Users,
    title: "Referrers",
    summary: "How the referral program works, how to manage referrers, and how payouts are tracked.",
    content: [
      {
        heading: "Inviting a referrer",
        body: `Go to **Referrers** from the nav and click **Invite Referrer**. Fill in their name, email, phone, and commission details — everything except email is optional. The default payout is $500 flat.

When you send the invite, three things happen automatically:
1. A referrer record is created in the database
2. A 7-day invite token is generated and stored
3. A branded email goes out to the referrer explaining the program, their payout amount, and a link to create their account`,
      },
      {
        heading: "Commission types",
        body: `Referrers can be set up on either:
- **Flat ($)** — a fixed dollar amount per converted referral (e.g. $500 per site that goes live)
- **Percentage (%)** — a percentage of the build fee

You set this when inviting or editing a referrer. It's shown in their invite email and on their dashboard.`,
      },
      {
        heading: "Attaching a referrer to a site",
        body: `When creating or editing a site, scroll down to the **Referrer** field in the modal. Use the search box to filter by name or email, then select the referrer from the dropdown.

Attribution happens at site creation — the referrer is linked to the site record, not to a client account. This means you can assign a referrer before the client has even signed up.`,
      },
      {
        heading: "The referrer's account",
        body: `When a referrer clicks the invite link, they land on a signup page where they set their name and password. After creating their account:
- A Stripe customer is created for them automatically
- They're logged into their referrer dashboard at \`/referrer/dashboard\`
- Their session is separate from any client portal session

The referrer dashboard shows their stats (total referrals, sites live, total earned), a list of sites attributed to them, and buttons to refer businesses or invite fellow referrers.`,
      },
      {
        heading: "How referrers send referrals",
        body: `From their dashboard, referrers can click **Refer a Business** and enter the business's name and email. This triggers a warm, personal email from hello@lightpatternsonline.com that mentions the referrer by name — it's not a cold sales email.

If that business becomes a client, you attach the referrer to their site record manually (see above). The referrer's dashboard will then show that site in their referral list.`,
      },
      {
        heading: "Fellow referrer invitations",
        body: `Referrers can also submit a friend to join the program using **Invite a Fellow Referrer** on their dashboard. This does not send the friend an invite automatically — it sends you a notification email at admin@lightpatternsonline.com with **Approve** and **Deny** buttons.

- **Approve** — activates the pending referrer and sends them an invite email immediately
- **Deny** — marks them as denied, no email is sent

If approved, the original referrer earns a one-time **$100 bonus** when their friend gets their first payout. You track and pay this manually — the \`referrer_bonus_paid_at\` field on the referrer record marks when it was settled.`,
      },
      {
        heading: "Managing referrers",
        body: `The Referrers page shows all referrers in a table with name, email, phone, commission, referral code, and status. From the table you can:
- Click the **pencil icon** to edit any referrer's details (name, email, commission, status, notes)
- Click the **trash icon** to delete a referrer — this also removes any invite tokens and unlinks them from any sites
- Set status to **Inactive** to soft-disable a referrer without deleting them

Pending referrers (submitted by a fellow referrer and awaiting your approval) will appear with a **Pending** status badge until you action the notification email.`,
      },
    ],
  },
  {
    id: "billing-payouts",
    icon: Wallet,
    title: "Your Stripe balance & payouts",
    summary: "Checking your account balance and sending money to your bank.",
    content: [
      {
        heading: "Available vs. pending balance",
        body: `Go to **Billing** from the dashboard. The two balance cards show:
- **Available** — money that's cleared and ready to pay out to your bank right now
- **Pending** — payments that have been collected but are still in Stripe's clearing window (typically 2 business days for US cards)

Pending balance moves to available automatically — you don't need to do anything.`,
      },
      {
        heading: "How payouts work by default",
        body: `If you have automatic payouts enabled in Stripe (the default), Stripe sends your available balance to your linked bank account on a set schedule — usually every business day or weekly, depending on what you configured.

You can check your payout schedule in the Stripe dashboard under **Settings → Payouts**.`,
      },
      {
        heading: "Sending a manual payout",
        body: `To send money to your bank immediately (instead of waiting for the automatic schedule), enter an amount in the **Send payout** field and click the button. The payout is created instantly and the estimated arrival date is shown in the confirmation.

The minimum is $1.00. Stripe will reject the request if the amount exceeds your available balance — the error message from Stripe will appear inline.`,
      },
      {
        heading: "Payout history",
        body: `The table at the bottom shows your last 20 payouts with status, created date, estimated arrival, and method (standard or instant). Statuses:
- **Paid** — arrived in your bank
- **In Transit** — on its way, not yet arrived
- **Pending** — created but not yet in motion
- **Failed** — something went wrong (usually a bank account issue — check Stripe for details)`,
      },
      {
        heading: "Bank account setup",
        body: `Payouts always go to the bank account linked in your Stripe account. To change it, go to stripe.com → **Settings → Bank accounts and scheduling**. You can't change the payout destination from this dashboard — that's a Stripe security restriction.`,
      },
    ],
  },
];

export default function GuidePage() {
  const [activeId, setActiveId] = useState(articles[0].id);
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent">("idle");

  const active = articles.find((a) => a.id === activeId)!;
  const Icon = active.icon;

  function handleArticleChange(id: string) {
    setActiveId(id);
    setFeedback("");
    setFeedbackState("idle");
  }

  async function submitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackState("sending");
    await fetch("/api/admin/guide-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ article: active.title, feedback }),
    });
    setFeedbackState("sent");
    setFeedback("");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#f2ede4]">Guide</h1>
        <p className="text-sm text-[#f2ede4]/40 mt-1">How to use the dashboard.</p>
      </div>

      {/* Mobile article selector */}
      <div className="md:hidden mb-4">
        <select
          value={activeId}
          onChange={(e) => handleArticleChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f2ede4] focus:outline-none focus:border-amber-600/50"
        >
          {articles.map(({ id, title }) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar — desktop only */}
        <div className="hidden md:flex w-56 shrink-0 flex-col gap-1">
          {articles.map(({ id, icon: ItemIcon, title }) => (
            <button
              key={id}
              onClick={() => handleArticleChange(id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors w-full ${
                activeId === id
                  ? "bg-amber-600/10 border border-amber-600/20 text-amber-400"
                  : "text-[#f2ede4]/40 hover:text-[#f2ede4] hover:bg-white/[0.03]"
              }`}
            >
              <ItemIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-medium leading-snug">{title}</span>
              {activeId === id && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white/[0.03] border border-white/8 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/10 border border-amber-600/20 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold text-[#f2ede4]">{active.title}</h2>
          </div>
          <p className="text-sm text-[#f2ede4]/40 mb-8 ml-11">{active.summary}</p>

          <div className="flex flex-col gap-8">
            {active.content.map((section) => (
              <div key={section.heading}>
                <h3 className="text-sm font-semibold text-[#f2ede4] mb-3">{section.heading}</h3>
                <div className="text-sm text-[#f2ede4]/60 leading-relaxed space-y-2">
                  {section.body.split("\n").map((line, i) => {
                    if (line.startsWith("- ")) {
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-amber-600/60 mt-1 shrink-0">·</span>
                          <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong class='text-[#f2ede4]/80'>$1</strong>") }} />
                        </div>
                      );
                    }
                    if (line.trim() === "") return null;
                    return (
                      <p key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, "<strong class='text-[#f2ede4]/80'>$1</strong>").replace(/`(.+?)`/g, "<code class='bg-white/8 px-1.5 py-0.5 rounded text-amber-400/80 text-xs font-mono'>$1</code>") }} />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          <div className="mt-10 pt-8 border-t border-white/6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-[#f2ede4]/25" />
              <p className="text-xs text-[#f2ede4]/25 font-medium">Feedback on this article</p>
            </div>
            {feedbackState === "sent" ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                Sent — thanks.
              </div>
            ) : (
              <form onSubmit={submitFeedback} className="flex flex-col gap-3">
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Something unclear, missing, or wrong? Let me know…"
                  className="w-full bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-[#f2ede4] placeholder-white/20 focus:outline-none focus:border-amber-600/40 resize-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!feedback.trim() || feedbackState === "sending"}
                  className="self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-xs text-[#f2ede4]/50 hover:text-[#f2ede4] disabled:opacity-40 transition-colors"
                >
                  {feedbackState === "sending" && <Loader2 className="w-3 h-3 animate-spin" />}
                  Send feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
