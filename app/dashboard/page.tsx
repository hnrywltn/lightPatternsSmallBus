import Link from "next/link";
import { Search, Users, BarChart2, Globe, BookOpen } from "lucide-react";
import InviteClient from "@/components/dashboard/InviteClient";

const tools = [
  {
    icon: Search,
    title: "Prospect Finder",
    description: "Search for businesses with no website, build a list, and send cold outreach.",
    href: "/dashboard/prospects",
    status: "active",
  },
  {
    icon: Globe,
    title: "Sites",
    description: "Track every site you've published — tier, add-ons, status, and billing.",
    href: "/dashboard/sites",
    status: "active",
  },
  {
    icon: Users,
    title: "Contacts",
    description: "Track leads, follow-ups, and client status.",
    href: "/dashboard/contacts",
    status: "coming soon",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description: "Open rates, reply rates, and conversion tracking.",
    href: "/dashboard/analytics",
    status: "coming soon",
  },
  {
    icon: BookOpen,
    title: "Guide",
    description: "How to use the dashboard — clients, billing, Stripe, and more.",
    href: "/dashboard/guide",
    status: "active",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[#f2ede4]">Dashboard</h1>
        <p className="text-sm text-[#f2ede4]/40 mt-1">
          Light Patterns admin tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {tools.map(({ icon: Icon, title, description, href, status }) => {
          const isActive = status === "active";
          const inner = (
            <>
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-600/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-medium text-[#f2ede4] mb-1">{title}</h2>
                <p className="text-xs text-[#f2ede4]/40 leading-relaxed">{description}</p>
              </div>
              {status === "coming soon" && (
                <span className="self-start text-[10px] font-medium uppercase tracking-wider text-amber-600/60 bg-amber-600/10 px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              )}
            </>
          );

          const cls = `relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 flex flex-col gap-4 transition-colors ${
            isActive ? "hover:bg-white/[0.05] hover:border-white/12 cursor-pointer" : ""
          }`;

          return isActive ? (
            <Link key={title} href={href} className={cls}>
              {inner}
            </Link>
          ) : (
            <div key={title} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>

      <InviteClient />
    </div>
  );
}
