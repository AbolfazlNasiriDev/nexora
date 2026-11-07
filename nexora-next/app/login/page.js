"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, KeyRound, LogIn, Mail, ShieldCheck, User } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, logout } = useStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      setError("ایمیل معتبر نیست");
      return;
    }
    if (form.password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }
    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    router.push(result.user.role === "admin" ? "/admin" : "/profile");
  };

  const fill = (email, password) => {
    setForm({ email, password });
    setError("");
  };

  return (
    <AuthShell
      title="ورود به حساب کاربری"
      subtitle="برای مشاهده سفارش‌ها و علاقه‌مندی‌ها وارد شوید."
      footer={
        <p className="mt-4 text-center text-[0.74rem] text-muted">
          حساب ندارید؟{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>
      }
    >
      {user ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <ShieldCheck size={22} className="mx-auto text-emerald-600" />
          <p className="mt-2 text-[0.8rem] font-bold text-emerald-800">شما وارد شده‌اید</p>
          <p className="mt-1 text-[0.7rem] text-emerald-700">{user.name}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href="/profile" className="btn btn-primary !py-2 !text-[0.72rem]">
              پروفایل
            </Link>
            <button type="button" onClick={logout} className="btn btn-ghost !py-2 !text-[0.72rem]">
              خروج
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="nx-label" htmlFor="login-email">
              ایمیل
            </label>
            <div className="relative">
              <Mail size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-email"
                type="email"
                dir="ltr"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="you@example.com"
                className="nx-input !pr-9 text-left"
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="nx-label" htmlFor="login-password">
              رمز عبور
            </label>
            <div className="relative">
              <KeyRound size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="login-password"
                type={show ? "text" : "password"}
                dir="ltr"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
                className="nx-input !pr-9 !pl-10 text-left"
                autoComplete="current-password"
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
          </div>

          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[0.7rem] text-sale">{error}</p>}

          <button type="submit" className="btn btn-primary w-full !py-2.5">
            <LogIn size={16} />
            ورود به حساب
          </button>

          <div className="rounded-2xl border border-dashed border-line bg-[#fbfbfe] p-2.5">
            <p className="mb-1.5 text-[0.66rem] font-semibold text-muted">ورود سریع با حساب نمونه:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fill("demo@nexora.ir", "Demo@1234")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-2 py-1.5 text-[0.66rem] font-semibold text-ink transition-colors hover:border-primary/35 hover:text-primary"
              >
                <User size={13} /> کاربر نمونه
              </button>
              <button
                type="button"
                onClick={() => fill("admin@nexora.ir", "Admin@1234")}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-2 py-1.5 text-[0.66rem] font-semibold text-ink transition-colors hover:border-primary/35 hover:text-primary"
              >
                <ShieldCheck size={13} /> مدیر فروشگاه
              </button>
            </div>
          </div>

          <Link href="/products" className="flex items-center justify-center gap-1 text-[0.7rem] text-muted transition-colors hover:text-primary">
            <ArrowLeft size={13} />
            ادامه خرید بدون ورود
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
