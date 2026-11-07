"use client";

import Link from "next/link";
import { ArrowLeft, GitCompareArrows, ShoppingCart, Trash2 } from "lucide-react";
import { NXArt } from "@/lib/art";
import { priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ComparePage() {
  const { compare, products, toggleCompare, addToCart } = useStore();
  const items = compare.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  const keys = [];
  items.forEach((product) => {
    Object.keys(product.specs || {}).forEach((key) => {
      if (!keys.includes(key)) keys.push(key);
    });
    Object.keys(product.filters || {}).forEach((key) => {
      if (!keys.includes(key)) keys.push(key);
    });
  });

  const valueFor = (product, key) => product.specs?.[key] ?? product.filters?.[key] ?? "—";
  const differing = keys.filter((key) => new Set(items.map((product) => valueFor(product, key))).size > 1);

  return (
    <div className="shell py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-[1.35rem] font-extrabold text-ink">
            <GitCompareArrows size={20} className="text-primary" />
            مقایسه محصولات
          </h1>
          <p className="mt-1 text-[0.74rem] text-muted">
            {items.length ? `${toman(items.length)} محصول، ${toman(differing.length)} تفاوت کلیدی` : "برای مقایسه حداقل دو محصول انتخاب کنید"}
          </p>
        </div>
        {items.length > 0 && (
          <Link href="/products" className="btn btn-ghost !text-[0.74rem]">
            افزودن محصول دیگر
            <ArrowLeft size={14} />
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="nx-card flex flex-col items-center gap-3 px-5 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-primary-soft text-primary">
            <GitCompareArrows size={26} />
          </span>
          <p className="text-[0.95rem] font-bold text-ink">لیست مقایسه خالی است</p>
          <p className="max-w-sm text-[0.76rem] leading-6 text-muted">
            در صفحه هر محصول روی آیکون مقایسه بزنید و تا ۴ محصول را کنار هم بررسی کنید.
          </p>
          <Link href="/products" className="btn btn-primary mt-2">
            انتخاب محصول
          </Link>
        </div>
      ) : (
        <div className="nx-card overflow-hidden">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[42rem] border-collapse text-[0.74rem]">
              <thead>
                <tr>
                  <th className="sticky right-0 z-10 w-36 border-b border-line bg-[#fbfbfe] px-3 py-3 text-right font-semibold text-muted">
                    مشخصات
                  </th>
                  {items.map((product) => (
                    <th key={product.id} className="border-b border-line bg-white px-3 py-3 align-top">
                      <div className="relative mx-auto w-28">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={NXArt.product(product)} alt={product.name} className="mx-auto aspect-square w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => toggleCompare(product.id)}
                          className="absolute left-0 top-0 grid size-6 place-items-center rounded-lg border border-line bg-white text-muted transition-colors hover:text-sale"
                          aria-label="حذف از مقایسه"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <Link href={`/product/${product.id}`} className="mt-2 line-clamp-2 block text-[0.72rem] font-semibold text-ink hover:text-primary">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-[0.74rem] font-extrabold text-primary">{priceLabel(product.price)}</p>
                      <button type="button" onClick={() => addToCart(product.id)} className="btn btn-soft mt-2 w-full !py-1.5 !text-[0.66rem]">
                        <ShoppingCart size={12} /> افزودن به سبد
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keys.map((key, index) => {
                  const isDiff = differing.includes(key);
                  return (
                    <tr key={key} className={index % 2 ? "bg-[#fbfbfe]" : "bg-white"}>
                      <th className="sticky right-0 z-10 border-b border-line bg-inherit px-3 py-2.5 text-right font-semibold text-muted">
                        {key}
                        {isDiff && <span className="ms-1 rounded bg-primary-soft px-1 py-0.5 text-[0.55rem] text-primary">تفاوت</span>}
                      </th>
                      {items.map((product) => (
                        <td key={product.id} className="border-b border-line px-3 py-2.5 text-center text-ink">
                          {valueFor(product, key)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr>
                  <th className="sticky right-0 z-10 bg-white px-3 py-2.5 text-right font-semibold text-muted">امتیاز</th>
                  {items.map((product) => (
                    <td key={product.id} className="px-3 py-2.5 text-center">
                      <span className="chip bg-amber-50 text-amber-700">{toman(product.rating)} از ۵</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
