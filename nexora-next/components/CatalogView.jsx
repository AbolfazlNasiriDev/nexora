"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  ListFilter,
  SearchX,
  SlidersHorizontal,
  Star,
  Tag,
  X,
} from "lucide-react";
import ProductCard, { Stars } from "@/components/ProductCard";
import CategoryIcon from "@/components/CategoryIcon";
import { BRANDS, CATEGORIES, CATEGORY_FILTERS } from "@/lib/catalog";
import { discountPercent, priceLabel, toman } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import { useStore } from "@/lib/store";

const SORTS = [
  { value: "featured", label: "پیشنهاد نکستورا" },
  { value: "newest", label: "جدیدترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "rating", label: "بیشترین امتیاز" },
  { value: "discount", label: "بیشترین تخفیف" },
];

const PRICE_RANGES = [
  { label: "تا ۱۰ میلیون", min: 0, max: 10000000 },
  { label: "۱۰ تا ۳۰ میلیون", min: 10000000, max: 30000000 },
  { label: "۳۰ تا ۷۰ میلیون", min: 30000000, max: 70000000 },
  { label: "بالای ۷۰ میلیون", min: 70000000, max: 0 },
];

function FilterPanel({ view, onNavigate }) {
  const { scope, brands, specGroups, query, activeSpecs, toggleSpec } = view;

  return (
    <div className="space-y-3">
      <div className="nx-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="flex items-center gap-1.5 text-[0.82rem] font-bold text-ink">
            <ListFilter size={15} className="text-primary" />
            فیلترها
          </h3>
          {view.hasFilters && (
            <button type="button" onClick={view.reset} className="text-[0.68rem] font-semibold text-sale hover:underline">
              حذف همه
            </button>
          )}
        </div>

        <div className="space-y-4 p-4">
          <div>
            <p className="mb-2 text-[0.72rem] font-bold text-ink">دسته‌بندی</p>
            <div className="max-h-56 space-y-0.5 overflow-y-auto scroll-thin pl-1">
              {CATEGORIES.map((category) => {
                const checked = query.cat === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => view.setCategory(checked ? "" : category.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-right text-[0.72rem] transition-colors duration-300 ${
                      checked ? "bg-primary-soft font-semibold text-primary" : "text-[#4b5065] hover:bg-page"
                    }`}
                  >
                    <CategoryIcon icon={category.icon} size={14} />
                    {category.name}
                    {checked && <X size={12} className="ms-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-line pt-3">
            <p className="mb-2 text-[0.72rem] font-bold text-ink">برند</p>
            <div className="max-h-48 space-y-1 overflow-y-auto scroll-thin pl-1">
              {brands.map((brand) => (
                <label key={brand.name} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-[0.72rem] text-[#4b5065] transition-colors hover:text-primary">
                  <input
                    type="checkbox"
                    className="nx-check"
                    checked={query.brands.includes(brand.name)}
                    onChange={() => view.toggleBrand(brand.name)}
                  />
                  <span className="flex-1">{brand.name}</span>
                  <span className="text-[0.62rem] text-muted">{toman(brand.count)}</span>
                </label>
              ))}
              {!brands.length && <p className="text-[0.68rem] text-muted">برندی برای این دسته یافت نشد.</p>}
            </div>
          </div>

          <div className="border-t border-line pt-3">
            <p className="mb-2 text-[0.72rem] font-bold text-ink">محدوده قیمت</p>
            <div className="space-y-1">
              {PRICE_RANGES.map((range) => {
                const active = query.min === String(range.min) && query.max === String(range.max);
                return (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => view.setPrice(range.min, range.max)}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-[0.7rem] transition-colors duration-300 ${
                      active ? "bg-primary-soft font-semibold text-primary" : "text-[#4b5065] hover:bg-page"
                    }`}
                  >
                    {range.label}
                    {active && <X size={12} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <input
                value={query.min}
                onChange={(event) => view.setPrice(event.target.value, query.max)}
                inputMode="numeric"
                placeholder="از (تومان)"
                className="nx-input !px-2 !py-1.5 !text-[0.66rem]"
                aria-label="حداقل قیمت"
              />
              <input
                value={query.max}
                onChange={(event) => view.setPrice(query.min, event.target.value)}
                inputMode="numeric"
                placeholder="تا"
                className="nx-input !px-2 !py-1.5 !text-[0.66rem]"
                aria-label="حداکثر قیمت"
              />
            </div>
          </div>

          <div className="border-t border-line pt-3">
            <p className="mb-2 text-[0.72rem] font-bold text-ink">امتیاز</p>
            <div className="space-y-1">
              {[4, 3, 2].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => view.setRating(query.rating === String(value) ? "" : String(value))}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[0.7rem] transition-colors duration-300 ${
                    query.rating === String(value) ? "bg-primary-soft text-primary" : "text-[#4b5065] hover:bg-page"
                  }`}
                >
                  <Stars value={value} size={11} />
                  <span>{toman(value)} ستاره و بالاتر</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-3">
            <label className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-1 text-[0.72rem] text-[#4b5065]">
              فقط کالاهای موجود
              <input
                type="checkbox"
                className="nx-check"
                checked={query.stock === "1"}
                onChange={(event) => view.setParam("stock", event.target.checked ? "1" : "")}
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between rounded-lg px-1 py-1 text-[0.72rem] text-[#4b5065]">
              فقط تخفیف‌دار
              <input
                type="checkbox"
                className="nx-check"
                checked={query.discount === "1"}
                onChange={(event) => view.setParam("discount", event.target.checked ? "1" : "")}
              />
            </label>
          </div>

          {specGroups.length > 0 && (
            <div className="space-y-3 border-t border-line pt-3">
              {specGroups.map((group) => (
                <div key={group.key}>
                  <p className="mb-1.5 text-[0.72rem] font-bold text-ink">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.options.map((option) => {
                      const id = `${group.key}:${option}`;
                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-[0.68rem] text-[#4b5065] transition-colors hover:text-primary"
                        >
                          <input
                            type="checkbox"
                            className="nx-check"
                            checked={activeSpecs.includes(id)}
                            onChange={() => toggleSpec(id)}
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {scope.length === 0 && <p className="text-[0.7rem] text-muted">محصولی با این فیلترها نیست.</p>}
        </div>
      </div>

      <div className="nx-card p-4">
        <p className="flex items-center gap-1.5 text-[0.75rem] font-bold text-ink">
          <Tag size={14} className="text-primary" />
          کد تخفیف دارید؟
        </p>
        <p className="mt-1 text-[0.66rem] leading-5 text-muted">
          کد <span className="font-bold text-primary">WELCOME</span> را در سبد خرید وارد کنید و ۵۰۰ هزار تومان هدیه بگیرید.
        </p>
        <Link href="/cart" onClick={onNavigate} className="btn btn-soft mt-2.5 w-full !text-[0.7rem]">
          رفتن به سبد خرید
        </Link>
      </div>
    </div>
  );
}

export default function CatalogView({ fixedCategory = null, title, subtitle }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);

  const query = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      cat: fixedCategory || searchParams.get("cat") || "",
      sub: searchParams.get("sub") || "",
      brands: searchParams.getAll("brand"),
      min: searchParams.get("min") || "",
      max: searchParams.get("max") || "",
      rating: searchParams.get("rating") || "",
      stock: searchParams.get("stock") || "",
      discount: searchParams.get("discount") || "",
      tag: searchParams.get("tag") || "",
      sort: searchParams.get("sort") || "featured",
      page: Number(searchParams.get("page") || 1),
      specs: searchParams.getAll("f"),
    }),
    [fixedCategory, searchParams]
  );

  const setParams = (patch) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        next.delete(key);
        value.forEach((item) => next.append(key, item));
      } else if (value === "" || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    if (!("page" in patch)) next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const base = useMemo(() => {
    let list = products;
    if (query.q) list = searchProducts(list, query.q, 200);
    if (query.cat) list = list.filter((product) => product.cat === query.cat);
    if (query.sub) list = list.filter((product) => product.sub === query.sub);
    if (query.tag) list = list.filter((product) => (product.tags || []).includes(query.tag));
    return list;
  }, [products, query.cat, query.q, query.sub, query.tag]);

  const brands = useMemo(() => {
    const map = new Map();
    base.forEach((product) => map.set(product.brand, (map.get(product.brand) || 0) + 1));
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [base]);

  const filtered = useMemo(() => {
    let list = [...base];
    if (query.brands.length) list = list.filter((product) => query.brands.includes(product.brand));
    if (query.min) list = list.filter((product) => product.price >= Number(query.min));
    if (query.max && Number(query.max) > 0) list = list.filter((product) => product.price <= Number(query.max));
    if (query.rating) list = list.filter((product) => product.rating >= Number(query.rating));
    if (query.stock === "1") list = list.filter((product) => product.stock > 0);
    if (query.discount === "1") list = list.filter((product) => discountPercent(product.price, product.old) > 0);

    if (query.specs.length) {
      list = list.filter((product) =>
        query.specs.every((entry) => {
          const [key, ...rest] = entry.split(":");
          return product.filters?.[key] === rest.join(":");
        })
      );
    }

    const bySort = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => Number(b.tags?.includes("new")) - Number(a.tags?.includes("new")),
      discount: (a, b) =>
        discountPercent(b.price, b.old) - discountPercent(a.price, a.old),
    };
    return bySort[query.sort] ? list.sort(bySort[query.sort]) : list;
  }, [base, query.brands, query.discount, query.max, query.min, query.rating, query.specs, query.sort, query.stock]);

  const PER_PAGE = 12;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, query.page), pageCount);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const specGroups = useMemo(() => {
    if (query.cat) {
      const groups = CATEGORY_FILTERS[query.cat] || [];
      const available = new Set();
      base.forEach((product) => {
        Object.entries(product.filters || {}).forEach(([key, value]) => available.add(`${key}:${value}`));
      });
      return groups
        .map((group) => ({ ...group, options: group.options.filter((option) => available.has(`${group.key}:${option}`)) }))
        .filter((group) => group.options.length);
    }
    return [];
  }, [base, query.cat]);

  const activeSpecs = query.specs;

  const view = {
    scope: filtered,
    brands,
    specGroups,
    query,
    activeSpecs,
    hasFilters: Boolean(
      query.brands.length || query.min || query.max || query.rating || query.stock || query.discount || activeSpecs.length
    ),
    toggleBrand: (name) => {
      const next = query.brands.includes(name)
        ? query.brands.filter((brand) => brand !== name)
        : [...query.brands, name];
      setParams({ brand: next });
    },
    toggleSpec: (id) => {
      const next = activeSpecs.includes(id) ? activeSpecs.filter((entry) => entry !== id) : [...activeSpecs, id];
      setParams({ f: next });
    },
    setPrice: (min, max) => setParams({ min, max }),
    setRating: (value) => setParams({ rating: value }),
    setCategory: (value) => {
      if (fixedCategory && value && value !== fixedCategory) {
        router.push(`/category/${value}`);
        return;
      }
      if (fixedCategory && !value) {
        router.push("/products");
        return;
      }
      setParams({ cat: value, sub: "", f: [] });
    },
    setParam: (key, value) => setParams({ [key]: value }),
    reset: () => setParams({ brand: [], min: "", max: "", rating: "", stock: "", discount: "", f: [], cat: fixedCategory ? query.cat : "", sub: "" }),
  };

  const category = CATEGORIES.find((item) => item.id === query.cat);
  const heading = title || (category ? category.name : "همه محصولات");
  const description =
    subtitle || (category ? category.desc : "۷۷ محصول منتخب از ۳۴ برند معتبر؛ با فیلترهای دقیق، محصول درست را پیدا کنید.");

  return (
    <div className="shell py-6">
      <nav className="mb-4 flex items-center gap-1.5 text-[0.68rem] text-muted" aria-label="مسیر صفحه">
        <Link href="/" className="transition-colors hover:text-primary">
          خانه
        </Link>
        <ChevronLeft size={12} />
        {category ? (
          <>
            <Link href="/products" className="transition-colors hover:text-primary">
              محصولات
            </Link>
            <ChevronLeft size={12} />
            <span className="text-ink">{category.name}</span>
          </>
        ) : (
          <span className="text-ink">محصولات</span>
        )}
      </nav>

      {category ? (
        <div
          className="relative mb-5 overflow-hidden rounded-[1.6rem] p-5 text-white sm:p-6"
          style={{ background: `linear-gradient(120deg, ${category.color} 0%, #15172B 95%)` }}
        >
          <div className="absolute inset-0 nx-grid-lines opacity-25" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                <CategoryIcon icon={category.icon} size={24} />
              </span>
              <div>
                <h1 className="text-[1.25rem] font-extrabold sm:text-[1.5rem]">{category.name}</h1>
                <p className="mt-1 max-w-xl text-[0.72rem] leading-6 text-white/70">{category.desc}</p>
              </div>
            </div>
            <span className="chip bg-white/15 text-white">{toman(filtered.length)} محصول</span>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-1.5">
            {category.subs.slice(0, 8).map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setParams({ sub: query.sub === sub.id ? "" : sub.id })}
                className={`chip border transition-all duration-300 ${
                  query.sub === sub.id
                    ? "border-white bg-white font-bold text-ink"
                    : "border-white/25 bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <h1 className="text-[1.35rem] font-extrabold text-ink sm:text-[1.6rem]">{heading}</h1>
          <p className="mt-1.5 max-w-2xl text-[0.76rem] leading-6 text-muted">{description}</p>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <FilterPanel view={view} />
          </div>
        </aside>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white px-3 py-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-1.5 text-[0.72rem] font-semibold text-ink transition-colors hover:border-primary/35 hover:text-primary lg:hidden"
              >
                <Filter size={14} />
                فیلترها
                {view.hasFilters && <span className="size-1.5 rounded-full bg-primary" />}
              </button>
              <span className="flex items-center gap-1 text-[0.7rem] text-muted">
                <LayoutGrid size={14} />
                {toman(filtered.length)} محصول
              </span>
            </div>
            <label className="flex items-center gap-1.5 text-[0.7rem] text-muted">
              <SlidersHorizontal size={14} />
              مرتب‌سازی:
              <select
                value={query.sort}
                onChange={(event) => setParams({ sort: event.target.value })}
                className="rounded-lg border border-line bg-white px-2 py-1 text-[0.7rem] font-semibold text-ink outline-none transition-colors hover:border-primary/35"
                aria-label="مرتب‌سازی محصولات"
              >
                {SORTS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {(query.brands.length > 0 || query.specs.length > 0 || query.tag || query.q || query.rating || query.stock) && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {query.q && (
                <button type="button" onClick={() => setParams({ q: "" })} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  جستجو: {query.q} <X size={11} />
                </button>
              )}
              {query.tag && (
                <button type="button" onClick={() => setParams({ tag: "" })} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  برچسب: {query.tag} <X size={11} />
                </button>
              )}
              {query.brands.map((brand) => (
                <button key={brand} type="button" onClick={() => view.toggleBrand(brand)} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  {brand} <X size={11} />
                </button>
              ))}
              {query.specs.map((spec) => (
                <button key={spec} type="button" onClick={() => view.toggleSpec(spec)} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  {spec.split(":")[1]} <X size={11} />
                </button>
              ))}
              {query.rating && (
                <button type="button" onClick={() => setParams({ rating: "" })} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  <Star size={11} /> {toman(query.rating)}+ <X size={11} />
                </button>
              )}
              {query.stock === "1" && (
                <button type="button" onClick={() => setParams({ stock: "" })} className="chip border border-line bg-white text-ink hover:border-primary/40">
                  موجود <X size={11} />
                </button>
              )}
            </div>
          )}

          {visible.length ? (
            <div className="stagger grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-3">
              {visible.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} compact />
              ))}
            </div>
          ) : (
            <div className="nx-card flex flex-col items-center justify-center gap-2 px-5 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-page text-muted">
                <SearchX size={24} />
              </span>
              <p className="text-[0.9rem] font-bold text-ink">محصولی پیدا نشد</p>
              <p className="max-w-xs text-[0.72rem] leading-6 text-muted">
                فیلترها را ساده‌تر کنید یا عبارت دیگری جستجو کنید.
              </p>
              <button type="button" onClick={view.reset} className="btn btn-primary mt-2 !text-[0.74rem]">
                حذف فیلترها
              </button>
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setParams({ page: page - 1 })}
                className="grid size-9 place-items-center rounded-xl border border-line bg-white text-ink transition-colors disabled:opacity-40 hover:border-primary/35 hover:text-primary"
                aria-label="صفحه قبل"
              >
                <ChevronRight size={16} />
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1)
                .filter((number) => Math.abs(number - page) < 2 || number === 1 || number === pageCount)
                .map((number, index, arr) => (
                  <span key={number} className="flex items-center gap-1.5">
                    {index > 0 && arr[index - 1] !== number - 1 && <span className="text-muted">…</span>}
                    <button
                      type="button"
                      onClick={() => setParams({ page: number })}
                      className={`size-9 rounded-xl border text-[0.74rem] font-semibold transition-all duration-300 ${
                        number === page
                          ? "border-primary bg-primary text-white shadow-[0_8px_18px_-10px_rgba(91,69,232,.9)]"
                          : "border-line bg-white text-ink hover:border-primary/35 hover:text-primary"
                      }`}
                    >
                      {toman(number)}
                    </button>
                  </span>
                ))}
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setParams({ page: page + 1 })}
                className="grid size-9 place-items-center rounded-xl border border-line bg-white text-ink transition-colors disabled:opacity-40 hover:border-primary/35 hover:text-primary"
                aria-label="صفحه بعد"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-[115] lg:hidden">
          <button type="button" aria-label="بستن فیلترها" onClick={() => setSheetOpen(false)} className="absolute inset-0 bg-ink/45 backdrop-blur-sm" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[1.6rem] bg-page p-3 shadow-2xl animate-pop">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[0.85rem] font-bold text-ink">فیلتر محصولات</p>
              <button type="button" onClick={() => setSheetOpen(false)} className="grid size-8 place-items-center rounded-xl border border-line bg-white" aria-label="بستن">
                <X size={15} />
              </button>
            </div>
            <FilterPanel view={view} onNavigate={() => setSheetOpen(false)} />
            <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-primary mt-2 w-full">
              نمایش {toman(filtered.length)} محصول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
