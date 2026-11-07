"use client";

import Link from "next/link";
import { Heart, Scale, ShoppingCart, Star } from "lucide-react";
import { NXArt } from "@/lib/art";
import { priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export function Stars({ value = 0, size = 12, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`امتیاز ${value} از ۵`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={index <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-[#eceef6] text-[#eceef6]"}
        />
      ))}
    </span>
  );
}

export default function ProductCard({ product, index = 0, compact = false }) {
  const { addToCart, toggleWishlist, toggleCompare, wishlist, compare } = useStore();
  const discount =
    product.old && product.old > product.price ? Math.round((1 - product.price / product.old) * 100) : 0;
  const liked = wishlist.includes(product.id);
  const compared = compare.includes(product.id);

  return (
    <article className="group nx-card nx-card-hover relative flex h-full flex-col overflow-hidden">
      <div className="relative overflow-hidden bg-[linear-gradient(160deg,#ffffff_0%,#f6f5ff_100%)]">
        <Link href={`/product/${product.id}`} className="block aspect-square p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={NXArt.product(product, index % 3)}
            alt={product.name}
            loading={index < 4 ? "eager" : "lazy"}
            className="nx-image size-full object-contain"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between">
          <span className="flex flex-col items-start gap-1">
            {discount > 0 && (
              <span className="rounded-lg bg-sale px-1.5 py-0.5 text-[0.62rem] font-bold text-white shadow-sm">
                {toman(discount)}٪
              </span>
            )}
            {product.tags?.includes("new") && (
              <span className="rounded-lg bg-ink px-1.5 py-0.5 text-[0.6rem] font-bold text-white">جدید</span>
            )}
          </span>
          <span className="pointer-events-auto flex flex-col gap-1 opacity-100 transition-all duration-300 lg:translate-x-2 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={liked ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
              className={`grid size-8 place-items-center rounded-xl border bg-white/95 shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 ${
                liked ? "border-rose-200 text-sale" : "border-line text-muted hover:text-sale"
              }`}
            >
              <Heart size={14} className={liked ? "fill-sale" : ""} />
            </button>
            <button
              type="button"
              onClick={() => toggleCompare(product.id)}
              aria-label={compared ? "حذف از مقایسه" : "افزودن به مقایسه"}
              className={`grid size-8 place-items-center rounded-xl border bg-white/95 shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 ${
                compared ? "border-primary/40 text-primary" : "border-line text-muted hover:text-primary"
              }`}
            >
              <Scale size={14} />
            </button>
          </span>
        </div>

        {product.stock !== undefined && product.stock < 6 && product.stock > 0 && (
          <span className="absolute bottom-2 right-2 rounded-lg bg-amber-50 px-1.5 py-0.5 text-[0.58rem] font-bold text-amber-700">
            تنها {toman(product.stock)} عدد
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <span className="text-[0.62rem] font-medium text-muted">{product.brand}</span>
        <Link
          href={`/product/${product.id}`}
          className={`line-clamp-2 text-[0.79rem] font-semibold leading-6 text-ink transition-colors duration-300 hover:text-primary ${compact ? "" : "min-h-[3rem]"}`}
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <Stars value={product.rating} />
          <span className="text-[0.62rem] text-muted">({toman(product.reviews)})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {discount > 0 && (
              <span className="text-[0.62rem] text-muted line-through decoration-sale/60">{toman(product.old)}</span>
            )}
            <span className="text-[0.86rem] font-extrabold text-ink">{priceLabel(product.price)}</span>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            aria-label="افزودن به سبد خرید"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-[0_10px_20px_-10px_rgba(91,69,232,.9)] active:scale-95"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
