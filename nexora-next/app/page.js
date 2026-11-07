"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  Undo2,
  Zap,
} from "lucide-react";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { NXArt } from "@/lib/art";
import { discountPercent, priceLabel, toman } from "@/lib/format";
import { useStore } from "@/lib/store";
import ProductCard, { Stars } from "@/components/ProductCard";
import CategoryIcon from "@/components/CategoryIcon";

function SectionHead({ eyebrow, title, subtitle, href = "/products", linkLabel = "مشاهده همه" }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-semibold text-primary">
            <Sparkles size={13} /> {eyebrow}
          </span>
        )}
        <h2 className="text-[1.15rem] font-extrabold tracking-tight text-ink sm:text-[1.35rem]">{title}</h2>
        {subtitle && <p className="mt-1 text-[0.74rem] text-muted">{subtitle}</p>}
      </div>
      <Link
        href={href}
        className="group flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-[0.72rem] font-semibold text-ink transition-all duration-300 hover:border-primary/35 hover:text-primary"
      >
        {linkLabel}
        <ChevronLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
      </Link>
    </div>
  );
}

function Hero() {
  const [index, setIndex] = useState(0);
  const heroProducts = useMemo(() => {
    const flagship = PRODUCTS.filter((p) => p.cat === "mobile" && p.rating >= 4.7).slice(0, 2);
    const laptop = PRODUCTS.filter((p) => p.cat === "laptop").sort((a, b) => b.price - a.price).slice(0, 1);
    const gaming = PRODUCTS.filter((p) => p.cat === "gaming").slice(0, 1);
    return [...flagship, ...laptop, ...gaming].slice(0, 3);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % heroProducts.length), 6000);
    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  const active = heroProducts[index];

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 nx-mesh opacity-70" />
      <div className="absolute inset-0 nx-grid-lines opacity-40" />
      <div className="pointer-events-none absolute -left-24 top-10 size-[26rem] rounded-full bg-primary/30 blur-[120px]" />

      <div className="shell relative grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[0.7rem] font-semibold text-white/85 backdrop-blur">
            <Sparkles size={13} className="text-[#C3B8FF]" />
            فصل جدید تکنولوژی در نکستورا
          </span>

          <h1 className="mt-4 text-[1.85rem] font-extrabold leading-[1.35] tracking-tight sm:text-[2.5rem] lg:text-[2.9rem]">
            خریدی هوشمندتر،
            <br />
            <span className="bg-[linear-gradient(120deg,#B9AEFF_0%,#FFFFFF_45%,#9F92FF_100%)] bg-clip-text text-transparent">
              تجربه‌ای متفاوت از دیجیتال
            </span>
          </h1>

          <p className="mt-4 max-w-md text-[0.82rem] leading-7 text-white/65 sm:text-[0.9rem]">
            ۷۷ محصول منتخب از ۳۴ برند معتبر جهان؛ با گارانتی اصالت کالا، ارسال سریع و امکان بازگشت ۷ روزه. انتخاب
            درست، از همین‌جا شروع می‌شود.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href="/products" className="btn btn-primary !px-5 !py-3 text-[0.82rem]">
              شروع خرید
              <ArrowLeft size={16} />
            </Link>
            <Link
              href="/products?tag=amazing"
              className="btn !px-5 !py-3 text-[0.82rem] border border-white/20 bg-white/5 text-white transition-colors duration-300 hover:bg-white/10"
            >
              <Flame size={16} className="text-[#FFB4A2]" />
              پیشنهادهای شگفت‌انگیز
            </Link>
          </div>

          <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              { value: "۷۷+", label: "محصول منتخب" },
              { value: "۳۴", label: "برند معتبر" },
              { value: "۴.۶", label: "میانگین امتیاز" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 backdrop-blur">
                <dt className="text-[1.05rem] font-extrabold text-white">{stat.value}</dt>
                <dd className="mt-0.5 text-[0.62rem] text-white/50">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-primary/30 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/15 bg-white/[0.06] p-4 backdrop-blur-xl sm:p-6">
            {active && (
              <div key={active.id} className="animate-pop">
                <div className="flex items-center justify-between">
                  <span className="chip bg-white/10 text-white/80">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    {toman(active.rating)} · {toman(active.reviews)} نظر
                  </span>
                  {discountPercent(active.price, active.old) > 0 && (
                    <span className="chip bg-sale text-white">{toman(discountPercent(active.price, active.old))}٪ تخفیف</span>
                  )}
                </div>

                <Link href={`/product/${active.id}`} className="mt-3 block rounded-[1.5rem] bg-white p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={NXArt.product(active, index)}
                    alt={active.name}
                    className="mx-auto aspect-square w-full max-w-[19rem] object-contain transition-transform duration-700 hover:scale-105"
                  />
                </Link>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.62rem] text-white/45">{active.brand}</p>
                    <p className="mt-1 line-clamp-2 text-[0.82rem] font-bold leading-6 text-white">{active.name}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    {active.old > active.price && (
                      <p className="text-[0.62rem] text-white/40 line-through">{toman(active.old)}</p>
                    )}
                    <p className="text-[0.92rem] font-extrabold text-[#C3B8FF]">{priceLabel(active.price)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {heroProducts.map((product, dot) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => setIndex(dot)}
                        aria-label={`اسلاید ${dot + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          dot === index ? "w-7 bg-white" : "w-2.5 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                  <Link href={`/product/${active.id}`} className="btn bg-white !py-2 text-[0.72rem] font-bold text-ink hover:bg-white/90">
                    خرید محصول
                    <ArrowLeft size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-white/15 bg-ink/80 px-3 py-2 backdrop-blur animate-float sm:flex sm:items-center sm:gap-2">
            <Truck size={16} className="text-[#9F92FF]" />
            <div>
              <p className="text-[0.66rem] font-bold text-white">ارسال امروز</p>
              <p className="text-[0.55rem] text-white/45">برای سفارش تا ساعت ۱۵</p>
            </div>
          </div>
        </div>
      </div>

      <div className="shell relative grid grid-cols-2 gap-2 pb-8 sm:grid-cols-4">
        {[
          { icon: ShieldCheck, label: "گارانتی اصالت کالا" },
          { icon: Truck, label: "ارسال سریع و رایگان" },
          { icon: Undo2, label: "۷ روز ضمانت بازگشت" },
          { icon: Headphones, label: "پشتیبانی ۷ روز هفته" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[0.7rem] text-white/70 transition-colors duration-300 hover:bg-white/[0.08]"
          >
            <item.icon size={16} className="shrink-0 text-[#9F92FF]" />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function Countdown() {
  const [left, setLeft] = useState({ h: "۰۶", m: "۵۹", s: "۵۹" });

  useEffect(() => {
    const end = Date.now() + 1000 * 60 * 60 * 6 + 1000 * 59 * 60;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft({ h: toman(h).padStart(2, "۰"), m: toman(m).padStart(2, "۰"), s: toman(s).padStart(2, "۰") });
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1.5">
      {[
        ["ساعت", left.h],
        ["دقیقه", left.m],
        ["ثانیه", left.s],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl border border-white/15 bg-white/10 px-2 py-1 text-center backdrop-blur">
          <p className="text-[0.8rem] font-extrabold tabular-nums text-white">{value}</p>
          <p className="text-[0.5rem] text-white/50">{label}</p>
        </div>
      ))}
    </div>
  );
}

function DealSection() {
  const deals = useMemo(
    () =>
      PRODUCTS.filter((p) => discountPercent(p.price, p.old) >= 15)
        .sort((a, b) => discountPercent(b.price, b.old) - discountPercent(a.price, a.old))
        .slice(0, 4),
    []
  );

  return (
    <section className="shell mt-10">
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-soft">
        <div className="grid lg:grid-cols-[16.5rem_1fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(150deg,#1B1D33_0%,#15172B_60%,#2A1D6E_100%)] p-5 text-white lg:p-6">
            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-sale/25 blur-3xl" />
            <span className="chip bg-sale/15 text-[#FFB4A2]">
              <Flame size={13} /> پیشنهاد شگفت‌انگیز
            </span>
            <h2 className="mt-3 text-[1.35rem] font-extrabold leading-8">تخفیف‌های امروز نکستورا</h2>
            <p className="mt-2 text-[0.74rem] leading-6 text-white/55">فرصت محدود؛ تا پایان شمارش معکوس.</p>
            <div className="mt-4">
              <Countdown />
            </div>
            <Link href="/products?tag=amazing" className="btn mt-5 w-full bg-white !py-2.5 text-[0.75rem] font-bold text-ink hover:bg-white/90">
              مشاهده همه پیشنهادها
              <ChevronLeft size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2.5 sm:gap-3 lg:grid-cols-4 lg:p-3">
            {deals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  return (
    <section className="shell mt-12">
      <SectionHead
        eyebrow="دسته‌بندی‌ها"
        title="از کجا شروع می‌کنید؟"
        subtitle="۱۰ دسته اصلی، همه چیز برای دنیای دیجیتال شما"
        href="/products"
      />
      <div className="stagger grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group nx-card nx-card-hover flex items-center gap-3 p-3.5"
          >
            <span
              className="grid size-11 shrink-0 place-items-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
              style={{ background: `${category.color}14`, color: category.color }}
            >
              <CategoryIcon icon={category.icon} size={20} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[0.78rem] font-bold text-ink transition-colors group-hover:text-primary">
                {category.short}
              </span>
              <span className="mt-0.5 block text-[0.62rem] text-muted">{toman(category.subs.length)} زیردسته</span>
            </span>
            <ChevronLeft size={15} className="ms-auto shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function Rail({ title, eyebrow, subtitle, items, href }) {
  const railRef = useRef(null);
  const scroll = (direction) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section className="shell mt-12">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.68rem] font-semibold text-primary">
            <Sparkles size={13} /> {eyebrow}
          </span>
          <h2 className="text-[1.15rem] font-extrabold text-ink sm:text-[1.35rem]">{title}</h2>
          <p className="mt-1 text-[0.74rem] text-muted">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={href} className="hidden text-[0.72rem] font-semibold text-primary hover:underline sm:block">
            مشاهده همه
          </Link>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="بعدی"
            className="grid size-8 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-primary/35 hover:text-primary"
          >
            <ChevronRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="قبلی"
            className="grid size-8 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-primary/35 hover:text-primary"
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      </div>
      <div ref={railRef} className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2">
        {items.map((product, index) => (
          <div key={product.id} className="w-[10.5rem] shrink-0 snap-start sm:w-[13.5rem]">
            <ProductCard product={product} index={index} compact />
          </div>
        ))}
      </div>
    </section>
  );
}

function Promo() {
  const cards = [
    {
      href: "/category/gaming",
      title: "دنیای گیمینگ",
      text: "کنسول، دسته و هدست گیمینگ با تخفیف ویژه",
      tint: "from-[#2A1D6E] via-[#3B2A9E] to-[#5B45E8]",
      icon: Zap,
      art: PRODUCTS.find((p) => p.cat === "gaming"),
    },
    {
      href: "/category/audio",
      title: "صدای بی‌نقص",
      text: "هدفون، اسپیکر و ساندبار اورجینال",
      tint: "from-[#0F172A] via-[#0E7490] to-[#22D3EE]",
      icon: Headphones,
      art: PRODUCTS.find((p) => p.cat === "audio"),
    },
  ];

  return (
    <section className="shell mt-12 grid gap-3 md:grid-cols-2">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className={`group relative flex min-h-[11rem] items-center overflow-hidden rounded-[1.6rem] bg-gradient-to-l ${card.tint} p-5 text-white shadow-soft transition-shadow duration-500 hover:shadow-lift`}
        >
          <div className="absolute inset-0 nx-grid-lines opacity-30" />
          <div className="relative z-10">
            <span className="chip bg-white/15 text-white">
              <card.icon size={13} /> {card.title}
            </span>
            <p className="mt-3 max-w-[13rem] text-[1.05rem] font-extrabold leading-7">{card.text}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-semibold text-white/85">
              خرید کنید
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </div>
          {card.art && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={NXArt.product(card.art)}
              alt={card.title}
              className="absolute -left-4 bottom-0 h-[9.5rem] w-[9.5rem] object-contain opacity-90 transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-105"
            />
          )}
        </Link>
      ))}
    </section>
  );
}

function BrandStrip() {
  return (
    <section className="shell mt-12">
      <div className="rounded-[1.6rem] border border-line bg-white px-4 py-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-[1rem] font-extrabold text-ink">
            <PackageCheck size={18} className="text-primary" />
            برندهای معتبر
          </h2>
          <span className="text-[0.72rem] text-muted">۳۴ برند در ۱۰ دسته‌بندی</span>
        </div>
        <div className="stagger grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {BRANDS.slice(0, 18).map((brand) => {
            const name = typeof brand === "string" ? brand : brand.name;
            return (
              <Link
                key={name}
                href={`/products?brand=${encodeURIComponent(name)}`}
                className="grid h-12 place-items-center rounded-xl border border-line/80 bg-[#fbfbfe] text-[0.74rem] font-semibold text-[#5b6074] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:text-primary hover:shadow-sm"
              >
                {name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustBand() {
  const { user } = useStore();
  return (
    <section className="shell mt-12">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(120deg,#5B45E8_0%,#4A34D6_55%,#2A1D6E_100%)] p-6 text-white sm:p-8">
        <div className="absolute inset-0 nx-grid-lines opacity-25" />
        <div className="absolute -left-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="chip bg-white/15 text-white">
              <TrendingUp size={13} /> نکستورا کلاب
            </span>
            <h2 className="mt-3 text-[1.2rem] font-extrabold leading-8 sm:text-[1.5rem]">
              {user ? `${user.name} عزیز، امتیازهای شما در حال جمع شدن است` : "با عضویت، ۵۰۰ هزار تومان هدیه بگیرید"}
            </h2>
            <p className="mt-1.5 max-w-lg text-[0.76rem] leading-6 text-white/70">
              عضویت رایگان است؛ با کد <span className="font-bold text-white">WELCOME</span> اولین خریدتان ۵۰۰ هزار تومان
              ارزان‌تر می‌شود.
            </p>
          </div>
          <Link
            href={user ? "/profile" : "/register"}
            className="btn bg-white !px-5 !py-3 text-[0.8rem] font-bold text-primary-dark transition-transform duration-300 hover:scale-[1.02]"
          >
            {user ? "مشاهده حساب" : "عضویت در نکستورا"}
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const bestsellers = useMemo(
    () => PRODUCTS.filter((p) => p.tags?.includes("bestseller")).slice(0, 8),
    []
  );
  const latest = useMemo(() => PRODUCTS.filter((p) => p.tags?.includes("new")).slice(0, 10), []);
  const recommended = useMemo(() => PRODUCTS.filter((p) => p.tags?.includes("recommended")).slice(0, 4), []);

  return (
    <div className="pb-4">
      <Hero />
      <DealSection />
      <CategoryGrid />

      <section className="shell mt-12">
        <SectionHead
          eyebrow="محبوب‌ترین‌ها"
          title="پرفروش‌ترین محصولات"
          subtitle="انتخاب هزاران مشتری نکستورا در ۳۰ روز گذشته"
          href="/products?tag=bestseller"
        />
        <div className="stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {bestsellers.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <Rail
        eyebrow="تازه رسیده‌ها"
        title="جدیدترین محصولات"
        subtitle="اولین نفر باشید که محصولات تازه را می‌بیند"
        items={latest}
        href="/products?tag=new"
      />

      <Promo />

      <section className="shell mt-12">
        <SectionHead
          eyebrow="پیشنهاد نکستورا"
          title="انتخاب سردبیر برای شما"
          subtitle="محصولاتی با بهترین نسبت کیفیت به قیمت"
          href="/products?tag=recommended"
        />
        <div className="stagger grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
          {[...recommended, ...PRODUCTS.filter((p) => p.cat === "wearables").slice(0, 2)].slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>

      <BrandStrip />
      <TrustBand />
    </div>
  );
}
