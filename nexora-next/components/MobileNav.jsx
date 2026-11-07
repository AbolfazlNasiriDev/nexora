"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { toman } from "@/lib/format";

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount, wishlist, user, setCartOpen } = useStore();

  if (pathname?.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "خانه", icon: Home, active: pathname === "/" },
    { href: "/products", label: "محصولات", icon: LayoutGrid, active: pathname?.startsWith("/products") || pathname?.startsWith("/category") },
    { href: "/wishlist", label: "علاقه‌مندی", icon: Heart, active: pathname === "/wishlist", badge: wishlist.length },
    { href: "/cart", label: "سبد", icon: ShoppingCart, active: pathname === "/cart" },
    { href: user ? "/profile" : "/login", label: user ? "حساب" : "ورود", icon: User, active: pathname === "/profile" || pathname === "/login" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[95] border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-1.5">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center gap-1 rounded-xl py-1.5 text-[0.6rem] font-medium transition-colors duration-300 ${
              item.active ? "text-primary" : "text-muted"
            }`}
          >
            <span className={`grid size-9 place-items-center rounded-xl transition-all duration-300 ${item.active ? "bg-primary-soft" : ""}`}>
              <item.icon size={18} className={item.active ? "text-primary" : "text-[#8b90a3]"} />
              {!!item.badge && (
                <span className="absolute right-4 top-0.5 grid size-4 place-items-center rounded-full bg-sale text-[0.5rem] font-bold text-white">
                  {toman(item.badge)}
                </span>
              )}
            </span>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
