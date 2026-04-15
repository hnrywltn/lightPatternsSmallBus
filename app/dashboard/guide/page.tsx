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
    summary: "How to find businesses, build outreach lists, and send cold emails.",
    content: [
      {
        heading: "Finding businesses",
        body: `Go to **Prospect Finder** from the dashboard. Enter a business type and location (e.g. "plumber, Oakland CA") and click Search. The tool pulls businesses from Google Maps data via Outscraper and filters for ones without websites — your ideal prospects.`,
      },
      {
        heading: "Building a list",
        body: `Check the boxes next to businesses you want to target and click **Add to audience**. This adds them to your Resend outreach audience so you can send emails to them.

Use the filters to narrow results — no-website businesses are highlighted since they're the warmest leads.`,
      },
      {
        heading: "Sending outreach",
        body: `After building a list, click **Send campaign** to send a cold outreach email to the selected businesses. The email is a professionally written intro explaining what Light Patterns does and why having a website matters for their business.

Monitor open rates and replies in Resend (resend.com → Broadcasts). Follow up manually with anyone who opens but doesn't reply.`,
      },
      {
        heading: "Converting a prospect to a client",
        body: `Once a prospect agrees to move forward, go to Sites → Add Site, fill in their details, and send an invite. That kicks off the full onboarding flow.`,
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

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="w-56 shrink-0 flex flex-col gap-1">
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
        <div className="flex-1 min-w-0 bg-white/[0.03] border border-white/8 rounded-2xl p-8">
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
