import { Suspense } from "react";
import ProductView from "@/components/ProductView";

export const metadata = {
  title: "جزئیات محصول",
  description: "مشخصات کامل، قیمت و نظرات کاربران درباره محصولات نکستورا.",
};

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="shell py-16 text-center text-[0.8rem] text-muted">در حال بارگذاری محصول…</div>}>
      <ProductView />
    </Suspense>
  );
}
