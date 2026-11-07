"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import { CATEGORY_MAP } from "@/lib/catalog";

function CategoryContent() {
  const { slug } = useParams();
  const category = CATEGORY_MAP[slug];

  if (!category) {
    return (
      <div className="shell py-20 text-center">
        <p className="text-[1rem] font-bold text-ink">این دسته‌بندی پیدا نشد</p>
        <p className="mt-2 text-[0.78rem] text-muted">آدرس را بررسی کنید یا از فهرست دسته‌بندی‌ها انتخاب کنید.</p>
        <Link href="/products" className="btn btn-primary mt-4">
          همه محصولات
        </Link>
      </div>
    );
  }

  return <CatalogView fixedCategory={category.id} />;
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="shell py-16 text-center text-[0.8rem] text-muted">در حال بارگذاری دسته‌بندی…</div>}>
      <CategoryContent />
    </Suspense>
  );
}
