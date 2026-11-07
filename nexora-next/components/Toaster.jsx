"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";

const TONES = {
  success: { icon: CheckCircle2, ring: "#16A34A", bg: "bg-emerald-50", text: "text-emerald-700" },
  error: { icon: XCircle, ring: "#EF4444", bg: "bg-rose-50", text: "text-rose-700" },
  info: { icon: Info, ring: "#5B45E8", bg: "bg-[#F0EDFF]", text: "text-[#4A34D6]" },
};

export default function Toaster() {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="pointer-events-none fixed bottom-24 left-4 z-[130] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 lg:bottom-6">
      {toasts.map((toast) => {
        const tone = TONES[toast.type] || TONES.info;
        const Icon = tone.icon;
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_18px_40px_-20px_rgba(21,23,43,.45)] backdrop-blur animate-pop"
          >
            <span className={`grid size-8 shrink-0 place-items-center rounded-xl ${tone.bg} ${tone.text}`}>
              <Icon size={17} />
            </span>
            <p className="flex-1 pt-1 text-[0.78rem] font-medium leading-6 text-ink">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="grid size-7 place-items-center rounded-lg text-muted transition-colors hover:bg-page hover:text-ink"
              aria-label="بستن پیام"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
