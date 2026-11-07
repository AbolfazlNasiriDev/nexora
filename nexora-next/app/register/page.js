"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, EyeOff, Mail, Phone, User, UserPlus } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { toman } from "@/lib/format";
import { useStore } from "@/lib/store";

const strengthOf = (password) => {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 25;
  if (/\d/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  return score;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useStore();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const strength = strengthOf(form.password);
  const tone =
    strength >= 75 ? "bg-success" : strength >= 50 ? "bg-amber-400" : strength > 0 ? "bg-sale" : "bg-line";
  const label = strength >= 75 ? "قوی" : strength >= 50 ? "متوسط" : strength > 0 ? "ضعیف" : "—";

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 3) next.name = "نام و نام خانوادگی را کامل وارد کنید";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = "ایمیل معتبر نیست";
    if (!/^09\d{9}$/.test(form.phone.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) next.phone = "شماره موبایل ۱۱ رقمی معتبر وارد کنید";
    if (form.password.length < 8) next.password = "رمز عبور حداقل ۸ کاراکتر باشد";
    if (form.password !== form.confirm) next.confirm = "تکرار رمز با رمز عبور یکسان نیست";
    if (!form.terms) next.terms = "پذیرش قوانین الزامی است";
    setErrors(next);
    if (Object.keys(next).length) return;

    const result = register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone,
      password: form.password,
    });
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    router.push("/profile");
  };

  return (
    <AuthShell
      title="ساخت حساب جدید"
      subtitle="در چند ثانیه عضو شوید و ۵۰۰ هزار تومان هدیه خوش‌آمدگویی بگیرید."
      footer={
        <p className="mt-4 text-center text-[0.74rem] text-muted">
          حساب دارید؟{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            وارد شوید
          </Link>
        </p>
      }
    >
      {user ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <Check size={22} className="mx-auto text-emerald-600" />
          <p className="mt-2 text-[0.8rem] font-bold text-emerald-800">شما وارد شده‌اید</p>
          <p className="mt-1 text-[0.7rem] text-emerald-700">{user.email}</p>
          <Link href="/profile" className="btn btn-primary mt-3 w-full !py-2 !text-[0.72rem]">
            رفتن به پروفایل
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="nx-label" htmlFor="reg-name">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <User size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="reg-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="مثلاً سارا محمدی"
                className={`nx-input !pr-9 ${errors.name ? "!border-sale" : ""}`}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="mt-1 text-[0.64rem] text-sale">{errors.name}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="nx-label" htmlFor="reg-phone">
                موبایل
              </label>
              <div className="relative">
                <Phone size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="reg-phone"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="۰۹۱۲…"
                  inputMode="tel"
                  className={`nx-input !pr-9 ${errors.phone ? "!border-sale" : ""}`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <p className="mt-1 text-[0.64rem] text-sale">{errors.phone}</p>}
            </div>
            <div>
              <label className="nx-label" htmlFor="reg-email">
                ایمیل
              </label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="reg-email"
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  className={`nx-input !pr-9 text-left ${errors.email ? "!border-sale" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-[0.64rem] text-sale">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="nx-label" htmlFor="reg-password">
              رمز عبور
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={show ? "text" : "password"}
                dir="ltr"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="حداقل ۸ کاراکتر"
                className={`nx-input !pl-10 text-left ${errors.password ? "!border-sale" : ""}`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShow((value) => !value)}
                className="absolute left-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-primary"
                aria-label={show ? "پنهان کردن رمز" : "نمایش رمز"}
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {form.password && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-page">
                  <div className={`h-full rounded-full transition-all duration-500 ${tone}`} style={{ width: `${strength}%` }} />
                </div>
                <span className="text-[0.62rem] font-semibold text-muted">
                  {label} · {toman(strength)}٪
                </span>
              </div>
            )}
            {errors.password && <p className="mt-1 text-[0.64rem] text-sale">{errors.password}</p>}
          </div>

          <div>
            <label className="nx-label" htmlFor="reg-confirm">
              تکرار رمز عبور
            </label>
            <input
              id="reg-confirm"
              type={show ? "text" : "password"}
              dir="ltr"
              value={form.confirm}
              onChange={(event) => setForm((current) => ({ ...current, confirm: event.target.value }))}
              placeholder="••••••••"
              className={`nx-input text-left ${errors.confirm ? "!border-sale" : ""}`}
              autoComplete="new-password"
            />
            {errors.confirm && <p className="mt-1 text-[0.64rem] text-sale">{errors.confirm}</p>}
          </div>

          <label className="flex items-start gap-2 text-[0.7rem] leading-6 text-[#4b5065]">
            <input
              type="checkbox"
              className="nx-check mt-1"
              checked={form.terms}
              onChange={(event) => setForm((current) => ({ ...current, terms: event.target.checked }))}
            />
            <span>
              قوانین استفاده و سیاست حریم خصوصی نکستورا را می‌پذیرم.{" "}
              <span className="text-muted">(این ثبت‌نام نمایشی است)</span>
            </span>
          </label>
          {errors.terms && <p className="text-[0.64rem] text-sale">{errors.terms}</p>}

          <button type="submit" className="btn btn-primary w-full !py-2.5">
            <UserPlus size={16} />
            ساخت حساب
          </button>

          <Link href="/login" className="flex items-center justify-center gap-1 text-[0.7rem] text-muted transition-colors hover:text-primary">
            <ArrowLeft size={13} />
            حساب دارم، وارد می‌شوم
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
