/* ==========================================================================
   NEXORA — Application state (cart, wishlist, compare, demo auth, orders)
   Loaded on every page after products.js and before app.js.
   ========================================================================== */

const NX_KEYS = {
  cart: 'nexora_cart',
  wishlist: 'nexora_wishlist',
  compare: 'nexora_compare',
  coupon: 'nexora_coupon',
  shipping: 'nexora_shipping',
  users: 'nexora_users',
  session: 'nexora_session',
  orders: 'nexora_orders',
  addresses: 'nexora_addresses',
  reviews: 'nexora_reviews',
  newsletter: 'nexora_newsletter',
  seeded: 'nexora_seeded_v1'
};

const NX_FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function nxFa(value) {
  return String(value ?? '').replace(/\d/g, (d) => NX_FA_DIGITS[Number(d)]);
}

function nxNumber(value) {
  const n = Number(value || 0);
  return nxFa(n.toLocaleString('en-US'));
}

function nxToman(value) {
  return `${nxNumber(value)} <span class="text-[10px] font-medium text-muted">تومان</span>`;
}

function nxDate(iso) {
  try {
    return new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
  } catch (e) {
    return nxFa(iso || '');
  }
}

function nxEscape(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nxQ(name) {
  return new URLSearchParams(location.search).get(name);
}

/* --------------------------------- cart ---------------------------------- */
const NX_FREE_SHIPPING_MIN = 5000000;
const NX_SHIPPING = {
  normal: { label: 'ارسال عادی', price: 45000, time: '۲ تا ۴ روز کاری' },
  express: { label: 'ارسال سریع', price: 95000, time: 'کمتر از ۲۴ ساعت در تهران' }
};

const NX_COUPONS = {
  NEXORA10: { code: 'NEXORA10', percent: 10, max: 5000000, min: 1000000, label: '۱۰٪ تخفیف (حداکثر ۵ میلیون تومان)' },
  WELCOME5: { code: 'WELCOME5', percent: 5, max: 2000000, min: 0, label: '۵٪ تخفیف خوش‌آمدگویی' },
  GAMING15: { code: 'GAMING15', percent: 15, max: 8000000, min: 20000000, label: '۱۵٪ تخفیف خرید بالای ۲۰ میلیون تومان' }
};

const nxCart = {
  list() {
    const items = nxRead(NX_KEYS.cart, []);
    return Array.isArray(items) ? items.filter((i) => findProduct(i.id)) : [];
  },
  save(items) {
    nxWrite(NX_KEYS.cart, items);
    document.dispatchEvent(new CustomEvent('nx:cart'));
  },
  keyFor(id, color, warranty) {
    return [id, color || '', warranty || ''].join('|');
  },
  add(id, options = {}) {
    const product = findProduct(id);
    if (!product) return { ok: false, message: 'محصول یافت نشد.' };
    if (product.stock <= 0) return { ok: false, message: 'این محصول فعلاً موجود نیست.' };

    const color = options.color || (product.colors[0] ? product.colors[0].name : '');
    const warranty = options.warranty || product.warranties[0];
    const qty = Math.max(1, Number(options.qty) || 1);
    const key = nxCart.keyFor(id, color, warranty);
    const items = nxCart.list();
    const existing = items.find((i) => i.key === key);

    if (existing) {
      existing.qty = Math.min(product.stock, existing.qty + qty);
    } else {
      items.push({ key, id, qty: Math.min(product.stock, qty), color, warranty });
    }
    nxCart.save(items);
    return { ok: true, message: 'محصول به سبد خرید اضافه شد.', product };
  },
  setQty(key, qty) {
    const items = nxCart.list();
    const item = items.find((i) => i.key === key);
    if (!item) return;
    const product = findProduct(item.id);
    const next = Math.max(0, Math.min(product ? product.stock : 99, Number(qty) || 0));
    if (next === 0) {
      nxCart.remove(key);
      return;
    }
    item.qty = next;
    nxCart.save(items);
  },
  inc(key) {
    const item = nxCart.list().find((i) => i.key === key);
    if (item) nxCart.setQty(key, item.qty + 1);
  },
  dec(key) {
    const item = nxCart.list().find((i) => i.key === key);
    if (item) nxCart.setQty(key, item.qty - 1);
  },
  remove(key) {
    nxCart.save(nxCart.list().filter((i) => i.key !== key));
  },
  clear() {
    nxCart.save([]);
    nxSetCoupon(null);
  },
  detailed() {
    return nxCart.list().map((item) => ({ ...item, product: findProduct(item.id) })).filter((i) => i.product);
  },
  count() {
    return nxCart.list().reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  },
  isEmpty() {
    return nxCart.count() === 0;
  }
};

function nxShippingMethod() {
  const m = nxRead(NX_KEYS.shipping, 'normal');
  return NX_SHIPPING[m] ? m : 'normal';
}

function nxSetShipping(method) {
  nxWrite(NX_KEYS.shipping, method);
  document.dispatchEvent(new CustomEvent('nx:cart'));
}

function nxSetCoupon(coupon) {
  if (coupon) nxWrite(NX_KEYS.coupon, coupon);
  else localStorage.removeItem(NX_KEYS.coupon);
  document.dispatchEvent(new CustomEvent('nx:cart'));
}

function nxApplyCoupon(code, subtotal) {
  const clean = String(code || '').trim().toUpperCase();
  const found = NX_COUPONS[clean];
  if (!found) return { ok: false, message: 'کد تخفیف معتبر نیست.' };
  if (subtotal < found.min) {
    return { ok: false, message: `حداقل مبلغ خرید برای این کد ${nxNumber(found.min)} تومان است.` };
  }
  const amount = Math.min(Math.round((subtotal * found.percent) / 100), found.max);
  const coupon = { code: found.code, percent: found.percent, amount, label: found.label };
  nxSetCoupon(coupon);
  return { ok: true, message: `کد تخفیف اعمال شد: ${found.label}`, coupon };
}

function nxCartTotals() {
  const items = nxCart.detailed();
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const oldTotal = items.reduce((s, i) => s + (i.product.oldPrice || i.product.price) * i.qty, 0);
  const productDiscount = Math.max(0, oldTotal - subtotal);
  const savedCoupon = nxRead(NX_KEYS.coupon, null);
  const couponDiscount = savedCoupon && subtotal > 0 ? Math.min(savedCoupon.amount || 0, subtotal) : 0;
  const method = nxShippingMethod();
  let shipping = 0;
  if (items.length) {
    shipping = method === 'express' ? NX_SHIPPING.express.price : NX_SHIPPING.normal.price;
    if (subtotal >= NX_FREE_SHIPPING_MIN && method === 'normal') shipping = 0;
  }
  const total = Math.max(0, subtotal - couponDiscount + shipping);
  return {
    items,
    count: items.reduce((s, i) => s + i.qty, 0),
    subtotal,
    oldTotal,
    productDiscount,
    coupon: savedCoupon,
    couponDiscount,
    shipping,
    shippingMethod: method,
    total,
    saved: productDiscount + couponDiscount
  };
}

/* ---------------------------- wishlist & compare ------------------------- */
const nxWishlist = {
  list() {
    const ids = nxRead(NX_KEYS.wishlist, []);
    return Array.isArray(ids) ? ids : [];
  },
  has(id) {
    return nxWishlist.list().includes(id);
  },
  toggle(id) {
    const ids = nxWishlist.list();
    const exists = ids.includes(id);
    const next = exists ? ids.filter((x) => x !== id) : [...ids, id];
    nxWrite(NX_KEYS.wishlist, next);
    document.dispatchEvent(new CustomEvent('nx:wishlist'));
    return { added: !exists };
  },
  remove(id) {
    nxWrite(NX_KEYS.wishlist, nxWishlist.list().filter((x) => x !== id));
    document.dispatchEvent(new CustomEvent('nx:wishlist'));
  },
  products() {
    return nxWishlist.list().map((id) => findProduct(id)).filter(Boolean);
  },
  count() {
    return nxWishlist.list().length;
  }
};

const nxCompare = {
  max: 4,
  list() {
    const ids = nxRead(NX_KEYS.compare, []);
    return Array.isArray(ids) ? ids : [];
  },
  has(id) {
    return nxCompare.list().includes(id);
  },
  toggle(id) {
    const ids = nxCompare.list();
    if (ids.includes(id)) {
      nxWrite(NX_KEYS.compare, ids.filter((x) => x !== id));
      document.dispatchEvent(new CustomEvent('nx:compare'));
      return { added: false };
    }
    if (ids.length >= nxCompare.max) {
      return { added: false, error: `حداکثر ${nxFa(nxCompare.max)} محصول را می‌توانید مقایسه کنید.` };
    }
    nxWrite(NX_KEYS.compare, [...ids, id]);
    document.dispatchEvent(new CustomEvent('nx:compare'));
    return { added: true };
  },
  remove(id) {
    nxWrite(NX_KEYS.compare, nxCompare.list().filter((x) => x !== id));
    document.dispatchEvent(new CustomEvent('nx:compare'));
  },
  clear() {
    nxWrite(NX_KEYS.compare, []);
    document.dispatchEvent(new CustomEvent('nx:compare'));
  },
  products() {
    return nxCompare.list().map((id) => findProduct(id)).filter(Boolean);
  }
};

/* ------------------------------- demo auth -------------------------------- */
function nxHash(text) {
  let hash = 5381;
  const salt = 'nexora-demo';
  const value = salt + String(text);
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
  }
  return 'nx' + (hash >>> 0).toString(36);
}

const nxAuth = {
  users() {
    const users = nxRead(NX_KEYS.users, null);
    return Array.isArray(users) ? users : [];
  },
  saveUsers(users) {
    nxWrite(NX_KEYS.users, users);
  },
  userById(id) {
    return nxAuth.users().find((u) => u.id === id) || null;
  },
  current() {
    const session = nxRead(NX_KEYS.session, null);
    if (!session || !session.userId) return null;
    return nxAuth.userById(session.userId);
  },
  isAdmin() {
    const user = nxAuth.current();
    return !!(user && user.isAdmin);
  },
  login(identifier, password) {
    const id = String(identifier || '').trim().toLowerCase();
    const user = nxAuth.users().find(
      (u) => u.email.toLowerCase() === id || u.phone === identifier.trim()
    );
    if (!user) return { ok: false, message: 'کاربری با این ایمیل یا شماره موبایل پیدا نشد.' };
    if (user.passwordHash !== nxHash(password)) return { ok: false, message: 'رمز عبور اشتباه است.' };
    nxWrite(NX_KEYS.session, { userId: user.id, at: new Date().toISOString() });
    document.dispatchEvent(new CustomEvent('nx:auth'));
    return { ok: true, user, message: `${user.firstName} عزیز، خوش آمدید.` };
  },
  register(data) {
    const users = nxAuth.users();
    const email = String(data.email || '').trim().toLowerCase();
    const phone = String(data.phone || '').trim();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, message: 'این ایمیل قبلاً ثبت شده است.' };
    }
    if (users.some((u) => u.phone === phone)) {
      return { ok: false, message: 'این شماره موبایل قبلاً ثبت شده است.' };
    }
    const user = {
      id: 'u-' + Date.now().toString(36),
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      phone,
      passwordHash: nxHash(data.password),
      isAdmin: false,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    nxAuth.saveUsers(users);
    nxWrite(NX_KEYS.session, { userId: user.id, at: new Date().toISOString() });
    document.dispatchEvent(new CustomEvent('nx:auth'));
    return { ok: true, user, message: 'حساب کاربری با موفقیت ساخته شد.' };
  },
  logout() {
    localStorage.removeItem(NX_KEYS.session);
    document.dispatchEvent(new CustomEvent('nx:auth'));
  },
  updateProfile(patch) {
    const current = nxAuth.current();
    if (!current) return { ok: false, message: 'برای ویرایش پروفایل باید وارد شوید.' };
    const users = nxAuth.users().map((u) => (u.id === current.id ? { ...u, ...patch } : u));
    nxAuth.saveUsers(users);
    document.dispatchEvent(new CustomEvent('nx:auth'));
    return { ok: true, message: 'اطلاعات حساب ذخیره شد.' };
  }
};

/* -------------------------------- addresses ------------------------------- */
const nxAddresses = {
  all() {
    const list = nxRead(NX_KEYS.addresses, []);
    return Array.isArray(list) ? list : [];
  },
  mine() {
    const user = nxAuth.current();
    if (!user) return [];
    return nxAddresses.all().filter((a) => a.userId === user.id);
  },
  add(address) {
    const user = nxAuth.current();
    if (!user) return { ok: false, message: 'برای ثبت آدرس باید وارد شوید.' };
    const list = nxAddresses.all();
    const item = {
      id: 'a-' + Date.now().toString(36),
      userId: user.id,
      isDefault: list.filter((a) => a.userId === user.id).length === 0,
      ...address
    };
    list.push(item);
    nxWrite(NX_KEYS.addresses, list);
    return { ok: true, message: 'آدرس جدید ذخیره شد.', address: item };
  },
  remove(id) {
    nxWrite(NX_KEYS.addresses, nxAddresses.all().filter((a) => a.id !== id));
  },
  setDefault(id) {
    const user = nxAuth.current();
    if (!user) return;
    const list = nxAddresses.all().map((a) =>
      a.userId === user.id ? { ...a, isDefault: a.id === id } : a
    );
    nxWrite(NX_KEYS.addresses, list);
  }
};

/* --------------------------------- orders --------------------------------- */
const NX_ORDER_STATUS = {
  processing: { label: 'در حال پردازش', tone: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped: { label: 'ارسال شده', tone: 'bg-sky-50 text-sky-700 border-sky-200' },
  delivered: { label: 'تحویل داده شده', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  canceled: { label: 'لغو شده', tone: 'bg-rose-50 text-rose-700 border-rose-200' }
};

const nxOrders = {
  all() {
    const list = nxRead(NX_KEYS.orders, []);
    return Array.isArray(list) ? list : [];
  },
  save(list) {
    nxWrite(NX_KEYS.orders, list);
    document.dispatchEvent(new CustomEvent('nx:orders'));
  },
  mine() {
    const user = nxAuth.current();
    if (!user) return [];
    return nxOrders.all().filter((o) => o.userId === user.id || (o.phone && o.phone === user.phone));
  },
  find(code) {
    return nxOrders.all().find((o) => o.code === code || o.id === code) || null;
  },
  add(order) {
    const created = {
      id: 'o-' + Date.now().toString(36),
      code: 'NEX-' + String(Math.floor(100000 + Math.random() * 900000)),
      status: 'processing',
      createdAt: new Date().toISOString(),
      userId: (nxAuth.current() || {}).id || null,
      ...order
    };
    nxOrders.save([created, ...nxOrders.all()]);
    return created;
  },
  updateStatus(id, status) {
    if (!NX_ORDER_STATUS[status]) return;
    nxOrders.save(nxOrders.all().map((o) => (o.id === id || o.code === id ? { ...o, status } : o)));
  },
  statusLabel(status) {
    return (NX_ORDER_STATUS[status] || NX_ORDER_STATUS.processing).label;
  }
};

/* --------------------------------- reviews -------------------------------- */
const nxReviews = {
  all() {
    const list = nxRead(NX_KEYS.reviews, []);
    return Array.isArray(list) ? list : [];
  },
  forProduct(id) {
    return nxReviews.all().filter((r) => r.productId === id);
  },
  add(review) {
    const user = nxAuth.current();
    const item = {
      id: 'r-' + Date.now().toString(36),
      userId: user ? user.id : null,
      name: user ? `${user.firstName} ${user.lastName}` : review.name || 'کاربر مهمان',
      date: new Date().toISOString(),
      ...review
    };
    nxWrite(NX_KEYS.reviews, [item, ...nxReviews.all()]);
    return item;
  }
};

/* ------------------------------- newsletter ------------------------------- */
function nxSubscribe(email) {
  const clean = String(email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(clean)) {
    return { ok: false, message: 'ایمیل وارد شده معتبر نیست.' };
  }
  const list = nxRead(NX_KEYS.newsletter, []);
  if (list.includes(clean)) return { ok: true, message: 'این ایمیل قبلاً در خبرنامه ثبت شده است.' };
  nxWrite(NX_KEYS.newsletter, [...list, clean]);
  return { ok: true, message: 'عضویت شما در خبرنامه NEXORA ثبت شد.' };
}

/* -------------------------------- seed data ------------------------------- */
function nxSeedDemo() {
  if (nxRead(NX_KEYS.seeded, false)) return;
  const now = Date.now();
  const day = 86400000;

  if (!nxRead(NX_KEYS.users, null)) {
    nxAuth.saveUsers([
      {
        id: 'u-admin',
        firstName: 'مدیر',
        lastName: 'NEXORA',
        email: 'admin@nexora.ir',
        phone: '09120000000',
        passwordHash: nxHash('Admin@1234'),
        isAdmin: true,
        createdAt: new Date(now - day * 120).toISOString()
      },
      {
        id: 'u-demo',
        firstName: 'سارا',
        lastName: 'محمدی',
        email: 'demo@nexora.ir',
        phone: '09121111111',
        passwordHash: nxHash('Demo@1234'),
        isAdmin: false,
        createdAt: new Date(now - day * 45).toISOString()
      }
    ]);
  }

  const sampleItems = [
    { id: 'airpods-pro-3', qty: 1 },
    { id: 'mi-band-10', qty: 2 }
  ]
    .map((i) => {
      const p = findProduct(i.id);
      if (!p) return null;
      return {
        id: i.id,
        qty: i.qty,
        color: p.colors[0].name,
        warranty: p.warranties[0],
        price: p.price,
        name: p.name,
        art: p.art,
        accent: p.accent
      };
    })
    .filter(Boolean);

  const sample = sampleItems.reduce((s, i) => s + i.price * i.qty, 0);

  if (!nxRead(NX_KEYS.orders, null)) {
    nxOrders.save([
      {
        id: 'o-demo-1',
        code: 'NEX-284517',
        status: 'delivered',
        createdAt: new Date(now - day * 21).toISOString(),
        userId: 'u-demo',
        customer: { firstName: 'سارا', lastName: 'محمدی', phone: '09121111111' },
        address: { province: 'تهران', city: 'تهران', line: 'خیابان ولیعصر، کوچه بهار، پلاک ۱۲', postalCode: '1234567890' },
        shipping: 'normal',
        payment: 'online',
        items: sampleItems,
        totals: { subtotal: sample, discount: 0, couponDiscount: 0, shipping: 0, total: sample }
      },
      {
        id: 'o-demo-2',
        code: 'NEX-731902',
        status: 'processing',
        createdAt: new Date(now - day * 3).toISOString(),
        userId: 'u-demo',
        customer: { firstName: 'سارا', lastName: 'محمدی', phone: '09121111111' },
        address: { province: 'تهران', city: 'تهران', line: 'خیابان ولیعصر، کوچه بهار، پلاک ۱۲', postalCode: '1234567890' },
        shipping: 'express',
        payment: 'cod',
        items: [{ id: 'sony-wh-1000xm6', qty: 1, color: 'مشکی', warranty: '۱۸ ماه گارانتی شرکتی', price: 21500000, name: 'هدفون بی‌سیم سونی WH-1000XM6', art: 'headphones', accent: '#111827' }],
        totals: { subtotal: 21500000, discount: 2500000, couponDiscount: 0, shipping: 95000, total: 21595000 }
      }
    ]);
  }

  if (!nxRead(NX_KEYS.addresses, null)) {
    nxWrite(NX_KEYS.addresses, [
      {
        id: 'a-demo-1',
        userId: 'u-demo',
        isDefault: true,
        title: 'خانه',
        receiver: 'سارا محمدی',
        phone: '09121111111',
        province: 'تهران',
        city: 'تهران',
        line: 'خیابان ولیعصر، کوچه بهار، پلاک ۱۲، واحد ۳',
        postalCode: '1234567890'
      }
    ]);
  }

  nxWrite(NX_KEYS.seeded, true);
}

nxSeedDemo();
