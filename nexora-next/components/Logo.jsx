"use client";

import Link from "next/link";

/* Brand mark used across header, footer and auth screens. */
export default function Logo({ size = "md", href = "/", tone = "dark", showTagline = false }) {
  const px = { sm: 36, md: 46, lg: 58 }[size] || 46;
  const title = { sm: "text-lg", md: "text-xl", lg: "text-2xl" }[size] || "text-xl";
  const light = tone === "light";

  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 leading-none" aria-label="نکستورا — صفحه اصلی">
      <span
        className="relative grid place-items-center overflow-hidden rounded-[1.05rem] shadow-[0_10px_24px_-14px_rgba(91,69,232,.9)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-3 group-hover:scale-105"
        style={{ width: px, height: px }}
      >
        <svg viewBox="0 0 64 64" width={px} height={px} aria-hidden="true">
          <defs>
            <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7C6BFF" />
              <stop offset=".55" stopColor="#5B45E8" />
              <stop offset="1" stopColor="#3D28C2" />
            </linearGradient>
            <linearGradient id="logoShine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".4" />
              <stop offset=".6" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="18" fill="url(#logoBg)" />
          <rect width="64" height="32" rx="18" fill="url(#logoShine)" />
          <path
            d="M20.5 45.5V18.5L43.5 45.5V18.5"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="49.5" cy="15.5" r="3.4" fill="#fff" />
          <circle cx="49.5" cy="15.5" r="1.5" fill="#5B45E8" />
        </svg>
      </span>
      <span className="flex flex-col">
        <span
          className={`${title} font-extrabold tracking-[0.22em] ${light ? "text-white" : "text-ink"} transition-colors duration-300`}
        >
          NEXORA
        </span>
        {showTagline && (
          <span className={`mt-1 text-[0.62rem] font-medium ${light ? "text-white/70" : "text-muted"}`}>
            فروشگاه تخصصی محصولات دیجیتال
          </span>
        )}
      </span>
    </Link>
  );
}
