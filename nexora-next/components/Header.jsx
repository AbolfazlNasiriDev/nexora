"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronLeft,
  Heart,
  LayoutGrid,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";
import Logo from "@/components/Logo";
import { CATEGORIES } from "@/lib/catalog";
import { NXArt } from "@/lib/art";
import { searchProducts } from "@/lib/search";
import { useStore } from "@/lib/store";
import { priceLabel, toman } from "@/lib/format";

const QUICK_LINKS = [
  { href: "/products?tag=bestseller", label: "پرفروش‌ترین‌ها" },
  { href: "/products?tag=new", label: "جدیدترین‌ها" },
  { href: "/products?tag=amazing", label: "پیشنهاد شگفت‌انگیز" },
  { href: "/products", label: "همه محصولات" },
  { href: "/compare", label: "مقایسه محصولات" },
];

function useOutside(ref, handler, active) {
  useEffect(() => {
    if (!active) return;
    const onDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) handler();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [ref, handler, active]);
}

function SearchBox({ variant = "desktop", onNavigate }) {
  const router = useRouter();
  const { products } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const inputRef = useRef(null);
  const results = useMemo(() => searchProducts(products, query, 6), [products, query]);

  useOutside(boxRef, () => setOpen(false), open);

  const go = (href) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(href);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      inputRef.current?.focus();
      return;
    }
    go(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={boxRef} className="relative z-[70] w-full">
      <form onSubmit={submit} role="search" className="group relative">
        <Search
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors duration-300 group-focus-within:text-primary"
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          type="search"
          placeholder="جستجوی محصول، برند یا دسته‌بندی…"
          aria-label="جستجوی محصولات"
          className={`nx-input h-11 !rounded-2xl !bg-[#f4f5fb] !pr-11 !pl-24 text-[0.82rem] transition-all duration-300 focus:!bg-white ${
            variant === "mobile" ? "" : ""
          }`}
        />
        <button
          type="submit"
          className="btn btn-primary absolute left-1.5 top-1/2 h-8 -translate-y-1/2 !rounded-xl !px-3.5 !py-0 text-[0.72rem]"
        >
          جستجو
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-[calc(100%+0.6rem)] z-[80] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_70px_-30px_rgba(21,23,43,.45)] animate-pop">
          {query.trim() ? (
            results.length ? (
              <>
                <p className="border-b border-line/70 px-4 py-2.5 text-[0.68rem] font-semibold text-muted">
                  {toman(results.length)} نتیجه برای «{query.trim()}»
                </p>
                <ul className="max-h-[22rem] overflow-y-auto scroll-thin">
                  {results.map((product, index) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        onClick={() => go(`/product/${product.id}`)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-right transition-colors duration-200 hover:bg-page"
                      >
                        <span className="size-12 shrink-0 overflow-hidden rounded-xl border border-line bg-page">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={NXArt.product(product, index)} alt={product.name} className="size-full object-contain" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.78rem] font-semibold text-ink">{product.name}</span>
                          <span className="mt-0.5 block text-[0.68rem] text-muted">{product.catName}</span>
                        </span>
                        <span className="shrink-0 text-[0.72rem] font-bold text-primary">{priceLabel(product.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => go(`/products?q=${encodeURIComponent(query.trim())}`)}
                  className="flex w-full items-center justify-center gap-1.5 border-t border-line bg-[#fafaff] py-2.5 text-[0.74rem] font-semibold text-primary transition-colors hover:bg-primary-soft"
                >
                  مشاهده همه نتایج
                  <ChevronLeft size={14} />
                </button>
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-[0.82rem] font-semibold text-ink">نتیجه‌ای پیدا نشد</p>
                <p className="mt-1 text-[0.72rem] text-muted">املای دیگری را امتحان کنید یا همه محصولات را ببینید.</p>
                <button type="button" onClick={() => go("/products")} className="btn btn-soft mt-3 !text-[0.72rem]">
                  همه محصولات
                </button>
              </div>
            )
          ) : (
            <div className="p-3">
              <p className="px-1 pb-2 text-[0.68rem] font-semibold text-muted">جستجوهای پرطرفدار</p>
              <div className="flex flex-wrap gap-1.5">
                {["آیفون", "گلکسی", "مک‌بوک", "ایرپاد", "پلی‌استیشن", "هدفون"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="chip border border-line bg-page text-ink transition-colors hover:border-primary/40 hover:bg-primary-soft hover:text-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MegaMenu({ onClose }) {
  return (
    <div className="absolute inset-x-0 top-full z-[60] hidden border-b border-line bg-white shadow-[0_30px_60px_-40px_rgba(21,23,43,.5)] animate-fade-up lg:block">
      <div className="shell grid grid-cols-5 gap-5 py-6">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            onClick={onClose}
            className="group rounded-2xl p-3 transition-colors duration-300 hover:bg-page"
          >
            <span className="mb-2 flex items-center gap-2">
              <span
                className="grid size-8 place-items-center rounded-xl text-[0.7rem] font-bold text-white"
                style={{ background: category.color }}
              >
                {category.short.slice(0, 1)}
              </span>
              <span className="text-[0.8rem] font-bold text-ink transition-colors group-hover:text-primary">
                {category.short}
              </span>
            </span>
            <span className="flex flex-col gap-1">
              {category.subs.slice(0, 6).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${category.id}?sub=${sub.id}`}
                  onClick={onClose}
                  className="w-fit text-[0.7rem] text-muted transition-colors duration-200 hover:text-primary"
                >
                  {sub.name}
                </Link>
              ))}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CartDrawer() {
  const { cartOpen, setCartOpen, items, setQty, removeFromCart, subtotal, discount, shippingCost, total } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => event.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="بستن سبد خرید"
        onClick={() => setCartOpen(false)}
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm animate-pop"
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(26rem,100%)] flex-col bg-white shadow-[0_0_80px_rgba(21,23,43,.35)] animate-slide-in">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-ink">
            <ShoppingBag size={18} className="text-primary" />
            سبد خرید
            <span className="chip bg-primary-soft text-primary">{toman(items.length)} کالا</span>
          </h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="grid size-9 place-items-center rounded-xl border border-line text-muted transition-colors duration-300 hover:border-primary/30 hover:text-primary"
            aria-label="بستن"
          >
            <X size={16} />
          </button>
        </header>

        {items.length ? (
          <>
            <div className="flex-1 overflow-y-auto scroll-thin px-5 py-4">
              <div className="mb-4 rounded-2xl bg-primary-soft/70 p-3">
                <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-primary-dark">
                  <Truck size={14} />
                  {subtotal >= 5000000
                    ? "ارسال این سفارش رایگان است"
                    : `${priceLabel(5000000 - subtotal)} تا ارسال رایگان`}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#7C6BFF] to-[#5B45E8] transition-[width] duration-700"
                    style={{ width: `${Math.min(100, (subtotal / 5000000) * 100)}%` }}
                  />
                </div>
              </div>

              <ul className="flex flex-col gap-3">
                {items.map(({ id, color, qty, product }) => (
                  <li key={`${id}-${color}`} className="nx-card flex gap-3 p-2.5">
                    <span className="size-20 shrink-0 overflow-hidden rounded-xl bg-page">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={NXArt.product(product)} alt={product.name} className="size-full object-contain" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${id}`}
                        onClick={() => setCartOpen(false)}
                        className="line-clamp-2 text-[0.74rem] font-semibold leading-6 text-ink transition-colors hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 rounded-xl border border-line p-0.5">
                          <button
                            type="button"
                            onClick={() => setQty(id, color, qty + 1)}
                            className="grid size-6 place-items-center rounded-lg text-ink transition-colors hover:bg-primary-soft hover:text-primary"
                            aria-label="افزایش تعداد"
                          >
                            <Plus size={12} />
                          </button>
                          <span className="w-5 text-center text-[0.72rem] font-bold">{toman(qty)}</span>
                          <button
                            type="button"
                            onClick={() => setQty(id, color, qty - 1)}
                            className="grid size-6 place-items-center rounded-lg text-ink transition-colors hover:bg-primary-soft hover:text-primary"
                            aria-label="کاهش تعداد"
                          >
                            <Minus size={12} />
                          </button>
                        </span>
                        <span className="text-[0.74rem] font-bold text-ink">{priceLabel(product.price * qty)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(id, color)}
                      className="self-start rounded-lg p-1 text-muted transition-colors hover:bg-rose-50 hover:text-sale"
                      aria-label="حذف از سبد"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-line bg-[#fbfbfe] px-5 py-4">
              <dl className="space-y-1.5 text-[0.74rem]">
                <div className="flex items-center justify-between text-muted">
                  <dt>جمع کالاها</dt>
                  <dd className="font-semibold text-ink">{priceLabel(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-success">
                    <dt>تخفیف</dt>
                    <dd className="font-semibold">-{priceLabel(discount)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between text-muted">
                  <dt>هزینه ارسال</dt>
                  <dd className="font-semibold text-ink">{shippingCost ? priceLabel(shippingCost) : "رایگان"}</dd>
                </div>
                <div className="!mt-3 flex items-center justify-between border-t border-dashed border-line pt-2.5 text-[0.82rem] font-bold">
                  <dt>مبلغ قابل پرداخت</dt>
                  <dd className="text-primary">{priceLabel(total)}</dd>
                </div>
              </dl>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={() => setCartOpen(false)} className="btn btn-ghost text-[0.74rem]">
                  مشاهده سبد
                </Link>
                <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary text-[0.74rem]">
                  ادامه خرید
                </Link>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-page text-muted">
              <ShoppingCart size={26} />
            </span>
            <p className="text-[0.88rem] font-bold text-ink">سبد خرید شما خالی است</p>
            <p className="text-[0.74rem] leading-6 text-muted">از بین ۷۷ محصول منتخب، چیزی پیدا کنید که دوستش دارید.</p>
            <Link href="/products" onClick={() => setCartOpen(false)} className="btn btn-primary mt-1">
              شروع خرید
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist, user, setCartOpen, logout } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const megaTimer = useRef(null);

  useOutside(accountRef, () => setAccountOpen(false), accountOpen);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const openMega = () => {
    window.clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="hidden bg-ink text-white/65 sm:block">
          <div className="shell flex items-center justify-between py-1.5 text-[0.66rem]">
            <p className="flex items-center gap-1.5">
              <Truck size={13} className="text-[#9F92FF]" />
              ارسال رایگان سفارش‌های بالای ۵ میلیون تومان — گارانتی اصالت کالا
            </p>
            <div className="flex items-center gap-4">
              <Link href="/orders" className="transition-colors hover:text-white">
                پیگیری سفارش
              </Link>
              <Link href="/profile" className="transition-colors hover:text-white">
                حساب من
              </Link>
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#9F92FF]" />
                ۷ روز ضمانت بازگشت
              </span>
            </div>
          </div>
        </div>

        <div className="glass border-b border-line/90">
          <div className="shell flex items-center gap-2.5 py-2.5 lg:gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-ink transition-colors hover:border-primary/35 hover:text-primary lg:hidden"
              aria-label="منوی اصلی"
            >
              <Menu size={18} />
            </button>

            <div className="shrink-0">
              <Logo size="md" showTagline={false} />
            </div>

            <div className="hidden flex-1 md:block">
              <SearchBox />
            </div>

            <div className="ms-auto flex items-center gap-1.5 md:ms-0">
              <div ref={accountRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((open) => !open)}
                  className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-2 text-[0.72rem] font-semibold text-ink transition-all duration-300 hover:border-primary/35 hover:text-primary"
                >
                  <User size={16} />
                  <span className="hidden lg:inline">{user ? user.name.split(" ")[0] : "ورود / ثبت‌نام"}</span>
                  <ChevronDown size={13} className={`hidden transition-transform duration-300 lg:inline ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                {accountOpen && (
                  <div className="absolute left-0 top-[calc(100%+0.5rem)] z-[75] w-48 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_50px_-24px_rgba(21,23,43,.4)] animate-pop">
                    {user ? (
                      <>
                        <div className="px-2.5 py-2">
                          <p className="text-[0.74rem] font-bold text-ink">{user.name}</p>
                          <p className="mt-0.5 text-[0.65rem] text-muted">{user.email}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[0.72rem] text-ink transition-colors hover:bg-page">
                          <User size={14} /> پروفایل من
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[0.72rem] text-ink transition-colors hover:bg-page">
                          <Package size={14} /> سفارش‌های من
                        </Link>
                        {user.role === "admin" && (
                          <Link href="/admin" className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[0.72rem] text-primary transition-colors hover:bg-primary-soft">
                            <LayoutGrid size={14} /> پنل مدیریت
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setAccountOpen(false);
                          }}
                          className="mt-1 flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-[0.72rem] text-sale transition-colors hover:bg-rose-50"
                        >
                          <X size={14} /> خروج از حساب
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" className="block rounded-xl px-2.5 py-2 text-[0.74rem] font-semibold text-ink transition-colors hover:bg-page">
                          ورود به حساب
                        </Link>
                        <Link href="/register" className="mt-0.5 block rounded-xl px-2.5 py-2 text-[0.74rem] text-muted transition-colors hover:bg-page hover:text-ink">
                          ساخت حساب جدید
                        </Link>
                        <p className="mt-1 border-t border-line px-2.5 pt-2 text-[0.62rem] leading-5 text-muted">
                          حساب نمونه: demo@nexora.ir / Demo@1234
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link
                href="/wishlist"
                className="relative grid size-10 place-items-center rounded-xl border border-line bg-white text-ink transition-all duration-300 hover:border-primary/35 hover:text-primary"
                aria-label="علاقه‌مندی‌ها"
              >
                <Heart size={17} />
                {wishlist.length > 0 && (
                  <span className="absolute -left-1 -top-1 grid size-4 place-items-center rounded-full bg-sale text-[0.55rem] font-bold text-white">
                    {toman(wishlist.length)}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="group relative flex h-10 items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#6B57FF_0%,#5B45E8_60%,#4A34D6_100%)] px-3 text-white shadow-[0_12px_26px_-14px_rgba(91,69,232,.95)] transition-all duration-300 hover:shadow-[0_16px_30px_-12px_rgba(91,69,232,.9)] active:scale-95"
                aria-label={`سبد خرید، ${cartCount} کالا`}
              >
                <ShoppingCart size={18} strokeWidth={2.1} className="text-white" />
                <span className="hidden text-[0.72rem] font-semibold lg:inline">سبد خرید</span>
                <span className="grid min-w-5 place-items-center rounded-lg bg-white px-1 py-0.5 text-[0.62rem] font-bold text-primary-dark">
                  {toman(cartCount)}
                </span>
              </button>
            </div>
          </div>

          <div className="shell pb-2.5 md:hidden">
            <SearchBox variant="mobile" onNavigate={() => setMobileOpen(false)} />
          </div>

          <nav className="hidden border-t border-line/80 lg:block">
            <div className="shell flex items-center gap-1 py-0.5">
              <button
                type="button"
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
                onClick={() => setMegaOpen((open) => !open)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-[0.76rem] font-semibold transition-colors duration-300 ${
                  megaOpen ? "bg-primary-soft text-primary" : "text-ink hover:text-primary"
                }`}
              >
                <LayoutGrid size={15} />
                همه دسته‌بندی‌ها
                <ChevronDown size={13} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              <span className="mx-1 h-5 w-px bg-line" />
              {CATEGORIES.slice(0, 7).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onMouseEnter={closeMega}
                  className="rounded-xl px-2.5 py-2.5 text-[0.74rem] text-[#4b5065] transition-colors duration-300 hover:bg-page hover:text-primary"
                >
                  {category.short}
                </Link>
              ))}
              <Link
                href="/products?tag=amazing"
                className="ms-auto flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[0.72rem] font-semibold text-sale transition-colors hover:bg-rose-50"
              >
                <Zap size={14} />
                پیشنهادهای شگفت‌انگیز
              </Link>
            </div>
          </nav>

          {megaOpen && (
            <div onMouseEnter={openMega} onMouseLeave={closeMega}>
              <MegaMenu onClose={() => setMegaOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
          />
          <aside className="absolute inset-y-0 right-0 flex w-[min(20rem,88%)] flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid size-9 place-items-center rounded-xl border border-line text-muted transition-colors hover:text-ink"
                aria-label="بستن"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 px-3 py-3">
              <p className="px-2 pb-1.5 text-[0.65rem] font-semibold text-muted">دسته‌بندی‌ها</p>
              <ul className="space-y-0.5">
                {CATEGORIES.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.id}`}
                      className="flex items-center justify-between rounded-xl px-2.5 py-2.5 text-[0.8rem] font-medium text-ink transition-colors hover:bg-page"
                    >
                      <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: category.color }} />
                        {category.name}
                      </span>
                      <ChevronLeft size={14} className="text-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-4 px-2 pb-1.5 text-[0.65rem] font-semibold text-muted">دسترسی سریع</p>
              <ul className="space-y-0.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="block rounded-xl px-2.5 py-2.5 text-[0.8rem] text-ink transition-colors hover:bg-page">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line p-3">
              {user ? (
                <div className="space-y-2">
                  <Link href="/profile" className="btn btn-soft w-full">
                    <User size={15} /> {user.name}
                  </Link>
                  <Link href="/orders" className="btn btn-ghost w-full text-[0.74rem]">
                    سفارش‌های من
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn btn-ghost text-[0.74rem]">
                    ورود
                  </Link>
                  <Link href="/register" className="btn btn-primary text-[0.74rem]">
                    ثبت‌نام
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      <CartDrawer />
    </>
  );
}
