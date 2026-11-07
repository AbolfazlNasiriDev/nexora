import { Suspense } from "react";
import CatalogView from "@/components/CatalogView";

export const metadata = {
  title: "همه محصولات",
  description: "فهرست کامل محصولات نکستورا با فیلتر برند، قیمت، امتیاز و مشخصات فنی.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="shell py-16 text-center text-[0.8rem] text-muted">در حال بارگذاری محصولات…</div>}>
      <CatalogView />
    </Suspense>
  );
}
