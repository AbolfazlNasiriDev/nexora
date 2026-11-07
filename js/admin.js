/* ==========================================================================
   NEXORA — Admin panel (demo, localStorage backed)
   Dashboard, products, orders, users and categories management.
   ========================================================================== */

(function nxAdmin() {
  const root = document.getElementById('admin-root');
  if (!root) return;

  const ADMIN_EMAIL = 'admin@nexora.ir';
  const ADMIN_PASS = 'Admin@1234';
  const categoryStore = 'nexora_admin_categories';

  const TABS = [
    { id: 'dashboard', label: 'داشبورد', icon: 'layout-dashboard' },
    { id: 'products', label: 'مدیریت محصولات', icon: 'package' },
    { id: 'orders', label: 'مدیریت سفارش‌ها', icon: 'receipt-text' },
    { id: 'users', label: 'مدیریت کاربران', icon: 'users' },
    { id: 'categories', label: 'دسته‌بندی‌ها', icon: 'layout-grid' }
  ];

  let tab = (location.hash || '').replace('#', '') || 'dashboard';
  if (!TABS.some((t) => t.id === tab)) tab = 'dashboard';
  let productSearch = '';

  /* --------------------------------- gate --------------------------------- */
  function gate() {
    return `<div class="max-w-md mx-auto card p-6 md:p-8 text-center mt-6">
      <div class="w-14 h-14 rounded-2xl bg-primary-50 text-primary grid place-items-center mx-auto"><i data-lucide="shield" class="w-7 h-7"></i></div>
      <h1 class="text-lg font-black text-ink mt-4">دسترسی به پنل مدیریت</h1>
      <p class="text-[11.5px] text-muted mt-2 leading-6">این پنل یک نمونه نمایشی است و دسترسی آن فقط با حساب مدیر آزمایشی فعال می‌شود. برای محیط واقعی باید سطح دسترسی در بک‌اند کنترل شود.</p>
      <button class="btn btn-primary btn-block mt-4" data-demo-admin><i data-lucide="log-in" class="w-4 h-4"></i> ورود به عنوان مدیر آزمایشی</button>
      <a href="login.html?next=admin.html" class="btn btn-outline btn-block mt-2">ورود با حساب مدیر</a>
      <div class="rounded-xl bg-page border border-line p-2.5 mt-4 text-[10px] text-muted leading-5 text-right">
        <div class="font-bold text-ink mb-1">اطلاعات حساب مدیر</div>
        <div dir="ltr" class="text-left font-mono">admin@nexora.ir</div>
        <div dir="ltr" class="text-left font-mono">Admin@1234</div>
      </div>
      <a href="index.html" class="text-[10.5px] font-semibold text-primary inline-block mt-3">بازگشت به فروشگاه</a>
    </div>`;
  }

  if (!nxAuth.isAdmin()) {
    root.innerHTML = gate();
    nxIcons();
    root.addEventListener('click', (event) => {
      if (!event.target.closest('[data-demo-admin]')) return;
      const result = nxAuth.login(ADMIN_EMAIL, ADMIN_PASS);
      if (!result.ok) {
        nxToast(result.message, 'error');
        return;
      }
      nxToast('به عنوان مدیر آزمایشی وارد شدید.', 'success');
      setTimeout(() => location.reload(), 500);
    });
    return;
  }

  /* -------------------------------- helpers -------------------------------- */
  const products = () => getProducts();
  const orders = () => nxOrders.all().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const users = () => nxAuth.users();
  const revenue = () => orders().filter((o) => o.status !== 'canceled').reduce((s, o) => s + (o.totals.total || 0), 0);

  function saveCats() {
    nxWrite(categoryStore, CATEGORIES);
    Object.keys(CATEGORY_MAP).forEach((k) => delete CATEGORY_MAP[k]);
    CATEGORIES.forEach((c) => (CATEGORY_MAP[c.id] = c));
  }

  function statCard(icon, label, value, tone, extra) {
    return `<div class="card p-3.5">
      <div class="flex items-start justify-between">
        <span class="dash-stat-icon ${tone}"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
        ${extra || ''}
      </div>
      <div class="text-[10.5px] text-muted mt-2.5">${label}</div>
      <div class="text-base font-black text-ink mt-0.5">${value}</div>
    </div>`;
  }

  /* ------------------------------- dashboard ------------------------------- */
  function dashboard() {
    const all = products();
    const ords = orders();
    const recent = ords.slice(0, 5);
    const series = [12, 18, 14, 24, 19, 28, 22];
    const max = Math.max(...series);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(d);
    });
    const bestsellers = all.slice().sort((a, b) => b.reviews - a.reviews).slice(0, 5);
    const lowStock = all.filter((p) => p.stock <= 5).slice(0, 5);

    return `<div class="space-y-3">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        ${statCard('package', 'کل محصولات', nxFa(all.length), 'text-primary bg-primary-50', '<span class="text-[9px] text-emerald-600 bg-emerald-50 rounded px-1.5 py-0.5">فعال</span>')}
        ${statCard('receipt-text', 'کل سفارش‌ها', nxFa(ords.length), 'text-sky-600 bg-sky-50')}
        ${statCard('users', 'کاربران', nxFa(users().length), 'text-violet-600 bg-violet-50')}
        ${statCard('wallet', 'مجموع فروش (نمایشی)', `${nxNumber(revenue())} <span class="text-[9px] font-medium text-muted">تومان</span>`, 'text-emerald-600 bg-emerald-50')}
      </div>

      <div class="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-3">
        <div class="card p-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-[12.5px] font-extrabold text-ink">نمودار فروش هفتگی</h2>
              <p class="text-[9.5px] text-muted mt-0.5">داده نمونه (میلیون تومان) — برای نمایش ساختار نمودار</p>
            </div>
            <span class="chip !text-[9.5px] !py-0.5 !cursor-default !text-emerald-600 !border-emerald-200 !bg-emerald-50">
              <i data-lucide="trending-up" class="w-3 h-3"></i> ۱۸٪ رشد
            </span>
          </div>
          <div class="flex items-end justify-between gap-1.5 h-40">
            ${series
              .map(
                (v, i) => `<div class="flex-1 flex flex-col items-center gap-1.5">
                  <span class="text-[9px] text-muted">${nxFa(v)}</span>
                  <div class="w-full rounded-t-lg bg-gradient-to-t from-primary-200 to-primary-500 transition-all hover:from-primary-300 hover:to-primary-600" style="height:${Math.round((v / max) * 100)}%"></div>
                  <span class="text-[9px] text-muted whitespace-nowrap">${days[i]}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="card p-4">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-[12.5px] font-extrabold text-ink">سفارش‌های اخیر</h2>
            <button class="text-[10px] font-bold text-primary" data-admin-tab="orders">همه</button>
          </div>
          ${recent.length
            ? `<div class="space-y-2">
                ${recent
                  .map(
                    (o) => `<div class="flex items-center justify-between gap-2 py-1.5 border-b border-line last:border-0">
                      <div class="min-w-0">
                        <div class="text-[10.5px] font-bold text-ink">${o.code}</div>
                        <div class="text-[9px] text-muted mt-0.5">${nxEscape((o.customer && o.customer.firstName) || 'مهمان')} · ${nxDate(o.createdAt)}</div>
                      </div>
                      <div class="text-left shrink-0">
                        <div class="text-[10px] font-bold text-ink">${nxNumber(o.totals.total)}</div>
                        <div class="mt-1">${nxOrderStatusBadge(o.status)}</div>
                      </div>
                    </div>`
                  )
                  .join('')}
              </div>`
            : '<p class="text-[10.5px] text-muted py-6 text-center">سفارشی ثبت نشده است.</p>'}
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div class="card p-4">
          <h2 class="text-[12.5px] font-extrabold text-ink mb-3">پرفروش‌ترین محصولات</h2>
          <div class="space-y-2">
            ${bestsellers
              .map(
                (p, i) => `<div class="flex items-center gap-2 py-1">
                  <span class="w-5 text-[10px] font-black text-muted">${nxFa(i + 1)}</span>
                  <img src="${NXArt.product(p, 1)}" alt="" class="w-8 h-8 rounded-lg bg-page border border-line object-contain">
                  <div class="flex-1 min-w-0">
                    <div class="text-[10.5px] font-semibold text-ink truncate">${nxEscape(p.name)}</div>
                    <div class="text-[9px] text-muted mt-0.5">${nxFa(p.reviews)} نظر · ${p.brand}</div>
                  </div>
                  <span class="text-[10px] font-bold text-ink whitespace-nowrap">${nxNumber(p.price)}</span>
                </div>`
              )
              .join('')}
          </div>
        </div>
        <div class="card p-4">
          <h2 class="text-[12.5px] font-extrabold text-ink mb-3 flex items-center gap-1.5"><i data-lucide="triangle-alert" class="w-3.5 h-3.5 text-amber-500"></i> هشدار موجودی</h2>
          ${lowStock.length
            ? `<div class="space-y-2">
                ${lowStock
                  .map(
                    (p) => `<div class="flex items-center gap-2 py-1">
                      <img src="${NXArt.product(p, 1)}" alt="" class="w-8 h-8 rounded-lg bg-page border border-line object-contain">
                      <div class="flex-1 min-w-0 text-[10.5px] font-semibold text-ink truncate">${nxEscape(p.name)}</div>
                      <span class="badge-stock ${p.stock === 0 ? 'out' : 'low'}">${p.stock === 0 ? 'ناموجود' : `${nxFa(p.stock)} عدد`}</span>
                    </div>`
                  )
                  .join('')}
              </div>`
            : '<p class="text-[10.5px] text-muted py-6 text-center">همه محصولات موجودی کافی دارند.</p>'}
        </div>
      </div>

      <div class="card p-3 flex flex-wrap items-center justify-between gap-2">
        <p class="text-[10px] text-muted leading-5">تمام تغییرات این پنل در LocalStorage مرورگر ذخیره می‌شود و روی صفحه‌های فروشگاه اثر می‌گذارد.</p>
        <div class="flex items-center gap-2">
          <button class="btn btn-outline btn-sm" data-reset-products><i data-lucide="rotate-ccw" class="w-4 h-4"></i> بازگردانی محصولات نمونه</button>
          <a href="index.html" class="btn btn-soft btn-sm">مشاهده فروشگاه</a>
        </div>
      </div>
    </div>`;
  }

  /* -------------------------------- products ------------------------------- */
  function productsTab() {
    const list = products().filter((p) => {
      if (!productSearch) return true;
      const q = productSearch.toLowerCase();
      return `${p.name} ${p.brand} ${p.catName}`.toLowerCase().includes(q);
    });

    return `<div class="space-y-3">
      <div class="card p-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 flex-1 min-w-[200px]">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2"></i>
            <input id="admin-product-search" class="field !text-[11px] !py-2 !pe-9" placeholder="جستجوی نام یا برند محصول…" value="${nxEscape(productSearch)}">
          </div>
          <span class="text-[10px] text-muted whitespace-nowrap">${nxFa(list.length)} محصول</span>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-outline btn-sm" data-reset-products><i data-lucide="rotate-ccw" class="w-4 h-4"></i> بازگردانی نمونه</button>
          <button class="btn btn-primary btn-sm" data-new-product><i data-lucide="plus" class="w-4 h-4"></i> افزودن محصول</button>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="overflow-x-auto scroll-thin">
          <table class="nx-table min-w-[820px]">
            <thead>
              <tr>
                <th>محصول</th><th>دسته‌بندی</th><th>قیمت</th><th>تخفیف</th><th>موجودی</th><th>امتیاز</th><th class="text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              ${list
                .map(
                  (p) => `<tr>
                    <td>
                      <div class="flex items-center gap-2">
                        <img src="${NXArt.product(p, 1)}" alt="" class="w-9 h-9 rounded-lg bg-page border border-line object-contain shrink-0">
                        <div class="min-w-0 max-w-[240px]">
                          <div class="text-[11px] font-semibold text-ink truncate">${nxEscape(p.name)}</div>
                          <div class="text-[9px] text-muted mt-0.5">${p.brand} · ${p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-[10.5px] text-muted">${p.catName}<div class="text-[9px] mt-0.5">${p.subName}</div></td>
                    <td class="text-[10.5px] font-semibold text-ink whitespace-nowrap">${nxNumber(p.price)}</td>
                    <td>${p.discount ? `<span class="badge-sale">${nxFa(p.discount)}٪</span>` : '<span class="text-[10px] text-muted">—</span>'}</td>
                    <td><span class="badge-stock ${p.stock <= 0 ? 'out' : p.stock <= 5 ? 'low' : 'in'}">${p.stock <= 0 ? 'ناموجود' : nxFa(p.stock)}</span></td>
                    <td class="text-[10.5px] text-muted">${nxFa(p.rating)}</td>
                    <td>
                      <div class="flex items-center justify-center gap-1">
                        <button class="w-7 h-7 rounded-lg bg-primary-50 text-primary grid place-items-center hover:bg-primary-100" data-edit-product="${p.id}" aria-label="ویرایش"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
                        <button class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 grid place-items-center hover:bg-rose-100" data-delete-product="${p.id}" aria-label="حذف"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                      </div>
                    </td>
                  </tr>`
                )
                .join('') || '<tr><td colspan="7" class="text-center text-[11px] text-muted py-8">محصولی یافت نشد.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  }

  /* --------------------------------- orders -------------------------------- */
  function ordersTab() {
    const list = orders();
    return `<div class="card p-3 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-[12.5px] font-extrabold text-ink">مدیریت سفارش‌ها</h2>
          <p class="text-[9.5px] text-muted mt-0.5">وضعیت هر سفارش را تغییر دهید؛ بلافاصله در پنل کاربری اعمال می‌شود.</p>
        </div>
        <span class="chip !text-[10px] !cursor-default">${nxFa(list.length)} سفارش</span>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto scroll-thin">
          <table class="nx-table min-w-[860px]">
            <thead><tr><th>شماره سفارش</th><th>مشتری</th><th>اقلام</th><th>مبلغ</th><th>تاریخ</th><th>وضعیت</th></tr></thead>
            <tbody>
              ${list
                .map(
                  (o) => `<tr>
                    <td class="font-semibold text-ink text-[11px]">${o.code}</td>
                    <td>
                      <div class="text-[10.5px] text-ink">${nxEscape(((o.customer || {}).firstName || '') + ' ' + ((o.customer || {}).lastName || ''))}</div>
                      <div class="text-[9px] text-muted mt-0.5" dir="ltr">${nxEscape((o.customer || {}).phone || '—')}</div>
                    </td>
                    <td class="text-[10.5px] text-muted">${nxFa((o.items || []).reduce((s, i) => s + (i.qty || 1), 0))} کالا</td>
                    <td class="text-[10.5px] font-semibold whitespace-nowrap">${nxNumber(o.totals.total)}</td>
                    <td class="text-[9.5px] text-muted whitespace-nowrap">${nxDate(o.createdAt)}</td>
                    <td>
                      <select class="field !py-1 !text-[10px] !rounded-lg !w-auto" data-order-status="${o.id}">
                        ${Object.entries(NX_ORDER_STATUS)
                          .map(([key, cfg]) => `<option value="${key}" ${o.status === key ? 'selected' : ''}>${cfg.label}</option>`)
                          .join('')}
                      </select>
                    </td>
                  </tr>`
                )
                .join('') || '<tr><td colspan="6" class="text-center text-[11px] text-muted py-8">سفارشی ثبت نشده است.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* --------------------------------- users --------------------------------- */
  function usersTab() {
    const list = users();
    return `<div class="card p-3 mb-3 flex items-center justify-between">
        <div>
          <h2 class="text-[12.5px] font-extrabold text-ink">مدیریت کاربران</h2>
          <p class="text-[9.5px] text-muted mt-0.5">اطلاعات حساب‌های ثبت‌شده در نسخه نمایشی.</p>
        </div>
        <span class="chip !text-[10px] !cursor-default">${nxFa(list.length)} کاربر</span>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto scroll-thin">
          <table class="nx-table min-w-[760px]">
            <thead><tr><th>کاربر</th><th>ایمیل</th><th>موبایل</th><th>نقش</th><th>عضویت</th><th>سفارش‌ها</th><th class="text-center">عملیات</th></tr></thead>
            <tbody>
              ${list
                .map((u) => {
                  const count = nxOrders.all().filter((o) => o.userId === u.id).length;
                  return `<tr>
                    <td>
                      <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-primary-50 text-primary-700 grid place-items-center text-[10px] font-bold">${nxEscape(u.firstName.charAt(0))}</span>
                        <span class="text-[10.5px] font-semibold text-ink">${nxEscape(u.firstName + ' ' + u.lastName)}</span>
                      </div>
                    </td>
                    <td class="text-[10px] text-muted" dir="ltr">${nxEscape(u.email)}</td>
                    <td class="text-[10px] text-muted" dir="ltr">${nxEscape(u.phone)}</td>
                    <td>${u.isAdmin ? '<span class="text-[9px] font-bold text-primary bg-primary-50 rounded px-1.5 py-0.5">مدیر</span>' : '<span class="text-[9px] text-muted bg-page rounded px-1.5 py-0.5">کاربر</span>'}</td>
                    <td class="text-[9.5px] text-muted whitespace-nowrap">${nxDate(u.createdAt)}</td>
                    <td class="text-[10.5px] text-ink">${nxFa(count)}</td>
                    <td class="text-center">
                      ${u.isAdmin
                        ? '<span class="text-[9px] text-muted">—</span>'
                        : `<button class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 grid place-items-center hover:bg-rose-100 mx-auto" data-delete-user="${u.id}" aria-label="حذف کاربر"><i data-lucide="user-x" class="w-3.5 h-3.5"></i></button>`}
                    </td>
                  </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  /* ------------------------------- categories ------------------------------ */
  function categoriesTab() {
    const iconOptions = ['smartphone', 'laptop', 'cpu', 'headphones', 'watch', 'gamepad-2', 'camera', 'tv', 'home', 'router', 'package'];
    return `<div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-3 items-start">
      <div class="space-y-2.5">
        ${CATEGORIES.map((cat) => {
          const count = products().filter((p) => p.cat === cat.id).length;
          return `<div class="card p-3.5">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="w-9 h-9 rounded-xl grid place-items-center text-white" style="background:${cat.color}"><i data-lucide="${cat.icon}" class="w-4 h-4"></i></span>
                <div>
                  <div class="text-[11.5px] font-extrabold text-ink">${cat.name}</div>
                  <div class="text-[9.5px] text-muted mt-0.5">${nxFa(count)} محصول · ${nxFa(cat.subs.length)} زیردسته</div>
                </div>
              </div>
              <div class="flex items-center gap-1.5">
                <button class="btn btn-outline btn-sm !text-[9.5px] !py-1" data-edit-category="${cat.id}"><i data-lucide="pencil" class="w-3 h-3"></i> ویرایش</button>
                <button class="btn btn-outline btn-sm !text-[9.5px] !py-1 !text-rose-600 !border-rose-200" data-delete-category="${cat.id}"><i data-lucide="trash-2" class="w-3 h-3"></i> حذف</button>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-2.5">
              ${cat.subs
                .map(
                  (s) => `<span class="inline-flex items-center gap-1 text-[9.5px] bg-page border border-line rounded-lg px-1.5 py-0.5 text-ink/70">
                    ${s.name}
                    <button class="text-muted hover:text-rose-500" data-delete-sub="${cat.id}|${s.id}" aria-label="حذف زیردسته"><i data-lucide="x" class="w-2.5 h-2.5"></i></button>
                  </span>`
                )
                .join('')}
            </div>
            <form class="flex items-center gap-1.5 mt-2.5" data-add-sub="${cat.id}">
              <input class="field !py-1 !text-[10px] !rounded-lg" name="subName" placeholder="نام زیردسته جدید">
              <button class="btn btn-soft btn-sm !text-[9.5px] !py-1 shrink-0" type="submit">افزودن</button>
            </form>
          </div>`;
        }).join('')}
      </div>

      <div class="card p-4 lg:sticky lg:top-28">
        <h2 class="text-[12.5px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="plus-circle" class="w-4 h-4 text-primary"></i> دسته‌بندی جدید</h2>
        <form id="category-form" class="space-y-2.5 mt-3">
          <div>
            <label class="lbl">نام دسته</label>
            <input class="field !py-2 !text-[11px]" name="name" placeholder="مثلاً لوازم ورزشی هوشمند" required>
          </div>
          <div>
            <label class="lbl">شعار کوتاه</label>
            <input class="field !py-2 !text-[11px]" name="tagline" placeholder="توضیح یک‌خطی">
          </div>
          <div>
            <label class="lbl">توضیحات</label>
            <textarea class="field !py-2 !text-[11px] !min-h-[60px]" name="desc" placeholder="توضیح کوتاه دسته‌بندی"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="lbl">آیکون</label>
              <select class="field !py-2 !text-[11px]" name="icon">
                ${iconOptions.map((i) => `<option value="${i}">${i}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="lbl">رنگ</label>
              <input type="color" class="field !py-1 !h-9" name="color" value="#5B45E8">
            </div>
          </div>
          <button class="btn btn-primary btn-sm btn-block" type="submit">افزودن دسته‌بندی</button>
        </form>
        <div class="rounded-xl bg-page border border-line p-2.5 mt-3">
          <p class="text-[9.5px] leading-5 text-muted">تغییرات دسته‌بندی در LocalStorage ذخیره می‌شود. حذف یک دسته، محصولات آن را حذف نمی‌کند؛ اما صفحه دسته دیگر در دسترس نخواهد بود.</p>
        </div>
      </div>
    </div>`;
  }

  /* --------------------------------- modal --------------------------------- */
  function closeModal() {
    document.getElementById('admin-modal')?.remove();
    document.body.classList.remove('no-scroll');
  }

  function openModal(title, body, submitLabel, onSubmit) {
    closeModal();
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div id="admin-modal" class="fixed inset-0 z-[110] flex items-center justify-center p-2.5 md:p-4">
        <div class="absolute inset-0 bg-ink/60 backdrop-blur-sm" data-modal-close></div>
        <div class="relative bg-white rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto scroll-thin shadow-card">
          <div class="sticky top-0 bg-white border-b border-line p-3.5 flex items-center justify-between z-10">
            <h3 class="text-[13px] font-extrabold text-ink">${title}</h3>
            <button class="icon-btn !w-8 !h-8" data-modal-close aria-label="بستن"><i data-lucide="x" class="w-4 h-4"></i></button>
          </div>
          <form id="admin-modal-form" class="p-3.5 md:p-4">${body}
            <div class="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-line">
              <button type="button" class="btn btn-ghost btn-sm" data-modal-close>انصراف</button>
              <button type="submit" class="btn btn-primary btn-sm">${submitLabel}</button>
            </div>
          </form>
        </div>
      </div>`
    );
    document.body.classList.add('no-scroll');
    nxIcons();
    const modal = document.getElementById('admin-modal');
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) closeModal();
    });
    modal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      onSubmit(new FormData(e.target), e.target);
    });
    return modal;
  }

  function productFormHTML(product) {
    const p = product || {
      name: '', brand: '', cat: CATEGORIES[0].id, sub: CATEGORIES[0].subs[0] ? CATEGORIES[0].subs[0].id : '',
      price: '', oldPrice: '', stock: 0, rating: 4.5, art: 'generic', colors: ['black'], desc: '', features: [], specs: {}, tags: ['new']
    };
    const cat = getCategory(p.cat) || CATEGORIES[0];
    const specsText = Object.entries(p.specs || {}).filter(([k]) => !['برند', 'دسته‌بندی', 'نوع محصول'].includes(k)).map(([k, v]) => `${k}: ${v}`).join('\n');
    return `
      <input type="hidden" name="id" value="${product ? product.id : ''}">
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="sm:col-span-2">
          <label class="lbl">نام محصول</label>
          <input class="field !text-[11.5px]" name="name" value="${nxEscape(p.name)}" required>
        </div>
        <div>
          <label class="lbl">برند</label>
          <input class="field !text-[11.5px]" name="brand" value="${nxEscape(p.brand)}" placeholder="Apple" required>
        </div>
        <div>
          <label class="lbl">دسته‌بندی</label>
          <select class="field !text-[11.5px]" name="cat" data-modal-cat>
            ${CATEGORIES.map((c) => `<option value="${c.id}" ${p.cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="lbl">زیردسته</label>
          <select class="field !text-[11.5px]" name="sub" data-modal-sub>
            ${cat.subs.map((s) => `<option value="${s.id}" ${p.sub === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="lbl">تصویر محصول (طرح)</label>
          <select class="field !text-[11.5px]" name="art">
            ${NXArt.kinds.map((k) => `<option value="${k}" ${p.art === k ? 'selected' : ''}>${k}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="lbl">قیمت (تومان)</label>
          <input class="field !text-[11.5px]" name="price" type="number" min="0" value="${p.price}" required>
        </div>
        <div>
          <label class="lbl">قیمت قبل از تخفیف</label>
          <input class="field !text-[11.5px]" name="oldPrice" type="number" min="0" value="${p.oldPrice || ''}">
        </div>
        <div>
          <label class="lbl">موجودی</label>
          <input class="field !text-[11.5px]" name="stock" type="number" min="0" value="${p.stock}">
        </div>
        <div>
          <label class="lbl">امتیاز (۰ تا ۵)</label>
          <input class="field !text-[11.5px]" name="rating" type="number" min="0" max="5" step="0.1" value="${p.rating}">
        </div>
        <div class="sm:col-span-2">
          <label class="lbl">رنگ‌ها (با کاما جدا کنید)</label>
          <input class="field !text-[11.5px]" name="colors" value="${p.colors.map((c) => c.name).join('، ')}" placeholder="مشکی، نقره‌ای">
        </div>
        <div class="sm:col-span-2">
          <label class="lbl">توضیحات</label>
          <textarea class="field !text-[11.5px] !min-h-[70px]" name="desc">${nxEscape(p.desc || '')}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="lbl">ویژگی‌ها (هر خط یک ویژگی)</label>
          <textarea class="field !text-[11.5px] !min-h-[60px]" name="features">${nxEscape((p.features || []).join('\n'))}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="lbl">مشخصات فنی (هر خط به شکل «نام: مقدار»)</label>
          <textarea class="field !text-[11.5px] !min-h-[80px]" name="specs" placeholder="حافظه رم: ۱۶ گیگابایت">${nxEscape(specsText)}</textarea>
        </div>
      </div>`;
  }

  function parseSpecs(text) {
    const out = {};
    text.split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx < 1) return;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value) out[key] = value;
    });
    return out;
  }

  /* -------------------------------- actions -------------------------------- */
  function handleNewProduct() {
    openModal('افزودن محصول جدید', productFormHTML(null), 'ذخیره محصول', (fd) => {
      const list = products().slice();
      const colors = String(fd.get('colors') || '')
        .split(/[,،]/)
        .map((c) => c.trim())
        .filter(Boolean);
      const payload = {
        id: 'p-' + Date.now().toString(36),
        name: fd.get('name').trim(),
        brand: fd.get('brand').trim(),
        cat: fd.get('cat'),
        sub: fd.get('sub'),
        price: Number(fd.get('price')),
        old: Number(fd.get('oldPrice')) || 0,
        stock: Number(fd.get('stock')) || 0,
        rating: Number(fd.get('rating')) || 4.5,
        reviews: 0,
        art: fd.get('art'),
        tags: ['new'],
        colors: colors.length ? colors : ['مشکی'],
        desc: fd.get('desc').trim(),
        features: fd.get('features').split('\n').map((s) => s.trim()).filter(Boolean),
        specs: parseSpecs(fd.get('specs'))
      };
      if (!payload.name || !payload.brand || !payload.price) {
        nxToast('نام، برند و قیمت را کامل وارد کنید.', 'error');
        return;
      }
      payload.oldPrice = payload.old;
      list.unshift(normalizeAdminProduct(payload));
      saveProducts(list);
      closeModal();
      nxToast('محصول جدید اضافه شد.', 'success');
      render();
    });

    const modal = document.getElementById('admin-modal');
    modal.querySelector('[data-modal-cat]').addEventListener('change', (e) => {
      const cat = getCategory(e.target.value);
      const subSelect = modal.querySelector('[data-modal-sub]');
      subSelect.innerHTML = cat.subs.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
    });
  }

  function handleEditProduct(id) {
    const product = products().find((p) => p.id === id);
    if (!product) return;
    openModal('ویرایش محصول', productFormHTML(product), 'ذخیره تغییرات', (fd) => {
      const list = products().slice();
      const index = list.findIndex((p) => p.id === id);
      if (index < 0) return;
      const colors = String(fd.get('colors') || '')
        .split(/[,،]/)
        .map((c) => c.trim())
        .filter(Boolean);
      const oldPrice = Number(fd.get('oldPrice')) || 0;
      const updated = normalizeAdminProduct({
        ...list[index],
        name: fd.get('name').trim(),
        brand: fd.get('brand').trim(),
        cat: fd.get('cat'),
        sub: fd.get('sub'),
        price: Number(fd.get('price')),
        oldPrice,
        stock: Number(fd.get('stock')) || 0,
        rating: Number(fd.get('rating')) || 4.5,
        art: fd.get('art'),
        colors: colors.length ? colors : list[index].colors.map((c) => c.name),
        desc: fd.get('desc').trim() || list[index].desc,
        features: fd.get('features').split('\n').map((s) => s.trim()).filter(Boolean),
        specs: { ...(list[index].specs || {}), ...parseSpecs(fd.get('specs')) }
      });
      updated.discount = oldPrice > updated.price ? Math.round((1 - updated.price / oldPrice) * 100) : 0;
      list[index] = updated;
      saveProducts(list);
      closeModal();
      nxToast('محصول به‌روزرسانی شد.', 'success');
      render();
    });

    const modal = document.getElementById('admin-modal');
    modal.querySelector('[data-modal-cat]').addEventListener('change', (e) => {
      const cat = getCategory(e.target.value);
      const subSelect = modal.querySelector('[data-modal-sub]');
      subSelect.innerHTML = cat.subs.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
    });
  }

  function handleDeleteProduct(id) {
    const product = products().find((p) => p.id === id);
    if (!product) return;
    if (!confirm(`محصول «${product.name}» حذف شود؟`)) return;
    saveProducts(products().filter((p) => p.id !== id));
    nxToast('محصول حذف شد.', 'info');
    render();
  }

  function handleEditCategory(id) {
    const cat = getCategory(id);
    if (!cat) return;
    openModal(
      'ویرایش دسته‌بندی',
      `<div class="space-y-2.5">
        <div><label class="lbl">نام</label><input class="field !text-[11.5px]" name="name" value="${nxEscape(cat.name)}" required></div>
        <div><label class="lbl">شعار</label><input class="field !text-[11.5px]" name="tagline" value="${nxEscape(cat.tagline || '')}"></div>
        <div><label class="lbl">توضیحات</label><textarea class="field !text-[11.5px]" name="desc">${nxEscape(cat.desc || '')}</textarea></div>
        <div class="grid grid-cols-2 gap-2">
          <div><label class="lbl">آیکون</label>
            <select class="field !text-[11.5px]" name="icon">
              ${['smartphone', 'laptop', 'cpu', 'headphones', 'watch', 'gamepad-2', 'camera', 'tv', 'home', 'router', 'package']
                .map((i) => `<option value="${i}" ${cat.icon === i ? 'selected' : ''}>${i}</option>`)
                .join('')}
            </select>
          </div>
          <div><label class="lbl">رنگ</label><input type="color" class="field !h-9 !py-1" name="color" value="${cat.color}"></div>
        </div>
      </div>`,
      'ذخیره دسته‌بندی',
      (fd) => {
        cat.name = fd.get('name').trim();
        cat.tagline = fd.get('tagline').trim();
        cat.desc = fd.get('desc').trim();
        cat.icon = fd.get('icon');
        cat.color = fd.get('color');
        cat.tint = `${fd.get('color')}14`;
        saveCats();
        closeModal();
        nxToast('دسته‌بندی به‌روزرسانی شد.', 'success');
        setTimeout(() => location.reload(), 500);
      }
    );
  }

  function handleDeleteCategory(id) {
    const cat = getCategory(id);
    if (!cat) return;
    const count = products().filter((p) => p.cat === id).length;
    if (!confirm(`دسته «${cat.name}» حذف شود؟${count ? `\n${count} محصول در این دسته وجود دارد.` : ''}`)) return;
    const index = CATEGORIES.findIndex((c) => c.id === id);
    if (index > -1) CATEGORIES.splice(index, 1);
    saveCats();
    nxToast('دسته‌بندی حذف شد.', 'info');
    setTimeout(() => location.reload(), 600);
  }

  /* --------------------------------- render -------------------------------- */
  function sidebar() {
    const user = nxAuth.current();
    return `<aside class="card p-3 lg:sticky lg:top-28 h-fit">
      <div class="flex items-center gap-2.5 p-1">
        <span class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white grid place-items-center"><i data-lucide="shield" class="w-5 h-5"></i></span>
        <div class="min-w-0">
          <div class="text-[12px] font-black text-ink">پنل مدیریت</div>
          <div class="text-[9.5px] text-muted truncate">${nxEscape(user.firstName + ' ' + user.lastName)}</div>
        </div>
      </div>
      <nav class="mt-3 space-y-0.5">
        ${TABS.map(
          (t) => `<button class="dash-link w-full text-right ${tab === t.id ? 'is-active' : ''}" data-admin-tab="${t.id}">
            <i data-lucide="${t.icon}" class="w-4 h-4"></i>${t.label}
          </button>`
        ).join('')}
      </nav>
      <div class="border-t border-line mt-2 pt-2">
        <a href="index.html" class="dash-link"><i data-lucide="store" class="w-4 h-4"></i> مشاهده فروشگاه</a>
        <button class="dash-link w-full text-rose-600 hover:bg-rose-50" data-logout><i data-lucide="log-out" class="w-4 h-4"></i> خروج از پنل</button>
      </div>
      <div class="rounded-xl bg-amber-50 border border-amber-200 p-2.5 mt-2">
        <p class="text-[9px] leading-5 text-amber-700">دسترسی این پنل نمایشی است. برای امنیت واقعی باید نقش مدیر در بک‌اند اعتبارسنجی شود.</p>
      </div>
    </aside>`;
  }

  function content() {
    if (tab === 'products') return productsTab();
    if (tab === 'orders') return ordersTab();
    if (tab === 'users') return usersTab();
    if (tab === 'categories') return categoriesTab();
    return dashboard();
  }

  function render() {
    root.innerHTML = `<div class="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-3 md:gap-4 items-start">
      ${sidebar()}
      <div class="min-w-0">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h1 class="text-lg md:text-xl font-black text-ink">${TABS.find((t) => t.id === tab).label}</h1>
            <p class="text-[10px] text-muted mt-1">${nxDate(new Date())} — نسخه نمایشی، داده‌ها در مرورگر شما ذخیره می‌شوند.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="chip !text-[9.5px] !cursor-default !bg-white"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> فروشگاه فعال</span>
            <a href="index.html" class="btn btn-outline btn-sm !text-[10px]">فروشگاه</a>
          </div>
        </div>
        ${content()}
      </div>
    </div>`;
    nxIcons();
  }

  /* --------------------------------- events -------------------------------- */
  document.addEventListener('nx:orders', () => {
    if (tab === 'dashboard' || tab === 'orders') render();
  });

  root.addEventListener('click', (event) => {
    const tabBtn = event.target.closest('[data-admin-tab]');
    if (tabBtn) {
      tab = tabBtn.dataset.adminTab;
      history.replaceState(null, '', `#${tab}`);
      render();
      return;
    }
    if (event.target.closest('[data-new-product]')) return handleNewProduct();
    const editBtn = event.target.closest('[data-edit-product]');
    if (editBtn) return handleEditProduct(editBtn.dataset.editProduct);
    const delBtn = event.target.closest('[data-delete-product]');
    if (delBtn) return handleDeleteProduct(delBtn.dataset.deleteProduct);
    if (event.target.closest('[data-reset-products]')) {
      if (confirm('همه تغییرات محصولات پاک شود و داده‌های نمونه بازگردانده شوند؟')) {
        resetProducts();
        nxToast('داده‌های نمونه بازگردانده شد.', 'success');
        setTimeout(() => location.reload(), 500);
      }
      return;
    }
    const editCat = event.target.closest('[data-edit-category]');
    if (editCat) return handleEditCategory(editCat.dataset.editCategory);
    const delCat = event.target.closest('[data-delete-category]');
    if (delCat) return handleDeleteCategory(delCat.dataset.deleteCategory);
    const delSub = event.target.closest('[data-delete-sub]');
    if (delSub) {
      const [catId, subId] = delSub.dataset.deleteSub.split('|');
      const cat = getCategory(catId);
      if (!cat) return;
      if (!confirm('این زیردسته حذف شود؟')) return;
      cat.subs = cat.subs.filter((s) => s.id !== subId);
      saveCats();
      nxToast('زیردسته حذف شد.', 'info');
      setTimeout(() => location.reload(), 500);
      return;
    }
    const delUser = event.target.closest('[data-delete-user]');
    if (delUser) {
      if (!confirm('این کاربر حذف شود؟')) return;
      nxAuth.saveUsers(nxAuth.users().filter((u) => u.id !== delUser.dataset.deleteUser));
      nxToast('کاربر حذف شد.', 'info');
      render();
    }
  });

  root.addEventListener('change', (event) => {
    const select = event.target.closest('[data-order-status]');
    if (select) {
      nxOrders.updateStatus(select.dataset.orderStatus, select.value);
      nxToast('وضعیت سفارش به‌روزرسانی شد.', 'success');
      render();
      return;
    }
    if (event.target.id === 'admin-product-search') {
      productSearch = event.target.value;
      render();
      document.getElementById('admin-product-search')?.focus();
    }
  });

  root.addEventListener('input', (event) => {
    if (event.target.id === 'admin-product-search') {
      productSearch = event.target.value;
      // Only the table is refreshed to keep the search input focused.
      const container = root.querySelector('[data-admin-tab="products"]');
      render();
      const input = document.getElementById('admin-product-search');
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }
  });

  root.addEventListener('submit', (event) => {
    const addSub = event.target.closest('[data-add-sub]');
    if (addSub) {
      event.preventDefault();
      const cat = getCategory(addSub.dataset.addSub);
      const name = addSub.querySelector('input[name="subName"]').value.trim();
      if (!cat || name.length < 2) {
        nxToast('نام زیردسته را وارد کنید.', 'error');
        return;
      }
      cat.subs.push({ id: 'sub-' + Date.now().toString(36), name });
      saveCats();
      nxToast('زیردسته اضافه شد.', 'success');
      setTimeout(() => location.reload(), 500);
      return;
    }
    if (event.target.id === 'category-form') {
      event.preventDefault();
      const form = event.target;
      const name = form.name.value.trim();
      if (name.length < 2) {
        nxToast('نام دسته را وارد کنید.', 'error');
        return;
      }
      const color = form.color.value;
      const id = 'cat-' + Date.now().toString(36);
      CATEGORIES.push({
        id,
        name,
        short: name,
        icon: form.icon.value,
        tagline: form.tagline.value.trim() || 'دسته‌بندی جدید',
        desc: form.desc.value.trim() || 'محصولات این دسته‌بندی به‌زودی اضافه می‌شوند.',
        color,
        tint: `${color}14`,
        subs: []
      });
      saveCats();
      nxToast('دسته‌بندی اضافه شد.', 'success');
      setTimeout(() => location.reload(), 500);
    }
  });

  render();
})();
