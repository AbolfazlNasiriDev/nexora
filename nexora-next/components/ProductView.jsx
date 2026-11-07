"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { NXArt } from "@/lib/art";
import { NX_COLORS, NX_WARRANTY } from "@/lib/catalog";
import { discountPercent, faDate, priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductCard, { Stars } from "@/components/ProductCard";

const TABS = [
  { id: "desc", label: "معرفی محصول" },
  { id: "specs", label: "مشخصات فنی" },
  { id: "reviews", label: "نظرات کاربران" },
  { id: "shipping", label: "ارسال و بازگشت" },
];

export default function ProductView() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart, toggleWishlist, toggleCompare, wishlist, compare, reviews, addReview, user, toast, discount } =
    useStore();

  const product = products.find((item) => item.id === id);
  const [gallery, setGallery] = useState(0);
  const [color, setColor] = useState(
    product?.colors?.[0] ? (typeof product.colors[0] === "string" ? product.colors[0] : product.colors[0].name) : null
  );
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [reviewName, setReviewName] = useState(user?.name || "");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const related = useMemo(
    () =>
      products
        .filter((item) => item.cat === product?.cat && item.id !== product?.id)
        .slice(0, 4),
    [product?.cat, product?.id, products]
  );

  if (!product) {
    return (
      <div className="shell py-20 text-center">
        <p className="text-[1rem] font-bold text-ink">این محصول پیدا نشد</p>
        <p className="mt-2 text-[0.78rem] text-muted">ممکن است حذف شده باشد یا نشانی نادرست باشد.</p>
        <Link href="/products" className="btn btn-primary mt-4">
          بازگشت به محصولات
        </Link>
      </div>
    );
  }

  const off = discountPercent(product.price, product.old);
  const liked = wishlist.includes(product.id);
  const compared = compare.includes(product.id);
  const warranties = product.warranties || NX_WARRANTY[product.cat] || [];
  const productReviews = reviews[product.id] || [];

  const buyNow = () => {
    addToCart(product.id, qty, { color });
    router.push("/checkout");
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (reviewText.trim().length < 8) {
      toast("متن نظر باید حداقل ۸ کاراکتر باشد", "error");
      return;
    }
    addReview(product.id, {
      name: reviewName.trim() || "کاربر مهمان",
      rating: reviewRating,
      text: reviewText.trim(),
    });
    setReviewText("");
  };

  return (
    <div className="shell py-6">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[0.68rem] text-muted">
        <Link href="/" className="transition-colors hover:text-primary">
          خانه
        </Link>
        <ChevronLeft size={12} />
        <Link href="/products" className="transition-colors hover:text-primary">
          محصولات
        </Link>
        <ChevronLeft size={12} />
        <Link href={`/category/${product.cat}`} className="transition-colors hover:text-primary">
          {product.catName}
        </Link>
        <ChevronLeft size={12} />
        <span className="line-clamp-1 text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="nx-card overflow-hidden p-3 sm:p-4">
          <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#ffffff,#f5f3ff)]">
            {off > 0 && (
              <span className="absolute right-3 top-3 z-10 rounded-xl bg-sale px-2 py-1 text-[0.68rem] font-bold text-white shadow-sm">
                {toman(off)}٪ تخفیف
              </span>
            )}
            {product.tags?.includes("bestseller") && (
              <span className="absolute left-3 top-3 z-10 rounded-xl bg-ink px-2 py-1 text-[0.62rem] font-bold text-white">
                پرفروش
              </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={NXArt.product(product, gallery)}
              alt={product.name}
              className="mx-auto aspect-square w-full max-w-[30rem] object-contain p-4 transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => setGallery(variant)}
                className={`overflow-hidden rounded-xl border bg-page p-1 transition-all duration-300 ${
                  gallery === variant ? "border-primary ring-2 ring-primary/20" : "border-line hover:border-primary/40"
                }`}
                aria-label={`تصویر ${variant + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={NXArt.product(product, variant)} alt="" className="aspect-square w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="nx-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link href={`/products?brand=${encodeURIComponent(product.brand)}`} className="chip bg-primary-soft text-primary">
                  {product.brand}
                </Link>
                <h1 className="mt-2 text-[1.05rem] font-extrabold leading-8 text-ink sm:text-[1.2rem]">{product.name}</h1>
              </div>
              <span className="flex shrink-0 flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`grid size-9 place-items-center rounded-xl border transition-colors ${
                    liked ? "border-rose-200 bg-rose-50 text-sale" : "border-line text-muted hover:text-sale"
                  }`}
                  aria-label="علاقه‌مندی"
                >
                  <Heart size={16} className={liked ? "fill-sale" : ""} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleCompare(product.id)}
                  className={`grid size-9 place-items-center rounded-xl border transition-colors ${
                    compared ? "border-primary/40 bg-primary-soft text-primary" : "border-line text-muted hover:text-primary"
                  }`}
                  aria-label="مقایسه"
                >
                  <Scale size={16} />
                </button>
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.7rem] text-muted">
              <Stars value={product.rating} />
              <span className="font-semibold text-ink">{toman(product.rating)}</span>
              <span>({toman(product.reviews)} نظر)</span>
              <span className="h-3 w-px bg-line" />
              <span>کد کالا: {product.sku}</span>
            </div>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {product.features?.slice(0, 3).map((feature) => (
                <li key={feature} className="chip border border-line bg-page text-[0.66rem] text-[#4b5065]">
                  <Check size={11} className="text-success" />
                  {feature}
                </li>
              ))}
            </ul>

            {product.colors?.length > 0 && (
              <div className="mt-4">
                <p className="mb-1.5 text-[0.72rem] font-semibold text-ink">رنگ</p>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((entry) => {
                    const swatch =
                      typeof entry === "string"
                        ? { name: NX_COLORS[entry]?.name || entry, hex: NX_COLORS[entry]?.hex || "#ccc" }
                        : { name: entry.name, hex: entry.hex };
                    const key = swatch.name;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setColor(key)}
                        className={`flex items-center gap-1.5 rounded-xl border px-2 py-1 text-[0.68rem] transition-all duration-300 ${
                          color === key ? "border-primary bg-primary-soft text-primary" : "border-line text-[#4b5065] hover:border-primary/40"
                        }`}
                      >
                        <span className="size-3.5 rounded-full border border-black/10" style={{ background: swatch.hex }} />
                        {swatch.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {warranties.length > 0 && (
              <div className="mt-3 rounded-xl border border-line bg-[#fbfbfe] p-2.5">
                <p className="flex items-center gap-1.5 text-[0.7rem] text-[#4b5065]">
                  <ShieldCheck size={14} className="text-success" />
                  {warranties[0]}
                </p>
              </div>
            )}
          </div>

          <div className="nx-card p-4">
            <div className="flex items-end justify-between gap-2">
              <div>
                {off > 0 && (
                  <p className="flex items-center gap-2 text-[0.72rem] text-muted">
                    <span className="line-through">{priceLabel(product.old)}</span>
                    <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-sale">
                      {toman(off)}٪
                    </span>
                  </p>
                )}
                <p className="mt-1 text-[1.15rem] font-extrabold text-ink">{priceLabel(product.price)}</p>
              </div>
              <span className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.max(1, value - 1))}
                  className="grid size-7 place-items-center rounded-lg border border-line text-ink transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="کاهش تعداد"
                >
                  <Minus size={12} />
                </button>
                <span className="w-7 text-center text-[0.8rem] font-bold">{toman(qty)}</span>
                <button
                  type="button"
                  onClick={() => setQty((value) => Math.min(10, value + 1))}
                  className="grid size-7 place-items-center rounded-lg border border-line text-ink transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="افزایش تعداد"
                >
                  <Plus size={12} />
                </button>
              </span>
            </div>

            {product.stock < 6 && (
              <p className="mt-2 text-[0.68rem] font-semibold text-amber-600">تنها {toman(product.stock)} عدد در انبار باقی مانده</p>
            )}

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => addToCart(product.id, qty, { color })} className="btn btn-primary">
                <ShoppingCart size={16} />
                افزودن به سبد
              </button>
              <button type="button" onClick={buyNow} className="btn btn-ghost">
                خرید سریع
                <ArrowLeft size={15} />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[0.66rem] text-[#4b5065]">
              <span className="flex items-center gap-1.5 rounded-xl bg-page px-2 py-1.5">
                <Truck size={13} className="text-primary" /> ارسال سریع تهران
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-page px-2 py-1.5">
                <RotateCcw size={13} className="text-primary" /> ۷ روز بازگشت
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-page px-2 py-1.5">
                <BadgeCheck size={13} className="text-primary" /> اصالت کالا
              </span>
              <span className="flex items-center gap-1.5 rounded-xl bg-page px-2 py-1.5">
                <Store size={13} className="text-primary" /> فروشنده نکستورا
              </span>
            </div>
          </div>

          <div className="nx-card flex items-center gap-2.5 p-3 text-[0.68rem] text-muted">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
              <Package size={16} />
            </span>
            <p className="leading-6">
              سفارش‌های ثبت‌شده تا ساعت ۱۵، همان روز ارسال می‌شوند. امکان تحویل حضوری در تهران وجود دارد.
            </p>
          </div>
        </div>
      </div>

      <section className="nx-card mt-5 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-line no-scrollbar">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative whitespace-nowrap px-4 py-3 text-[0.78rem] font-semibold transition-colors duration-300 ${
                tab === item.id ? "text-primary" : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
              {tab === item.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-5">
          {tab === "desc" && (
            <div className="animate-fade-up space-y-3">
              <p className="text-[0.8rem] leading-8 text-[#4b5065]">{product.desc}</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {product.features?.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 rounded-xl border border-line bg-[#fbfbfe] px-3 py-2 text-[0.74rem] text-[#4b5065]">
                    <Check size={14} className="mt-0.5 shrink-0 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-[0.68rem] text-muted">
                این محصول نمونه است و قیمت‌ها و مشخصات آن برای نمایش قابلیت‌های فروشگاه درج شده‌اند.
              </p>
            </div>
          )}

          {tab === "specs" && (
            <div className="animate-fade-up overflow-hidden rounded-xl border border-line">
              <table className="w-full text-[0.74rem]">
                <tbody>
                  {Object.entries(product.specs || {}).map(([key, value], index) => (
                    <tr key={key} className={index % 2 ? "bg-[#fbfbfe]" : "bg-white"}>
                      <th className="w-40 border-b border-line px-3 py-2.5 text-right font-semibold text-muted">{key}</th>
                      <td className="border-b border-line px-3 py-2.5 text-ink">{value}</td>
                    </tr>
                  ))}
                  {Object.entries(product.filters || {}).map(([key, value], index) => (
                    <tr key={`f-${key}`} className={(Object.keys(product.specs || {}).length + index) % 2 ? "bg-[#fbfbfe]" : "bg-white"}>
                      <th className="w-40 border-b border-line px-3 py-2.5 text-right font-semibold text-muted">{key}</th>
                      <td className="border-b border-line px-3 py-2.5 text-ink">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "reviews" && (
            <div className="animate-fade-up grid gap-4 lg:grid-cols-[1fr_20rem]">
              <div className="space-y-2.5">
                {productReviews.length === 0 && (
                  <p className="rounded-xl bg-page px-3 py-6 text-center text-[0.74rem] text-muted">
                    هنوز نظری برای این محصول ثبت نشده است. اولین نفر باشید.
                  </p>
                )}
                {productReviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-line p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[0.76rem] font-bold text-ink">{review.name}</p>
                      <span className="text-[0.62rem] text-muted">{faDate(review.date)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Stars value={review.rating} size={11} />
                      <span className="text-[0.62rem] text-muted">امتیاز {toman(review.rating)} از ۵</span>
                    </div>
                    <p className="mt-1.5 text-[0.74rem] leading-7 text-[#4b5065]">{review.text}</p>
                  </article>
                ))}
              </div>

              <form onSubmit={submitReview} className="h-fit rounded-xl border border-line bg-[#fbfbfe] p-3">
                <p className="text-[0.78rem] font-bold text-ink">ثبت نظر شما</p>
                <label className="nx-label mt-2" htmlFor="review-name">
                  نام
                </label>
                <input id="review-name" value={reviewName} onChange={(event) => setReviewName(event.target.value)} className="nx-input !py-2 !text-[0.74rem]" placeholder="نام شما" />
                <p className="nx-label mt-2">امتیاز</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" onClick={() => setReviewRating(value)} aria-label={`امتیاز ${value}`}>
                      <Star size={18} className={value <= reviewRating ? "fill-amber-400 text-amber-400" : "text-[#dfe2ee]"} />
                    </button>
                  ))}
                </div>
                <label className="nx-label mt-2" htmlFor="review-text">
                  متن نظر
                </label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={3}
                  className="nx-input !py-2 !text-[0.74rem]"
                  placeholder="تجربه خود را بنویسید…"
                />
                <button type="submit" className="btn btn-primary mt-2 w-full !py-2 !text-[0.74rem]">
                  ارسال نظر
                </button>
              </form>
            </div>
          )}

          {tab === "shipping" && (
            <div className="animate-fade-up grid gap-3 text-[0.76rem] leading-7 text-[#4b5065] sm:grid-cols-2">
              <div className="rounded-xl border border-line p-3">
                <p className="flex items-center gap-1.5 font-bold text-ink">
                  <Truck size={15} className="text-primary" /> روش‌های ارسال
                </p>
                <p className="mt-1.5">ارسال عادی ۲ تا ۴ روز کاری (۸۹٬۰۰۰ تومان) و ارسال سریع تهران در همان روز (۱۴۹٬۰۰۰ تومان).</p>
              </div>
              <div className="rounded-xl border border-line p-3">
                <p className="flex items-center gap-1.5 font-bold text-ink">
                  <RotateCcw size={15} className="text-primary" /> بازگشت کالا
                </p>
                <p className="mt-1.5">تا ۷ روز پس از تحویل، در صورت سالم بودن بسته‌بندی، امکان بازگشت یا تعویض وجود دارد.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-[1.1rem] font-extrabold text-ink">محصولات مشابه</h2>
            <Link href={`/category/${product.cat}`} className="flex items-center gap-1 text-[0.72rem] font-semibold text-primary hover:underline">
              مشاهده همه
              <ChevronLeft size={13} />
            </Link>
          </div>
          <div className="stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} index={index} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
