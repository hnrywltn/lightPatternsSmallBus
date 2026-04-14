"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbulb, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Suspense } from "react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get("e") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!encoded) {
      setStatus("error");
      return;
    }

    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encoded }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEmail(data.email);
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [encoded]);

  return (
    <div className="min-h-screen bg-[#0c0a07] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <a href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-lg shadow-amber-600/30">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[#f2ede4]">Light Patterns</span>
        </a>

        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <p className="text-sm text-[#f2ede4]/40">Unsubscribing…</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-base font-medium text-[#f2ede4] mb-1">You&apos;re unsubscribed</p>
                {email && (
                  <p className="text-sm text-[#f2ede4]/40">{email}</p>
                )}
              </div>
              <p className="text-xs text-[#f2ede4]/30 leading-relaxed">
                You won&apos;t receive any more emails from us. If this was a mistake, reply to our last email and we&apos;ll add you back.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-base font-medium text-[#f2ede4] mb-1">Something went wrong</p>
                <p className="text-sm text-[#f2ede4]/40">This link may be invalid or expired.</p>
              </div>
              <p className="text-xs text-[#f2ede4]/30">
                To unsubscribe manually, email us at{" "}
                <a href="mailto:hello@lightpatternsonline.com" className="text-amber-500/70 hover:text-amber-400">
                  hello@lightpatternsonline.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeContent />
    </Suspense>
  );
}
