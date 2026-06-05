"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { serviceScopeNotice } from "@/lib/content/service-scope-notice";

export function ServiceScopeNotice() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="service-scope-notice-title"
      aria-modal="true"
      className="fixed inset-0 z-50 grid min-h-dvh place-items-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-md border border-[var(--line)] bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[var(--accent)]">
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 id="service-scope-notice-title" className="text-xl font-bold text-slate-950">
              {serviceScopeNotice.title}
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700 sm:text-base">
              {serviceScopeNotice.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <button
          className="focus-ring mt-6 w-full rounded-md bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)]"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          {serviceScopeNotice.acknowledgementLabel}
        </button>
      </div>
    </div>
  );
}
