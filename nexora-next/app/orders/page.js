"use client";

import Link from "next/link";
import { ArrowLeft, Package, PackageCheck, Truck } from "lucide-react";
import { ORDER_STATUS, faDateTime, priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function OrdersPage() {
  const { user, orders, ready } = useStore();

  if (!ready) return <div className="shell py-16 text-center text-[0.8rem] text-muted">در حال بارگذاری سفارش‌ها…</div>;

  if (!user) {
    return (
      <div className="shell py-16">
        <div className="nx-card mx-auto max-w-md px-5 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Package size={24} />
          </span>
          <p className="mt-3 text-[0.95rem] font-bold text-ink">سفارش‌ها را ببینید</p>
          <p className="mt-1 text-[0.74rem] leading-6 text-muted">برای پیگیری سفارش‌ها وارد حساب خود شوید.</p>
          <Link href="/login" className="btn btn-primary mt-4">
            ورود به حساب
          </Link>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((order) => order.userId === user.id);

  return (
    <div className="shell py-6">
      <div className="mb-5">
        <h1 className="text-[1.35rem] font-extrabold text-ink">سفارش‌های من</h1>
        <p className="mt-1 text-[0.74rem] text-muted">
          {myOrders.length ? `${toman(myOrders.length)} سفارش ثبت‌شده` : "هنوز سفارشی ثبت نکرده‌اید"}
        </p>
      </div>

      {myOrders.length ? (
        <div className="space-y-3">
          {myOrders.map((order) => {
            const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
            return (
              <article key={order.id} className="nx-card overflow-hidden">
                <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-[#fbfbfe] px-4 py-2.5 text-[0.7rem]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-extrabold text-ink">{order.code}</span>
                    <span className="text-muted">{faDateTime(order.createdAt)}</span>
                  </div>
                  <span className={`chip border ${status.tone}`}>{status.label}</span>
                </header>
                <div className="grid gap-3 p-4 sm:grid-cols-[1fr_12rem]">
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={`${item.id}-${item.color}`} className="flex items-center justify-between gap-2 text-[0.72rem]">
                        <Link href={`/product/${item.id}`} className="line-clamp-1 text-ink transition-colors hover:text-primary">
                          {item.name}
                        </Link>
                        <span className="shrink-0 text-muted">
                          {toman(item.qty)} × {priceLabel(item.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl border border-line bg-[#fbfbfe] p-2.5 text-[0.68rem]">
                    <p className="flex items-center justify-between text-muted">
                      <span>مبلغ کل</span>
                      <span className="font-bold text-ink">{priceLabel(order.total)}</span>
                    </p>
                    <p className="mt-1 flex items-center justify-between text-muted">
                      <span>پرداخت</span>
                      <span className="font-semibold text-ink">{order.payment === "online" ? "اینترنتی (نمایشی)" : "در محل"}</span>
                    </p>
                    <p className="mt-1 flex items-center justify-between text-muted">
                      <span>ارسال</span>
                      <span className="font-semibold text-ink">{order.shipping === "express" ? "سریع" : "عادی"}</span>
                    </p>
                    <p className="mt-1.5 flex items-center gap-1 border-t border-dashed border-line pt-1.5 text-[0.62rem] text-primary">
                      {order.status === "delivered" ? <PackageCheck size={12} /> : <Truck size={12} />}
                      {order.status === "shipped" ? "کالا تحویل شرکت پست شده است" : order.status === "delivered" ? "تحویل شده" : "در حال آماده‌سازی"}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="nx-card flex flex-col items-center gap-3 px-5 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-page text-muted">
            <Package size={26} />
          </span>
          <p className="text-[0.95rem] font-bold text-ink">سفارشی ثبت نشده</p>
          <p className="max-w-sm text-[0.76rem] leading-6 text-muted">اولین سفارش خود را ثبت کنید تا وضعیت آن را همین‌جا ببینید.</p>
          <Link href="/products" className="btn btn-primary mt-2">
            شروع خرید
            <ArrowLeft size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
