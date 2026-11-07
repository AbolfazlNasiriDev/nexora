"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { toman } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function WishlistPage() {
  const { wishlist, products, addToCart, toggleWishlist } = useStore();
  const items = wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  return (
    <div className="shell py-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-[1.35rem] font-extrabold text-ink">
            <Heart size={20} className="text-sale" />
            علاقه‌مندی‌های من
          </h1>
          <p className="mt-1 text-[0.74rem] text-muted">
            {items.length ? `${toman(items.length)} محصول ذخیره شده` : "هنوز محصولی را ذخیره نکرده‌اید"}
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => items.forEach((product) => addToCart(product.id))}
              className="btn btn-primary !text-[0.74rem]"
            >
              <ShoppingCart size={15} />
              افزودن همه به سبد
            </button>
            <button
              type="button"
              onClick={() => items.forEach((product) => toggleWishlist(product.id))}
              className="btn btn-ghost !text-[0.74rem]"
            >
              پاک کردن لیست
            </button>
          </div>
        )}
      </div>

      {items.length ? (
        <div className="stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {items.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} compact />
          ))}
        </div>
      ) : (
        <div className="nx-card flex flex-col items-center gap-3 px-5 py-20 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-rose-50 text-sale">
            <Heart size={26} />
          </span>
          <p className="text-[0.95rem] font-bold text-ink">لیست علاقه‌مندی خالی است</p>
          <p className="max-w-sm text-[0.76rem] leading-6 text-muted">
            روی آیکون قلب هر محصول بزنید تا برای بررسی بعدی اینجا ذخیره شود.
          </p>
          <Link href="/products" className="btn btn-primary mt-2">
            مشاهده محصولات
            <ArrowLeft size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
