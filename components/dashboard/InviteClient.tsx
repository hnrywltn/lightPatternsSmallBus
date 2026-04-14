"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";

interface Invite {
  email: string;
  accepted_at: string | null;
  expires_at: string;
  created_at: string;
}

export default function InviteClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);

  useEffect(() => {
    fetchInvites();
  }, []);

  async function fetchInvites() {
    const res = await fetch("/api/admin/invites");
    if (res.ok) {
      const data = await res.json();
      setInvites(data.invites);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const res = await fetch("/api/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    let data: { error?: string } = {};
    try {
      data = await res.json();
    } catch {
      // empty or non-JSON response
    }

    if (!res.ok) {
      setStatus("error");
      setErrorMsg(data.error ?? "Something went wrong. Is DATABASE_URL configured?");
      return;
    }

    setStatus("sent");
    setEmail("");
    fetchInvites();
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#f2ede4]">Invite a Client</h2>
        <p className="text-sm text-[#f2ede4]/40 mt-1">
          Send an invite email. They'll set their own password and get access to their client portal.
        </p>
      </div>

      <form onSubmit={handleInvite} className="flex gap-3 mb-8 max-w-md">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          placeholder="client@email.com"
          className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-[#f2ede4] placeholder:text-[#f2ede4]/20 focus:outline-none focus:border-amber-500/50"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent!" : "Send Invite"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-red-400 text-sm mb-6">{errorMsg}</p>
      )}

      {invites.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#f2ede4]/60 mb-3">Sent invites</h3>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#f2ede4]/30 uppercase tracking-wider">Sent</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.email} className="border-b border-white/5 last:border-none">
                    <td className="px-5 py-3 text-[#f2ede4]/70">{invite.email}</td>
                    <td className="px-5 py-3">
                      {invite.accepted_at ? (
                        <span className="text-xs font-medium bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">Accepted</span>
                      ) : new Date(invite.expires_at) < new Date() ? (
                        <span className="text-xs font-medium bg-white/8 text-[#f2ede4]/30 px-2 py-0.5 rounded-full">Expired</span>
                      ) : (
                        <span className="text-xs font-medium bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[#f2ede4]/30">
                      {new Date(invite.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
