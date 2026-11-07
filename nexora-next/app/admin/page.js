"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, Boxes, Check, LayoutDashboard, LogOut, Package, Pencil, Plus, Search, ShieldCheck, ShoppingBag, Trash2, Users, X } from "lucide-react";
import Logo from "@/components/Logo";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/catalog";
import { NXArt } from "@/lib/art";
import { ORDER_STATUS, faDate, priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

const TABS = [
  { id: "overview", label: "نمای کلی", icon: BarChart3 },
  { id: "products", label: "محصولات", icon: Boxes },
  { id: "orders", label: "سفارش‌ها", icon: Package },
  { id: "users", label: "کاربران", icon: Users },
];

const emptyDraft = () => ({
  id: "",
  name: "",
  brand: "",
  cat: "mobile",
  sub: "",
  price: "",
  old: "",
  stock: "10",
});

function LoginGate() {
  const { login } = useStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    if (result.user.role !== "admin") {
      setError("این حساب دسترسی مدیریت ندارد");
      return;
    }
    setError("");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[linear-gradient(140deg,#15172B_0%,#221A52_45%,#3D28C2_100%)] p-4">
      <div className="w-full max-w-sm rounded-[1.6rem] border border-white/10 bg-white p-5 shadow-2xl animate-pop">
        <div className="flex items-center justify-between">
          <Logo size="sm" />
          <span className="chip bg-primary-soft text-primary">
            <ShieldCheck size={12} /> پنل مدیریت
          </span>
        </div>
        <h1 className="mt-4 text-[1.05rem] font-extrabold text-ink">ورود مدیر فروشگاه</h1>
        <p className="mt-1 text-[0.72rem] leading-6 text-muted">این بخش نمایشی است و دسترسی فقط برای حساب مدیر فعال می‌شود.</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <label className="nx-label" htmlFor="admin-email">
              ایمیل مدیر
            </label>
            <input
              id="admin-email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              dir="ltr"
              type="email"
              placeholder="admin@nexora.ir"
              className="nx-input text-left !text-[0.78rem]"
            />
          </div>
          <div>
            <label className="nx-label" htmlFor="admin-password">
              رمز عبور
            </label>
            <input
              id="admin-password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              dir="ltr"
              type="password"
              placeholder="Admin@1234"
              className="nx-input text-left !text-[0.78rem]"
            />
          </div>
          {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-[0.7rem] text-sale">{error}</p>}
          <button
            type="button"
            onClick={() => setForm({ email: "admin@nexora.ir", password: "Admin@1234" })}
            className="w-full rounded-xl border border-dashed border-line px-3 py-2 text-[0.68rem] text-muted transition-colors hover:border-primary/40 hover:text-primary"
          >
            پر کردن خودکار حساب مدیر نمایشی
          </button>
          <button type="submit" className="btn btn-primary w-full">
            ورود به پنل
            <ArrowLeft size={15} />
          </button>
        </form>
        <Link href="/" className="mt-3 flex items-center justify-center gap-1 text-[0.7rem] text-muted transition-colors hover:text-primary">
          بازگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}

function ProductForm({ draft, setDraft, onSave, onClose }) {
  const category = CATEGORY_MAP[draft.cat];
  const subs = category?.subs || [];

  return (
    <div className="fixed inset-0 z-[130] grid place-items-center p-4">
      <button type="button" aria-label="بستن" onClick={onClose} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <form
        onSubmit={onSave}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-white p-4 shadow-2xl animate-pop"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[0.9rem] font-bold text-ink">{draft.id ? "ویرایش محصول" : "افزودن محصول جدید"}</p>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-xl border border-line" aria-label="بستن">
            <X size={15} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="nx-label" htmlFor="ap-name">
              نام محصول
            </label>
            <input id="ap-name" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="nx-input !text-[0.78rem]" placeholder="مثلاً گوشی موبایل سامسونگ Galaxy S26" />
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-brand">
              برند
            </label>
            <input id="ap-brand" required value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} className="nx-input !text-[0.78rem]" placeholder="Samsung" />
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-cat">
              دسته‌بندی
            </label>
            <select
              id="ap-cat"
              value={draft.cat}
              onChange={(event) => setDraft({ ...draft, cat: event.target.value, sub: "" })}
              className="nx-input !text-[0.78rem]"
            >
              {CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-sub">
              زیردسته
            </label>
            <select id="ap-sub" value={draft.sub} onChange={(event) => setDraft({ ...draft, sub: event.target.value })} className="nx-input !text-[0.78rem]">
              <option value="">— بدون زیردسته —</option>
              {subs.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-price">
              قیمت (تومان)
            </label>
            <input id="ap-price" required inputMode="numeric" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className="nx-input !text-[0.78rem]" placeholder="35000000" />
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-old">
              قیمت قبل از تخفیف
            </label>
            <input id="ap-old" inputMode="numeric" value={draft.old} onChange={(event) => setDraft({ ...draft, old: event.target.value })} className="nx-input !text-[0.78rem]" placeholder="40000000" />
          </div>
          <div>
            <label className="nx-label" htmlFor="ap-stock">
              موجودی انبار
            </label>
            <input id="ap-stock" inputMode="numeric" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: event.target.value })} className="nx-input !text-[0.78rem]" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            انصراف
          </button>
          <button type="submit" className="btn btn-primary">
            <Check size={15} />
            ذخیره محصول
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const { user, logout, products, orders, users, saveProduct, deleteProduct, setOrderStatus, ready, toast } = useStore();
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(null);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return [
      { label: "محصولات", value: toman(products.length), icon: Boxes, tone: "bg-primary-soft text-primary" },
      { label: "سفارش‌ها", value: toman(orders.length), icon: ShoppingBag, tone: "bg-sky-50 text-sky-600" },
      { label: "فروش کل", value: priceLabel(revenue), icon: BarChart3, tone: "bg-emerald-50 text-success" },
      { label: "کاربران", value: toman(users.length), icon: Users, tone: "bg-amber-50 text-amber-600" },
    ];
  }, [orders, products.length, users.length]);

  if (!ready) return <div className="grid min-h-screen place-items-center text-[0.85rem] text-muted">در حال آماده‌سازی پنل…</div>;
  if (!user || user.role !== "admin") return <LoginGate />;

  const filtered = products.filter((product) =>
    [product.name, product.brand, product.catName].join(" ").toLowerCase().includes(search.trim().toLowerCase())
  );

  const openNew = () => setDraft(emptyDraft());
  const openEdit = (product) =>
    setDraft({
      id: product.id,
      name: product.name,
      brand: product.brand,
      cat: product.cat,
      sub: product.sub || "",
      price: String(product.price),
      old: String(product.old || product.oldPrice || ""),
      stock: String(product.stock ?? 0),
    });

  const submitDraft = (event) => {
    event.preventDefault();
    const price = Number(String(draft.price).replace(/[^\d]/g, ""));
    const old = Number(String(draft.old).replace(/[^\d]/g, "")) || 0;
    const stock = Number(String(draft.stock).replace(/[^\d]/g, "")) || 0;
    if (!draft.name.trim() || !draft.brand.trim() || price <= 0) {
      toast("نام، برند و قیمت معتبر الزامی است", "error");
      return;
    }
    const category = CATEGORY_MAP[draft.cat];
    const sub = category?.subs.find((item) => item.id === draft.sub);
    const existing = products.find((product) => product.id === draft.id);
    const payload = {
      ...(existing || {}),
      id: draft.id || `custom-${Date.now()}`,
      __new: !existing,
      name: draft.name.trim(),
      brand: draft.brand.trim(),
      cat: draft.cat,
      catName: category?.name || "",
      sub: draft.sub,
      subName: sub?.name || category?.name || "",
      price,
      old,
      oldPrice: old,
      stock,
      rating: existing?.rating || 4.5,
      reviews: existing?.reviews || 0,
      art: existing?.art || (draft.cat === "mobile" ? "phone" : draft.cat === "laptop" ? "laptop" : "generic"),
      accent: existing?.accent || category?.color || "#5B45E8",
      colors: existing?.colors || ["black"],
      features: existing?.features || [],
      filters: existing?.filters || {},
      specs: existing?.specs || { برند: draft.brand.trim(), دسته‌بندی: category?.name || "" },
      desc: existing?.desc || "این محصول از طریق پنل مدیریت نکستورا اضافه شده است.",
      sku: existing?.sku || `NX-${Math.floor(1000 + Math.random() * 8999)}`,
      searchText: [draft.name, draft.brand, category?.name].join(" ").toLowerCase(),
      isSample: true,
    };
    saveProduct(payload);
    setDraft(null);
  };

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="shell flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Logo size="sm" href="/admin" />
            <span className="chip bg-primary-soft text-primary">
              <LayoutDashboard size={12} /> مدیریت فروشگاه
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn btn-ghost !py-1.5 !text-[0.7rem]">
              مشاهده فروشگاه
            </Link>
            <button type="button" onClick={logout} className="btn btn-ghost !py-1.5 !text-[0.7rem] text-sale">
              <LogOut size={14} /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className="shell grid gap-4 py-5 lg:grid-cols-[15rem_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-white p-2 lg:sticky lg:top-4">
          <div className="mb-2 rounded-xl bg-[#fbfbfe] px-2.5 py-2">
            <p className="text-[0.74rem] font-bold text-ink">{user.name}</p>
            <p className="text-[0.62rem] text-muted">{user.email}</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto no-scrollbar lg:flex-col">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-2.5 py-2 text-[0.74rem] font-semibold transition-colors duration-300 ${
                  tab === item.id ? "bg-primary-soft text-primary" : "text-[#4b5065] hover:bg-page"
                }`}
              >
                <item.icon size={15} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 space-y-4">
          {tab === "overview" && (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="nx-card flex items-center gap-3 p-3.5">
                    <span className={`grid size-10 place-items-center rounded-xl ${stat.tone}`}>
                      <stat.icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[0.9rem] font-extrabold text-ink">{stat.value}</p>
                      <p className="text-[0.64rem] text-muted">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 xl:grid-cols-2">
                <section className="nx-card p-4">
                  <p className="mb-2 text-[0.82rem] font-bold text-ink">سفارش‌های اخیر</p>
                  {orders.length ? (
                    <ul className="divide-y divide-line">
                      {orders.slice(0, 5).map((order) => {
                        const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
                        return (
                          <li key={order.id} className="flex items-center justify-between gap-2 py-2 text-[0.7rem]">
                            <div>
                              <p className="font-bold text-ink">{order.code}</p>
                              <p className="text-[0.62rem] text-muted">{faDate(order.createdAt)}</p>
                            </div>
                            <span className="font-semibold text-ink">{priceLabel(order.total)}</span>
                            <span className={`chip border text-[0.58rem] ${status.tone}`}>{status.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="rounded-xl bg-page px-3 py-6 text-center text-[0.7rem] text-muted">هنوز سفارشی ثبت نشده است.</p>
                  )}
                </section>

                <section className="nx-card p-4">
                  <p className="mb-2 text-[0.82rem] font-bold text-ink">کم‌موجودها</p>
                  <ul className="divide-y divide-line">
                    {[...products]
                      .sort((a, b) => a.stock - b.stock)
                      .slice(0, 5)
                      .map((product) => (
                        <li key={product.id} className="flex items-center justify-between gap-2 py-1.5 text-[0.7rem]">
                          <span className="line-clamp-1 text-ink">{product.name}</span>
                          <span className={`chip ${product.stock < 6 ? "bg-rose-50 text-sale" : "bg-emerald-50 text-success"}`}>
                            {toman(product.stock)} عدد
                          </span>
                        </li>
                      ))}
                  </ul>
                </section>
              </div>
            </>
          )}

          {tab === "products" && (
            <section className="nx-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-3">
                <div className="relative w-full max-w-xs">
                  <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجوی محصول…" className="nx-input !py-1.5 !pr-8 !text-[0.72rem]" />
                </div>
                <button type="button" onClick={openNew} className="btn btn-primary !py-1.5 !text-[0.72rem]">
                  <Plus size={14} /> افزودن محصول
                </button>
              </div>
              <div className="overflow-x-auto scroll-thin">
                <table className="w-full min-w-[38rem] text-[0.7rem]">
                  <thead>
                    <tr className="bg-[#fbfbfe] text-muted">
                      <th className="px-3 py-2 text-right font-semibold">محصول</th>
                      <th className="px-3 py-2 font-semibold">دسته</th>
                      <th className="px-3 py-2 font-semibold">قیمت</th>
                      <th className="px-3 py-2 font-semibold">موجودی</th>
                      <th className="px-3 py-2 font-semibold">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 40).map((product) => (
                      <tr key={product.id} className="border-t border-line">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="size-9 shrink-0 overflow-hidden rounded-lg bg-page">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={NXArt.product(product)} alt="" className="size-full object-contain" />
                            </span>
                            <span className="line-clamp-1 max-w-[16rem] font-medium text-ink">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center text-muted">{product.catName}</td>
                        <td className="px-3 py-2 text-center font-semibold text-ink">{toman(product.price)}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`chip ${product.stock < 6 ? "bg-rose-50 text-sale" : "bg-emerald-50 text-success"}`}>
                            {toman(product.stock)}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" onClick={() => openEdit(product)} className="grid size-7 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-primary" aria-label="ویرایش">
                              <Pencil size={12} />
                            </button>
                            <button type="button" onClick={() => deleteProduct(product.id)} className="grid size-7 place-items-center rounded-lg border border-line text-muted transition-colors hover:text-sale" aria-label="حذف">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "orders" && (
            <section className="nx-card overflow-hidden">
              <p className="border-b border-line px-4 py-3 text-[0.82rem] font-bold text-ink">مدیریت سفارش‌ها</p>
              {orders.length ? (
                <div className="overflow-x-auto scroll-thin">
                  <table className="w-full min-w-[36rem] text-[0.7rem]">
                    <thead>
                      <tr className="bg-[#fbfbfe] text-muted">
                        <th className="px-3 py-2 text-right font-semibold">کد</th>
                        <th className="px-3 py-2 font-semibold">گیرنده</th>
                        <th className="px-3 py-2 font-semibold">تاریخ</th>
                        <th className="px-3 py-2 font-semibold">مبلغ</th>
                        <th className="px-3 py-2 font-semibold">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-line">
                          <td className="px-3 py-2 font-bold text-ink">{order.code}</td>
                          <td className="px-3 py-2 text-center text-muted">{order.customer?.name || "—"}</td>
                          <td className="px-3 py-2 text-center text-muted">{faDate(order.createdAt)}</td>
                          <td className="px-3 py-2 text-center font-semibold text-ink">{toman(order.total)}</td>
                          <td className="px-3 py-2 text-center">
                            <select
                              value={order.status}
                              onChange={(event) => setOrderStatus(order.id, event.target.value)}
                              className="rounded-lg border border-line bg-white px-2 py-1 text-[0.68rem]"
                              aria-label="تغییر وضعیت سفارش"
                            >
                              {Object.entries(ORDER_STATUS).map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="px-4 py-10 text-center text-[0.74rem] text-muted">سفارشی برای مدیریت وجود ندارد.</p>
              )}
            </section>
          )}

          {tab === "users" && (
            <section className="nx-card overflow-hidden">
              <p className="border-b border-line px-4 py-3 text-[0.82rem] font-bold text-ink">کاربران فروشگاه</p>
              <ul className="divide-y divide-line">
                {users.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[0.72rem]">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-[0.72rem] font-bold text-primary">
                        {item.name.slice(0, 1)}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="text-[0.62rem] text-muted" dir="ltr">
                          {item.email}
                        </p>
                      </div>
                    </div>
                    <span className={`chip ${item.role === "admin" ? "bg-primary-soft text-primary" : "bg-page text-muted"}`}>
                      {item.role === "admin" ? "مدیر" : "مشتری"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>

      {draft && <ProductForm draft={draft} setDraft={setDraft} onSave={submitDraft} onClose={() => setDraft(null)} />}
    </div>
  );
}
