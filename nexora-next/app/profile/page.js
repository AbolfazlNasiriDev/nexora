"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, LayoutDashboard, LogOut, MapPin, Package, Pencil, Save, Scale, ShieldCheck, ShoppingBag, User } from "lucide-react";
import { ORDER_STATUS, faDate, priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const { user, orders, wishlist, compare, cartCount, updateProfile, logout, ready } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", address: "", postalCode: "" });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        address: user.address || "",
        postalCode: user.postalCode || "",
      });
    }
  }, [user]);

  if (!ready) return <div className="shell py-16 text-center text-[0.8rem] text-muted">در حال بارگذاری حساب…</div>;

  if (!user) {
    return (
      <div className="shell py-16">
        <div className="nx-card mx-auto max-w-md px-5 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <User size={24} />
          </span>
          <p className="mt-3 text-[0.95rem] font-bold text-ink">برای دیدن پروفایل وارد شوید</p>
          <p className="mt-1 text-[0.74rem] leading-6 text-muted">با حساب نمونه هم می‌توانید وارد شوید.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/login" className="btn btn-primary !text-[0.74rem]">
              ورود
            </Link>
            <Link href="/register" className="btn btn-ghost !text-[0.74rem]">
              ثبت‌نام
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((order) => order.userId === user.id);
  const totalSpent = myOrders.reduce((sum, order) => sum + order.total, 0);
  const stats = [
    { icon: Package, label: "سفارش‌ها", value: toman(myOrders.length), tone: "bg-primary-soft text-primary" },
    { icon: ShoppingBag, label: "سبد خرید", value: toman(cartCount), tone: "bg-sky-50 text-sky-600" },
    { icon: Heart, label: "علاقه‌مندی", value: toman(wishlist.length), tone: "bg-rose-50 text-sale" },
    { icon: Scale, label: "مقایسه", value: toman(compare.length), tone: "bg-emerald-50 text-success" },
  ];

  return (
    <div className="shell py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-[linear-gradient(135deg,#7C6BFF,#4A34D6)] text-[1.1rem] font-extrabold text-white shadow-[0_10px_24px_-14px_rgba(91,69,232,.9)]">
            {user.name.slice(0, 1)}
          </span>
          <div>
            <h1 className="text-[1.2rem] font-extrabold text-ink">{user.name}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[0.7rem] text-muted">
              {user.email}
              {user.role === "admin" && <span className="chip bg-primary-soft text-primary">مدیر</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {user.role === "admin" && (
            <Link href="/admin" className="btn btn-dark !text-[0.74rem]">
              <LayoutDashboard size={15} />
              پنل مدیریت
            </Link>
          )}
          <button type="button" onClick={logout} className="btn btn-ghost !text-[0.74rem] text-sale">
            <LogOut size={15} />
            خروج
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="nx-card nx-card-hover flex items-center gap-3 p-3.5">
            <span className={`grid size-10 place-items-center rounded-xl ${stat.tone}`}>
              <stat.icon size={18} />
            </span>
            <div>
              <p className="text-[1rem] font-extrabold text-ink">{stat.value}</p>
              <p className="text-[0.66rem] text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-4">
          <section className="nx-card p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <User size={16} className="text-primary" /> اطلاعات حساب
              </p>
              <button
                type="button"
                onClick={() => setEditing((value) => !value)}
                className="flex items-center gap-1 rounded-xl border border-line px-2.5 py-1.5 text-[0.68rem] font-semibold text-ink transition-colors hover:border-primary/35 hover:text-primary"
              >
                {editing ? <ArrowLeft size={13} /> : <Pencil size={13} />}
                {editing ? "بستن" : "ویرایش"}
              </button>
            </div>

            {editing ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  updateProfile(form);
                  setEditing(false);
                }}
                className="mt-3 grid gap-3 sm:grid-cols-2"
              >
                {[
                  { key: "name", label: "نام و نام خانوادگی" },
                  { key: "email", label: "ایمیل", dir: "ltr" },
                  { key: "phone", label: "موبایل" },
                  { key: "city", label: "شهر" },
                  { key: "postalCode", label: "کد پستی" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="nx-label" htmlFor={`pf-${field.key}`}>
                      {field.label}
                    </label>
                    <input
                      id={`pf-${field.key}`}
                      dir={field.dir}
                      value={form[field.key]}
                      onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                      className={`nx-input !py-2 !text-[0.78rem] ${field.dir ? "text-left" : ""}`}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="nx-label" htmlFor="pf-address">
                    نشانی
                  </label>
                  <textarea
                    id="pf-address"
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    rows={2}
                    className="nx-input !py-2 !text-[0.78rem]"
                  />
                </div>
                <button type="submit" className="btn btn-primary sm:col-span-2">
                  <Save size={15} />
                  ذخیره تغییرات
                </button>
              </form>
            ) : (
              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  ["نام", user.name],
                  ["ایمیل", user.email],
                  ["موبایل", user.phone || "—"],
                  ["شهر", user.city || "—"],
                  ["کد پستی", user.postalCode || "—"],
                  ["نشانی", user.address || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-line bg-[#fbfbfe] px-3 py-2">
                    <dt className="text-[0.62rem] text-muted">{label}</dt>
                    <dd className="mt-0.5 text-[0.74rem] font-semibold text-ink" dir={label === "ایمیل" ? "ltr" : undefined}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          <section className="nx-card p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <Package size={16} className="text-primary" /> آخرین سفارش‌ها
              </p>
              <Link href="/orders" className="text-[0.7rem] font-semibold text-primary hover:underline">
                همه سفارش‌ها
              </Link>
            </div>
            {myOrders.length ? (
              <ul className="mt-3 divide-y divide-line">
                {myOrders.slice(0, 3).map((order) => {
                  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                  return (
                    <li key={order.id} className="flex items-center justify-between gap-2 py-2.5">
                      <div>
                        <p className="text-[0.74rem] font-bold text-ink">{order.code}</p>
                        <p className="mt-0.5 text-[0.64rem] text-muted">
                          {faDate(order.createdAt)} · {toman(order.items.length)} کالا
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-[0.74rem] font-bold text-ink">{priceLabel(order.total)}</p>
                        <span className={`chip mt-1 border text-[0.6rem] ${status.tone}`}>{status.label}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-3 rounded-xl bg-page px-3 py-6 text-center text-[0.72rem] text-muted">
                هنوز سفارشی ثبت نکرده‌اید.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-3">
          <div className="nx-card p-4">
            <p className="flex items-center gap-1.5 text-[0.82rem] font-bold text-ink">
              <MapPin size={15} className="text-primary" /> آدرس پیش‌فرض
            </p>
            <p className="mt-2 text-[0.72rem] leading-7 text-[#4b5065]">
              {user.city}
              <br />
              {user.address || "آدرسی ثبت نشده است"}
              {user.postalCode ? ` — کد پستی ${user.postalCode}` : ""}
            </p>
          </div>

          <div className="nx-card p-4">
            <p className="text-[0.82rem] font-bold text-ink">خلاصه فعالیت</p>
            <dl className="mt-2 space-y-1.5 text-[0.72rem]">
              <div className="flex justify-between">
                <dt className="text-muted">مجموع خرید</dt>
                <dd className="font-bold text-ink">{priceLabel(totalSpent)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">تعداد سفارش</dt>
                <dd className="font-bold text-ink">{toman(myOrders.length)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">کد تخفیف خوش‌آمد</dt>
                <dd className="font-bold text-primary">WELCOME</dd>
              </div>
            </dl>
          </div>

          <Link href="/products" className="btn btn-soft w-full">
            <ShieldCheck size={15} />
            خرید با گارانتی نکستورا
          </Link>
        </aside>
      </div>
    </div>
  );
}
