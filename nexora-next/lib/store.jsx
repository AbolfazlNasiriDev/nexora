"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PRODUCTS, getProducts, saveProducts } from "@/lib/catalog";
import { orderCode } from "@/lib/format";

const KEYS = {
  cart: "nexora_cart",
  wishlist: "nexora_wishlist",
  compare: "nexora_compare",
  session: "nexora_session",
  orders: "nexora_orders",
  coupon: "nexora_coupon",
  shipping: "nexora_shipping",
  users: "nexora_users",
  reviews: "nexora_reviews",
  newsletter: "nexora_newsletter",
};

export const DEMO_USERS = [
  {
    id: "u-admin",
    name: "مدیر نکستورا",
    email: "admin@nexora.ir",
    password: "Admin@1234",
    role: "admin",
    phone: "۰۹۱۲۰۰۰۰۰۰۰",
    city: "تهران",
    address: "خیابان ولیعصر، برج نکستورا، طبقه ۱۲",
    postalCode: "1968913751",
  },
  {
    id: "u-demo",
    name: "سارا محمدی",
    email: "demo@nexora.ir",
    password: "Demo@1234",
    role: "customer",
    phone: "۰۹۳۵۱۲۳۴۵۶۷",
    city: "تهران",
    address: "سعادت‌آباد، بلوار دریا، کوچه ۱۲، پلاک ۸",
    postalCode: "1998745123",
  },
];

const read = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — demo keeps working in memory */
  }
};

const COUPONS = {
  NEXORA10: { type: "percent", value: 10, max: 5000000, label: "۱۰٪ تخفیف (سقف ۵٬۰۰۰٬۰۰۰ تومان)" },
  NEXORA5: { type: "percent", value: 5, max: 2000000, label: "۵٪ تخفیف" },
  WELCOME: { type: "amount", value: 500000, label: "۵۰۰٬۰۰۰ تومان تخفیف خوش‌آمدگویی" },
};

const SHIPPING = {
  standard: { label: "ارسال عادی (۲ تا ۴ روز کاری)", price: 89000 },
  express: { label: "ارسال سریع (امروز تا ۳ ساعت)", price: 149000 },
};

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [compare, setCompare] = useState([]);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [orders, setOrders] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [shipping, setShipping] = useState("standard");
  const [products, setProducts] = useState(PRODUCTS);
  const [reviews, setReviews] = useState({});
  const [toasts, setToasts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const toastId = useRef(0);

  /* hydrate once on the client */
  useEffect(() => {
    setCart(read(KEYS.cart, []));
    setWishlist(read(KEYS.wishlist, []));
    setCompare(read(KEYS.compare, []));
    setUser(read(KEYS.session, null));
    setUsers(read(KEYS.users, DEMO_USERS));
    setOrders(read(KEYS.orders, []));
    setCoupon(read(KEYS.coupon, null));
    setShipping(read(KEYS.shipping, "standard"));
    setProducts(getProducts());
    setReviews(read(KEYS.reviews, {}));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) write(KEYS.cart, cart); }, [ready, cart]);
  useEffect(() => { if (ready) write(KEYS.wishlist, wishlist); }, [ready, wishlist]);
  useEffect(() => { if (ready) write(KEYS.compare, compare); }, [ready, compare]);
  useEffect(() => { if (ready) write(KEYS.session, user); }, [ready, user]);
  useEffect(() => { if (ready) write(KEYS.orders, orders); }, [ready, orders]);
  useEffect(() => { if (ready) write(KEYS.coupon, coupon); }, [ready, coupon]);
  useEffect(() => { if (ready) write(KEYS.shipping, shipping); }, [ready, shipping]);
  useEffect(() => { if (ready) write(KEYS.reviews, reviews); }, [ready, reviews]);
  useEffect(() => {
    if (!ready) return;
    write(KEYS.users, users);
  }, [ready, users]);

  const toast = useCallback((message, type = "info") => {
    toastId.current += 1;
    const id = toastId.current;
    setToasts((list) => [...list, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const findProduct = useCallback((id) => products.find((p) => p.id === id) || null, [products]);

  const addToCart = useCallback(
    (id, qty = 1, options = {}) => {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const rawColor = options.color || (product.colors && product.colors[0]) || null;
      const color = rawColor && typeof rawColor === "object" ? rawColor.name : rawColor;
      setCart((list) => {
        const idx = list.findIndex((item) => item.id === id && item.color === color);
        if (idx > -1) {
          const next = [...list];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...list, { id, qty, color }];
      });
      toast(`«${product.name.slice(0, 42)}...» به سبد خرید اضافه شد`, "success");
      setCartOpen(true);
    },
    [products, toast]
  );

  const setQty = useCallback((id, color, qty) => {
    setCart((list) =>
      list
        .map((item) => (item.id === id && item.color === color ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item))
        .filter((item) => item.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((id, color) => {
    setCart((list) => list.filter((item) => !(item.id === id && item.color === color)));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((list) => {
        const exists = list.includes(id);
        toast(exists ? "از علاقه‌مندی‌ها حذف شد" : "به علاقه‌مندی‌ها اضافه شد", exists ? "info" : "success");
        return exists ? list.filter((item) => item !== id) : [...list, id];
      });
    },
    [toast]
  );

  const toggleCompare = useCallback(
    (id) => {
      setCompare((list) => {
        if (list.includes(id)) {
          toast("از لیست مقایسه حذف شد", "info");
          return list.filter((item) => item !== id);
        }
        if (list.length >= 4) {
          toast("حداکثر ۴ محصول را می‌توان مقایسه کرد", "error");
          return list;
        }
        toast("به لیست مقایسه اضافه شد", "success");
        return [...list, id];
      });
    },
    [toast]
  );

  const login = useCallback(
    (email, password) => {
      const found = users.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
      if (!found) return { ok: false, message: "کاربری با این ایمیل پیدا نشد" };
      if (found.password !== password) return { ok: false, message: "رمز عبور نادرست است" };
      setUser(found);
      toast(`خوش آمدید، ${found.name}`, "success");
      return { ok: true, user: found };
    },
    [users, toast]
  );

  const register = useCallback(
    (payload) => {
      if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
        return { ok: false, message: "این ایمیل قبلاً ثبت شده است" };
      }
      const created = {
        id: `u-${Date.now()}`,
        role: "customer",
        city: "تهران",
        address: "",
        postalCode: "",
        ...payload,
      };
      setUsers((list) => [...list, created]);
      setUser(created);
      toast("حساب شما ساخته شد", "success");
      return { ok: true, user: created };
    },
    [users, toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    toast("از حساب خود خارج شدید", "info");
  }, [toast]);

  const updateProfile = useCallback(
    (patch) => {
      setUser((current) => {
        if (!current) return current;
        const next = { ...current, ...patch };
        setUsers((list) => list.map((u) => (u.id === current.id ? { ...u, ...patch } : u)));
        return next;
      });
      toast("اطلاعات حساب ذخیره شد", "success");
    },
    [toast]
  );

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const applyCoupon = useCallback((code, subtotal) => {
    const key = String(code || "").trim().toUpperCase();
    if (!key) return { ok: false, message: "کد تخفیف را وارد کنید" };
    const found = COUPONS[key];
    if (!found) return { ok: false, message: "این کد تخفیف معتبر نیست" };
    const amount =
      found.type === "percent" ? Math.min(Math.round((subtotal * found.value) / 100), found.max) : found.value;
    if (amount >= subtotal) return { ok: false, message: "این کد برای این سبد قابل استفاده نیست" };
    setCoupon({ code: key, amount, label: found.label });
    return { ok: true, coupon: { code: key, amount, label: found.label } };
  }, []);

  const items = useMemo(
    () =>
      cart
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
          return product ? { ...item, product, line: product.price * item.qty } : null;
        })
        .filter(Boolean),
    [cart, products]
  );

  const subtotal = items.reduce((sum, item) => sum + item.line, 0);
  const discount = coupon ? Math.min(coupon.amount, subtotal) : 0;
  const shippingCost = items.length ? SHIPPING[shipping]?.price ?? 0 : 0;
  const total = Math.max(0, subtotal - discount + shippingCost);
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  const placeOrder = useCallback(
    (payload) => {
      const order = {
        id: `o-${Date.now()}`,
        code: orderCode(),
        userId: user?.id || null,
        customer: payload.customer,
        items: items.map((item) => ({
          id: item.id,
          name: item.product.name,
          price: item.product.price,
          qty: item.qty,
          color: item.color,
        })),
        subtotal,
        discount,
        shippingCost,
        total,
        coupon: coupon?.code || null,
        shipping,
        payment: payload.payment,
        address: payload.address,
        note: payload.note || "",
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setOrders((list) => [order, ...list]);
      setCart([]);
      setCoupon(null);
      return order;
    },
    [coupon, discount, items, shipping, shippingCost, subtotal, total, user]
  );

  const setOrderStatus = useCallback((id, status) => {
    setOrders((list) => list.map((order) => (order.id === id ? { ...order, status } : order)));
  }, []);

  const addReview = useCallback(
    (productId, review) => {
      setReviews((map) => ({
        ...map,
        [productId]: [{ ...review, id: `r-${Date.now()}`, date: new Date().toISOString() }, ...(map[productId] || [])],
      }));
      toast("نظر شما ثبت شد", "success");
    },
    [toast]
  );

  const saveProduct = useCallback(
    (raw) => {
      setProducts((list) => {
        const exists = list.some((p) => p.id === raw.id);
        const next = exists ? list.map((p) => (p.id === raw.id ? { ...p, ...raw } : p)) : [{ ...raw }, ...list];
        saveProducts(next);
        return next;
      });
      toast(raw.__new ? "محصول جدید اضافه شد" : "محصول ویرایش شد", "success");
    },
    [toast]
  );

  const deleteProduct = useCallback(
    (id) => {
      setProducts((list) => {
        const next = list.filter((p) => p.id !== id);
        saveProducts(next);
        return next;
      });
      toast("محصول حذف شد", "info");
    },
    [toast]
  );

  const subscribe = useCallback(
    (email) => {
      const clean = String(email || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) return { ok: false, message: "ایمیل معتبر نیست" };
      const list = read(KEYS.newsletter, []);
      if (list.includes(clean)) return { ok: false, message: "این ایمیل قبلاً عضو شده است" };
      write(KEYS.newsletter, [...list, clean]);
      toast("عضویت شما در خبرنامه ثبت شد", "success");
      return { ok: true };
    },
    [toast]
  );

  const value = {
    ready,
    products,
    cart,
    items,
    cartCount,
    subtotal,
    discount,
    shippingCost,
    total,
    coupon,
    shipping,
    shippingOptions: SHIPPING,
    user,
    users,
    orders,
    reviews,
    wishlist,
    compare,
    toasts,
    cartOpen,
    setCartOpen,
    findProduct,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    toggleCompare,
    login,
    register,
    logout,
    updateProfile,
    applyCoupon,
    removeCoupon,
    setShipping,
    placeOrder,
    setOrderStatus,
    addReview,
    saveProduct,
    deleteProduct,
    subscribe,
    toast,
    dismissToast,
    setProducts,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
