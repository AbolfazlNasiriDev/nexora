"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, Banknote, Check, ChevronLeft, CreditCard, Lock, MapPin, Package, Truck } from "lucide-react";
import { NXArt } from "@/lib/art";
import { priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

const STEPS = ["اطلاعات گیرنده", "شیوه ارسال", "پرداخت", "بازبینی و ثبت"];

export default function CheckoutPage() {
  const { items, subtotal, discount, shippingCost, total, shipping, shippingOptions, setShipping, placeOrder, user, coupon } =
    useStore();
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    province: "تهران",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    address: user?.address || "",
    note: "",
    payment: "online",
    terms: false,
  });

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validateStep = () => {
    const next = {};
    if (step === 0) {
      if (form.name.trim().length < 3) next.name = "نام و نام خانوادگی را کامل وارد کنید";
      if (!/^09\d{9}$/.test(form.phone.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) next.phone = "شماره موبایل ۱۱ رقمی معتبر وارد کنید";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) next.email = "ایمیل معتبر نیست";
      if (form.city.trim().length < 2) next.city = "شهر را وارد کنید";
      if (!/^\d{10}$/.test(form.postalCode.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)))) next.postalCode = "کد پستی ۱۰ رقمی است";
      if (form.address.trim().length < 10) next.address = "نشانی کامل (حداقل ۱۰ کاراکتر) را وارد کنید";
    }
    if (step === 3 && !form.terms) next.terms = "برای ثبت سفارش، قوانین را بپذیرید";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((value) => Math.min(3, value + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    if (!validateStep()) return;
    const created = placeOrder({
      customer: { name: form.name, phone: form.phone, email: form.email, note: form.note },
      address: { province: form.province, city: form.city, postalCode: form.postalCode, address: form.address },
      payment: form.payment,
      note: form.note,
    });
    setOrder(created);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (order) {
    return (
      <div className="shell py-10">
        <div className="nx-card mx-auto max-w-xl overflow-hidden animate-fade-up">
          <div className="relative bg-[linear-gradient(130deg,#16A34A,#0E7A38)] px-6 py-8 text-center text-white">
            <div className="absolute inset-0 nx-grid-lines opacity-20" />
            <span className="relative mx-auto grid size-14 place-items-center rounded-full bg-white/20 animate-pulse-ring">
              <Check size={28} />
            </span>
            <h1 className="relative mt-3 text-[1.15rem] font-extrabold">سفارش شما ثبت شد</h1>
            <p className="relative mt-1 text-[0.74rem] text-white/80">این یک ثبت نمایشی است و پرداختی انجام نشده است.</p>
          </div>
          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between rounded-xl border border-line bg-[#fbfbfe] px-3 py-2.5 text-[0.74rem]">
              <span className="text-muted">کد سفارش</span>
              <span className="font-extrabold text-ink">{order.code}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-[#fbfbfe] px-3 py-2.5 text-[0.74rem]">
              <span className="text-muted">مبلغ</span>
              <span className="font-extrabold text-primary">{priceLabel(order.total)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-[#fbfbfe] px-3 py-2.5 text-[0.74rem]">
              <span className="text-muted">شیوه پرداخت</span>
              <span className="font-semibold text-ink">
                {order.payment === "online" ? "پرداخت اینترنتی (نمایشی)" : "پرداخت در محل"}
              </span>
            </div>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={`${item.id}-${item.color}`} className="flex items-center justify-between gap-2 text-[0.7rem] text-muted">
                  <span className="line-clamp-1">
                    {item.name} × {toman(item.qty)}
                  </span>
                  <span className="shrink-0 font-semibold text-ink">{priceLabel(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href="/orders" className="btn btn-ghost text-[0.74rem]">
                پیگیری سفارش
              </Link>
              <Link href="/products" className="btn btn-primary text-[0.74rem]">
                ادامه خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell py-16">
        <div className="nx-card mx-auto max-w-md px-5 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Package size={24} />
          </span>
          <p className="mt-3 text-[0.95rem] font-bold text-ink">سبد خرید شما خالی است</p>
          <p className="mt-1 text-[0.74rem] text-muted">برای ادامه پرداخت، ابتدا محصولی به سبد اضافه کنید.</p>
          <Link href="/products" className="btn btn-primary mt-4">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-6">
      <div className="mb-5">
        <h1 className="text-[1.35rem] font-extrabold text-ink">تسویه حساب</h1>
        <p className="mt-1 text-[0.74rem] text-muted">چهار قدم تا تحویل سفارش؛ اطلاعات را کامل کنید.</p>
      </div>

      <ol className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((label, index) => {
          const state = index === step ? "active" : index < step ? "done" : "todo";
          return (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-[0.7rem] transition-all duration-300 ${
                state === "active"
                  ? "border-primary bg-primary-soft text-primary"
                  : state === "done"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-line bg-white text-muted"
              }`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${
                  state === "todo" ? "bg-page" : "bg-white/70"
                }`}
              >
                {state === "done" ? <Check size={13} /> : toman(index + 1)}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-5 lg:grid-cols-[1fr_21rem]">
        <div className="space-y-3">
          {step === 0 && (
            <section className="nx-card animate-fade-up p-4">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <MapPin size={16} className="text-primary" /> اطلاعات گیرنده
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { key: "name", label: "نام و نام خانوادگی", placeholder: "مثلاً سارا محمدی" },
                  { key: "phone", label: "شماره موبایل", placeholder: "۰۹۱۲۱۲۳۴۵۶۷", inputMode: "tel" },
                  { key: "email", label: "ایمیل (اختیاری)", placeholder: "you@example.com", type: "email" },
                  { key: "city", label: "شهر", placeholder: "تهران" },
                  { key: "postalCode", label: "کد پستی", placeholder: "۱۹۹۸۷۴۵۱۲۳", inputMode: "numeric" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="nx-label" htmlFor={`co-${field.key}`}>
                      {field.label}
                    </label>
                    <input
                      id={`co-${field.key}`}
                      value={form[field.key]}
                      onChange={(event) => set(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      type={field.type || "text"}
                      inputMode={field.inputMode}
                      className={`nx-input !text-[0.78rem] ${errors[field.key] ? "!border-sale" : ""}`}
                    />
                    {errors[field.key] && <p className="mt-1 text-[0.64rem] text-sale">{errors[field.key]}</p>}
                  </div>
                ))}
                <div>
                  <label className="nx-label" htmlFor="co-province">
                    استان
                  </label>
                  <select id="co-province" value={form.province} onChange={(event) => set("province", event.target.value)} className="nx-input !text-[0.78rem]">
                    {["تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "گیلان", "البرز"].map((province) => (
                      <option key={province}>{province}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="nx-label" htmlFor="co-address">
                    نشانی کامل
                  </label>
                  <textarea
                    id="co-address"
                    value={form.address}
                    onChange={(event) => set("address", event.target.value)}
                    rows={3}
                    placeholder="خیابان، کوچه، پلاک و واحد"
                    className={`nx-input !text-[0.78rem] ${errors.address ? "!border-sale" : ""}`}
                  />
                  {errors.address && <p className="mt-1 text-[0.64rem] text-sale">{errors.address}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="nx-label" htmlFor="co-note">
                    یادداشت سفارش (اختیاری)
                  </label>
                  <input id="co-note" value={form.note} onChange={(event) => set("note", event.target.value)} className="nx-input !text-[0.78rem]" placeholder="مثلاً بعد از ساعت ۱۷ تماس بگیرید" />
                </div>
              </div>
            </section>
          )}

          {step === 1 && (
            <section className="nx-card animate-fade-up p-4">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <Truck size={16} className="text-primary" /> شیوه ارسال
              </p>
              <div className="mt-3 space-y-2">
                {Object.entries(shippingOptions).map(([key, option]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShipping(key)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-right text-[0.76rem] transition-all duration-300 ${
                      shipping === key ? "border-primary bg-primary-soft text-primary" : "border-line text-[#4b5065] hover:border-primary/40"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{option.label}</span>
                      <span className="mt-0.5 block text-[0.64rem] text-muted">
                        {key === "express" ? "تحویل تا ۳ ساعت پس از تأیید" : "تحویل ۲ تا ۴ روز کاری"}
                      </span>
                    </span>
                    <span className="text-[0.72rem] font-bold">{option.price ? priceLabel(option.price) : "رایگان"}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-line bg-[#fbfbfe] px-3 py-2.5 text-[0.7rem] leading-6 text-muted">
                سفارش‌های بالای ۵ میلیون تومان در روش عادی رایگان ارسال می‌شوند.
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="nx-card animate-fade-up p-4">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <CreditCard size={16} className="text-primary" /> شیوه پرداخت
              </p>
              <div className="mt-3 space-y-2">
                {[
                  { value: "online", title: "پرداخت اینترنتی (نمایشی)", text: "اتصال به درگاه بانکی شبیه‌سازی شده است", icon: CreditCard },
                  { value: "cod", title: "پرداخت در محل", text: "پرداخت هنگام تحویل کالا", icon: Banknote },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => set("payment", method.value)}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition-all duration-300 ${
                      form.payment === method.value ? "border-primary bg-primary-soft" : "border-line hover:border-primary/40"
                    }`}
                  >
                    <span className={`grid size-9 place-items-center rounded-xl ${form.payment === method.value ? "bg-primary text-white" : "bg-page text-muted"}`}>
                      <method.icon size={16} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[0.78rem] font-semibold text-ink">{method.title}</span>
                      <span className="mt-0.5 block text-[0.64rem] text-muted">{method.text}</span>
                    </span>
                    <span className={`grid size-4 place-items-center rounded-full border ${form.payment === method.value ? "border-primary bg-primary" : "border-line"}`}>
                      {form.payment === method.value && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[0.68rem] leading-6 text-amber-800">
                <Lock size={14} className="mt-0.5 shrink-0" />
                این فروشگاه نمونه است؛ هیچ تراکنش بانکی واقعی انجام نمی‌شود و اطلاعات کارت دریافت نمی‌گردد.
              </p>
            </section>
          )}

          {step === 3 && (
            <section className="nx-card animate-fade-up p-4">
              <p className="flex items-center gap-1.5 text-[0.85rem] font-bold text-ink">
                <BadgeCheck size={16} className="text-primary" /> بازبینی نهایی
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-line p-3 text-[0.72rem] leading-7 text-[#4b5065]">
                  <p className="mb-1 font-bold text-ink">گیرنده</p>
                  <p>{form.name}</p>
                  <p>{form.phone}</p>
                  <p>
                    {form.province}، {form.city}
                  </p>
                  <p>{form.address}</p>
                  <p>کد پستی: {form.postalCode}</p>
                </div>
                <div className="rounded-xl border border-line p-3 text-[0.72rem] leading-7 text-[#4b5065]">
                  <p className="mb-1 font-bold text-ink">ارسال و پرداخت</p>
                  <p>{shippingOptions[shipping].label}</p>
                  <p>{form.payment === "online" ? "پرداخت اینترنتی (نمایشی)" : "پرداخت در محل"}</p>
                  {form.note && <p>یادداشت: {form.note}</p>}
                  {coupon && <p>کد تخفیف: {coupon.code}</p>}
                </div>
              </div>

              <ul className="mt-3 divide-y divide-line rounded-xl border border-line">
                {items.map(({ id, color, qty, product, line }) => (
                  <li key={`${id}-${color}`} className="flex items-center gap-2.5 p-2.5">
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg bg-page">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={NXArt.product(product)} alt="" className="size-full object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-1 text-[0.72rem] font-semibold text-ink">{product.name}</span>
                      <span className="text-[0.64rem] text-muted">
                        {toman(qty)} عدد {color ? `· ${color}` : ""}
                      </span>
                    </span>
                    <span className="text-[0.72rem] font-bold text-ink">{priceLabel(line)}</span>
                  </li>
                ))}
              </ul>

              <label className="mt-3 flex items-start gap-2 text-[0.7rem] text-[#4b5065]">
                <input type="checkbox" className="nx-check mt-0.5" checked={form.terms} onChange={(event) => set("terms", event.target.checked)} />
                قوانین فروشگاه و شرایط بازگشت کالا را می‌پذیرم.
              </label>
              {errors.terms && <p className="mt-1 text-[0.64rem] text-sale">{errors.terms}</p>}
            </section>
          )}

          <div className="flex items-center justify-between gap-2">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((value) => value - 1)} className="btn btn-ghost">
                <ArrowRight size={15} />
                مرحله قبل
              </button>
            ) : (
              <Link href="/cart" className="btn btn-ghost">
                <ArrowRight size={15} />
                بازگشت به سبد
              </Link>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                مرحله بعد
                <ArrowLeft size={15} />
              </button>
            ) : (
              <button type="button" onClick={submit} className="btn btn-primary">
                ثبت نهایی سفارش
                <Check size={15} />
              </button>
            )}
          </div>
        </div>

        <aside className="nx-card h-fit space-y-3 p-4 lg:sticky lg:top-36">
          <p className="text-[0.82rem] font-bold text-ink">خلاصه سفارش</p>
          <ul className="max-h-52 space-y-2 overflow-y-auto scroll-thin">
            {items.map(({ id, qty, product, color }) => (
              <li key={`${id}-${color}`} className="flex items-center gap-2">
                <span className="size-10 shrink-0 overflow-hidden rounded-lg bg-page">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={NXArt.product(product)} alt="" className="size-full object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-1 text-[0.68rem] font-medium text-ink">{product.name}</span>
                  <span className="text-[0.6rem] text-muted">{toman(qty)} عدد</span>
                </span>
                <span className="text-[0.68rem] font-semibold text-ink">{toman(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-line pt-3 text-[0.72rem]">
            <div className="flex justify-between text-muted">
              <dt>جمع کالاها</dt>
              <dd className="font-semibold text-ink">{priceLabel(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>تخفیف</dt>
                <dd className="font-semibold">-{priceLabel(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between text-muted">
              <dt>ارسال</dt>
              <dd className="font-semibold text-ink">{shippingCost ? priceLabel(shippingCost) : "رایگان"}</dd>
            </div>
            <div className="flex justify-between border-t border-dashed border-line pt-2 text-[0.84rem] font-extrabold">
              <dt>قابل پرداخت</dt>
              <dd className="text-primary">{priceLabel(total)}</dd>
            </div>
          </dl>
          <p className="flex items-center gap-1.5 rounded-xl bg-page px-2.5 py-2 text-[0.62rem] leading-5 text-muted">
            <ChevronLeft size={12} /> اطلاعات شما فقط در همین مرورگر ذخیره می‌شود.
          </p>
        </aside>
      </div>
    </div>
  );
}
