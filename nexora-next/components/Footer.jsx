"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Clock, Mail, MapPin, Phone, ShieldCheck, Truck, Undo2, Wallet } from "lucide-react";
import Logo from "@/components/Logo";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const SOCIALS = [
  {
    label: "اینستاگرام نکستورا",
    path: "M12 2.2c-2.7 0-3 .01-4.1.06-1 .05-1.7.22-2.3.46a4.6 4.6 0 0 0-1.7 1.1 4.6 4.6 0 0 0-1.1 1.7c-.24.6-.4 1.3-.46 2.3C2.21 8.9 2.2 9.2 2.2 12s.01 3.1.06 4.1c.05 1 .22 1.7.46 2.3a4.6 4.6 0 0 0 1.1 1.7 4.6 4.6 0 0 0 1.7 1.1c.6.24 1.3.4 2.3.46 1.1.05 1.4.06 4.1.06s3-.01 4.1-.06c1-.05 1.7-.22 2.3-.46a4.9 4.9 0 0 0 2.8-2.8c.24-.6.4-1.3.46-2.3.05-1 .06-1.3.06-4.1s-.01-3.1-.06-4.1c-.05-1-.22-1.7-.46-2.3a4.6 4.6 0 0 0-1.1-1.7 4.6 4.6 0 0 0-1.7-1.1c-.6-.24-1.3-.4-2.3-.46C15 2.21 14.7 2.2 12 2.2Zm0 1.8c2.6 0 2.9.01 3.9.06.9.04 1.4.2 1.8.33.4.17.7.37 1 .68.3.3.5.6.68 1 .13.4.29.9.33 1.8.05 1 .06 1.3.06 3.9s-.01 2.9-.06 3.9c-.04.9-.2 1.4-.33 1.8-.17.4-.37.7-.68 1-.3.3-.6.5-1 .68-.4.13-.9.29-1.8.33-1 .05-1.3.06-3.9.06s-2.9-.01-3.9-.06c-.9-.04-1.4-.2-1.8-.33a2.7 2.7 0 0 1-1-.68 2.7 2.7 0 0 1-.68-1c-.13-.4-.29-.9-.33-1.8-.05-1-.06-1.3-.06-3.9s.01-2.9.06-3.9c.04-.9.2-1.4.33-1.8.17-.4.37-.7.68-1 .3-.3.6-.5 1-.68.4-.13.9-.29 1.8-.33 1-.05 1.3-.06 3.9-.06Zm0 3.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm6.2-8.3a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0Z",
  },
  {
    label: "تلگرام نکستورا",
    path: "M21.9 4.3 18.6 20c-.25 1.1-.9 1.37-1.82.85l-5.03-3.7-2.43 2.34c-.27.27-.5.5-1.02.5l.36-5.15L18 6.4c.4-.36-.09-.56-.62-.2L5.98 13.4l-4.97-1.55c-1.08-.34-1.1-1.08.22-1.6L20.5 2.6c.9-.33 1.68.2 1.4 1.7Z",
  },
  {
    label: "یوتیوب نکستورا",
    path: "M23 12s0-3.4-.43-5.03a3.2 3.2 0 0 0-2.25-2.26C18.7 4.28 12 4.28 12 4.28s-6.7 0-8.32.43A3.2 3.2 0 0 0 1.43 6.97C1 8.6 1 12 1 12s0 3.4.43 5.03a3.2 3.2 0 0 0 2.25 2.26c1.62.43 8.32.43 8.32.43s6.7 0 8.32-.43a3.2 3.2 0 0 0 2.25-2.26C23 15.4 23 12 23 12ZM9.8 15.6V8.4l5.8 3.6-5.8 3.6Z",
  },
];

const SUPPORT = [
  { label: "پیگیری سفارش", href: "/orders" },
  { label: "شرایط بازگشت کالا", href: "/profile" },
  { label: "روش‌های پرداخت", href: "/checkout" },
  { label: "حریم خصوصی", href: "/profile" },
  { label: "سوالات متداول", href: "/products" },
];

const TRUST = [
  { icon: Truck, title: "ارسال سریع", text: "تهران، امروز" },
  { icon: ShieldCheck, title: "ضمانت اصالت", text: "کالای اورجینال" },
  { icon: Undo2, title: "بازگشت ۷ روزه", text: "بدون قید و شرط" },
  { icon: Wallet, title: "پرداخت امن", text: "درگاه معتبر" },
];

export default function Footer() {
  const pathname = usePathname();
  const { subscribe } = useStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  const onSubscribe = (event) => {
    event.preventDefault();
    const result = subscribe(email);
    setMessage(result.ok ? "عضویت شما ثبت شد. ممنون!" : result.message);
    if (result.ok) setEmail("");
  };

  return (
    <footer className="relative mt-16 overflow-hidden bg-ink text-white/70">
      <div className="pointer-events-none absolute -top-32 right-1/4 size-[28rem] rounded-full bg-primary/25 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 left-0 size-[22rem] rounded-full bg-[#38BDF8]/10 blur-[100px]" />

      <div className="shell relative">
        <div className="grid gap-4 border-b border-white/10 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((item) => (
            <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition-colors duration-300 hover:bg-white/[0.07]">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/20 text-[#B7ACFF]">
                <item.icon size={18} />
              </span>
              <span>
                <span className="block text-[0.78rem] font-bold text-white">{item.title}</span>
                <span className="text-[0.68rem] text-white/50">{item.text}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-8 py-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" size="lg" showTagline />
            <p className="mt-4 max-w-sm text-[0.76rem] leading-7 text-white/55">
              نکستورا فروشگاه تخصصی محصولات دیجیتال است؛ از موبایل و لپ‌تاپ تا گیمینگ و لوازم جانبی، با گارانتی اصالت
              کالا و ارسال سریع به سراسر ایران.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  title={social.label}
                  onClick={(event) => event.preventDefault()}
                  className="grid size-9 place-items-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/20 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[0.82rem] font-bold text-white">دسته‌بندی‌ها</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 lg:grid-cols-1">
              {CATEGORIES.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`} className="text-[0.74rem] text-white/55 transition-colors duration-300 hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 text-[0.82rem] font-bold text-white">خدمات مشتریان</h3>
            <ul className="space-y-2">
              {SUPPORT.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[0.74rem] text-white/55 transition-colors duration-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="mb-3 text-[0.82rem] font-bold text-white">خبرنامه نکستورا</h3>
            <p className="text-[0.72rem] leading-6 text-white/55">تخفیف‌ها و محصولات تازه را زودتر از همه دریافت کنید.</p>
            <form onSubmit={onSubscribe} className="mt-3 flex gap-2">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="ایمیل شما"
                aria-label="ایمیل برای خبرنامه"
                className="h-10 w-full rounded-xl border border-white/12 bg-white/[0.06] px-3 text-[0.74rem] text-white outline-none transition-all placeholder:text-white/35 focus:border-primary/60 focus:bg-white/10"
              />
              <button type="submit" aria-label="عضویت در خبرنامه" className="btn btn-primary h-10 !rounded-xl !px-3">
                <ArrowLeft size={16} />
              </button>
            </form>
            {message && <p className="mt-2 text-[0.68rem] text-[#A9F0C3]">{message}</p>}

            <div className="mt-5 space-y-2 text-[0.7rem]">
              <p className="flex items-center gap-2">
                <Phone size={13} className="text-[#9F92FF]" /> ۰۲۱-۹۱۰۰۲۲۳۳
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#9F92FF]" /> support@nexora.ir
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#9F92FF]" /> تهران، خیابان ولیعصر، برج نکستورا
              </p>
              <p className="flex items-center gap-2">
                <Clock size={13} className="text-[#9F92FF]" /> شنبه تا پنجشنبه، ۹ تا ۱۸
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-5 text-[0.68rem] sm:flex-row">
          <p className="text-white/45">© ۱۴۰۵ نکستورا — تمام حقوق محفوظ است. این پروژه نمایشی است و پرداخت واقعی انجام نمی‌شود.</p>
          <div className="flex items-center gap-2">
            {["Zarinpal", "Shaparak", "Samandehi"].map((item) => (
              <span key={item} className="rounded-lg border border-white/12 bg-white/5 px-2 py-1 text-[0.6rem] text-white/50">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
