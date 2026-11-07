"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { NXArt } from "@/lib/art";
import { priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const {
    items,
    setQty,
    removeFromCart,
    subtotal,
    discount,
    shippingCost,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    shipping,
    shippingOptions,
    setShipping,
  } = useStore();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);

  const onApply = (event) => {
    event.preventDefault();
    const result = applyCoupon(code, subtotal);
    setMessage(result);
    if (result.ok) setCode("");
  };

  return (
    <div className="shell py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[1.35rem] font-extrabold text-ink">سبد خرید</h1>
          <p className="mt-1 text-[0.74rem] text-muted">
            {items.length ? `${toman(items.length)} کالا در سبد شما` : "سبد شما در انتظار اولین خرید است"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[0.68rem]">
          {["سبد خرید", "اطلاعات ارسال", "پرداخت"].map((step, index) => (
            <span key={step} className="flex items-center gap-2">
              <span className={`chip border ${index === 0 ? "border-primary bg-primary-soft text-primary" : "border-line bg-white text-muted"}`}>
                {toman(index + 1)}. {step}
              </span>
              {index < 2 && <ChevronLeft size={12} className="text-muted" />}
            </span>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="nx-card flex flex-col items-center gap-3 px-5 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary">
            <ShoppingBag size={26} />
          </span>
          <p className="text-[0.95rem] font-bold text-ink">سبد خرید خالی است</p>
          <p className="max-w-sm text-[0.76rem] leading-6 text-muted">
            ۷۷ محصول منتخب نکستورا آماده بررسی هستند؛ یکی را انتخاب کنید و خرید را شروع کنید.
          </p>
          <Link href="/products" className="btn btn-primary mt-2">
            مشاهده محصولات
            <ArrowLeft size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_21rem]">
          <div className="space-y-3">
            <div className="nx-card overflow-hidden">
              <div className="hidden items-center gap-3 border-b border-line bg-[#fbfbfe] px-4 py-2.5 text-[0.68rem] font-semibold text-muted sm:flex">
                <span className="flex-1">محصول</span>
                <span className="w-24 text-center">قیمت واحد</span>
                <span className="w-24 text-center">تعداد</span>
                <span className="w-24 text-center">جمع</span>
                <span className="w-8" />
              </div>
              <ul className="divide-y divide-line">
                {items.map(({ id, color, qty, product, line }) => (
                  <li key={`${id}-${color}`} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap sm:p-4">
                    <Link href={`/product/${id}`} className="size-20 shrink-0 overflow-hidden rounded-xl bg-[#fbfbfe]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={NXArt.product(product)} alt={product.name} className="size-full object-contain" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${id}`} className="line-clamp-2 text-[0.78rem] font-semibold leading-6 text-ink transition-colors hover:text-primary">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[0.66rem] text-muted">
                        {product.brand} · {product.catName}
                        {color ? ` · رنگ ${color}` : ""}
                      </p>
                      <p className="mt-1 text-[0.7rem] font-semibold text-sale sm:hidden">{priceLabel(product.price)}</p>
                    </div>
                    <div className="hidden w-24 text-center text-[0.72rem] font-semibold text-ink sm:block">{toman(product.price)}</div>
                    <div className="flex w-auto items-center justify-center gap-1 rounded-xl border border-line p-1 sm:w-24">
                      <button
                        type="button"
                        onClick={() => setQty(id, color, qty + 1)}
                        className="grid size-6 place-items-center rounded-lg transition-colors hover:bg-primary-soft hover:text-primary"
                        aria-label="افزایش"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="w-6 text-center text-[0.74rem] font-bold">{toman(qty)}</span>
                      <button
                        type="button"
                        onClick={() => setQty(id, color, qty - 1)}
                        className="grid size-6 place-items-center rounded-lg transition-colors hover:bg-primary-soft hover:text-primary"
                        aria-label="کاهش"
                      >
                        <Minus size={12} />
                      </button>
                    </div>
                    <div className="w-24 text-center text-[0.74rem] font-extrabold text-ink">{priceLabel(line)}</div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(id, color)}
                      className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-sale"
                      aria-label="حذف کالا"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nx-card p-4">
              <p className="flex items-center gap-1.5 text-[0.8rem] font-bold text-ink">
                <Truck size={16} className="text-primary" /> شیوه ارسال
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {Object.entries(shippingOptions).map(([key, option]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShipping(key)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-right text-[0.72rem] transition-all duration-300 ${
                      shipping === key ? "border-primary bg-primary-soft text-primary" : "border-line text-[#4b5065] hover:border-primary/40"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{option.label}</span>
                      <span className="mt-0.5 block text-[0.64rem] text-muted">{option.price ? priceLabel(option.price) : "رایگان"}</span>
                    </span>
                    <span className={`grid size-4 place-items-center rounded-full border ${shipping === key ? "border-primary bg-primary" : "border-line"}`}>
                      {shipping === key && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit space-y-3 lg:sticky lg:top-36">
            <div className="nx-card p-4">
              <p className="flex items-center gap-1.5 text-[0.82rem] font-bold text-ink">
                <Tag size={15} className="text-primary" /> کد تخفیف
              </p>
              {coupon ? (
                <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <div>
                    <p className="text-[0.72rem] font-bold text-emerald-700">{coupon.code}</p>
                    <p className="text-[0.62rem] text-emerald-600">{coupon.label}</p>
                  </div>
                  <button type="button" onClick={removeCoupon} className="text-emerald-600" aria-label="حذف کد">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={onApply} className="mt-2 flex gap-1.5">
                  <input
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="مثلاً NEXORA10"
                    aria-label="کد تخفیف"
                    className="nx-input !py-2 !text-[0.74rem]"
                  />
                  <button type="submit" className="btn btn-soft !px-3 !py-2 !text-[0.7rem]">
                    اعمال
                  </button>
                </form>
              )}
              {message && (
                <p className={`mt-2 text-[0.66rem] ${message.ok ? "text-success" : "text-sale"}`}>{message.message}</p>
              )}
              <p className="mt-2 text-[0.62rem] leading-5 text-muted">کدهای آزمایشی: NEXORA10، NEXORA5 و WELCOME</p>
            </div>

            <div className="nx-card p-4">
              <dl className="space-y-2 text-[0.74rem]">
                <div className="flex items-center justify-between text-muted">
                  <dt>جمع کالاها</dt>
                  <dd className="font-semibold text-ink">{priceLabel(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <dt>تخفیف</dt>
                  <dd className={`font-semibold ${discount ? "text-success" : "text-ink"}`}>
                    {discount ? `-${priceLabel(discount)}` : "۰ تومان"}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-muted">
                  <dt>هزینه ارسال</dt>
                  <dd className="font-semibold text-ink">{shippingCost ? priceLabel(shippingCost) : "رایگان"}</dd>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-line pt-2.5 text-[0.86rem] font-extrabold">
                  <dt>مبلغ قابل پرداخت</dt>
                  <dd className="text-primary">{priceLabel(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn btn-primary mt-3 w-full">
                ادامه خرید و پرداخت
                <ArrowLeft size={15} />
              </Link>
              <Link href="/products" className="mt-2 flex items-center justify-center gap-1 text-[0.7rem] font-semibold text-muted transition-colors hover:text-primary">
                <ChevronLeft size={13} /> افزودن محصول دیگر
              </Link>
            </div>

            <p className="px-2 text-[0.62rem] leading-5 text-muted">
              پرداخت در این نسخه نمایشی است و هیچ مبلغی از حساب شما کسر نمی‌شود.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
