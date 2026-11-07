/* ==========================================================================
   NEXORA — User dashboard
   ========================================================================== */

(function nxProfilePage() {
  const root = document.getElementById('profile-root');
  if (!root) return;

  const user = nxAuth.current();

  if (!user) {
    root.innerHTML = `<div class="card p-8 md:p-12 text-center max-w-lg mx-auto">
      <div class="empty-illu"><i data-lucide="lock" class="w-8 h-8"></i></div>
      <h1 class="text-base font-extrabold text-ink">برای دیدن پنل کاربری وارد شوید</h1>
      <p class="text-[11.5px] text-muted mt-2 leading-6">با ورود به حساب، سفارش‌ها، آدرس‌ها و علاقه‌مندی‌های خود را مدیریت کنید.</p>
      <div class="flex items-center justify-center gap-2 mt-4">
        <a href="login.html?next=profile.html" class="btn btn-primary">ورود به حساب</a>
        <a href="register.html" class="btn btn-outline">ثبت‌نام</a>
      </div>
      <p class="text-[10px] text-muted mt-4">حساب نمایشی: demo@nexora.ir / Demo@1234</p>
    </div>`;
    nxIcons();
    return;
  }

  const TABS = [
    { id: 'overview', label: 'اطلاعات حساب', icon: 'layout-dashboard' },
    { id: 'edit', label: 'ویرایش پروفایل', icon: 'user-pen' },
    { id: 'addresses', label: 'آدرس‌های من', icon: 'map-pin' },
    { id: 'orders', label: 'سفارش‌های من', icon: 'package' },
    { id: 'wishlist', label: 'علاقه‌مندی‌ها', icon: 'heart' },
    { id: 'reviews', label: 'نظرات من', icon: 'message-square-text' }
  ];

  let tab = (location.hash || '').replace('#', '') || 'overview';
  if (!TABS.some((t) => t.id === tab)) tab = 'overview';
  let orderFilter = 'all';
  let editingAddress = false;

  const myOrders = () => nxOrders.mine().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const myReviews = () => nxReviews.all().filter((r) => r.userId === user.id);

  function userBox() {
    return `<div class="card p-4 flex items-center gap-3">
      <span class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white grid place-items-center text-lg font-black shrink-0">${nxEscape(user.firstName.charAt(0))}</span>
      <div class="min-w-0">
        <div class="text-[12.5px] font-extrabold text-ink truncate">${nxEscape(user.firstName + ' ' + user.lastName)}</div>
        <div class="text-[10px] text-muted truncate mt-0.5">${nxEscape(user.email)}</div>
        <div class="text-[9.5px] text-muted mt-0.5">${user.isAdmin ? 'مدیر فروشگاه' : 'کاربر NEXORA'} · عضویت از ${nxDate(user.createdAt)}</div>
      </div>
    </div>`;
  }

  function sidebar() {
    return `<aside class="card p-3 lg:sticky lg:top-28 h-fit">
      ${userBox()}
      <nav class="mt-3 space-y-0.5">
        ${TABS.map(
          (t) => `<button class="dash-link w-full text-right ${tab === t.id ? 'is-active' : ''}" data-profile-tab="${t.id}">
            <i data-lucide="${t.icon}" class="w-4 h-4"></i>${t.label}
            ${t.id === 'orders' ? `<span class="ms-auto text-[10px] text-muted">${nxFa(myOrders().length)}</span>` : ''}
            ${t.id === 'wishlist' ? `<span class="ms-auto text-[10px] text-muted">${nxFa(nxWishlist.count())}</span>` : ''}
          </button>`
        ).join('')}
        ${user.isAdmin ? `<a href="admin.html" class="dash-link w-full"><i data-lucide="shield" class="w-4 h-4"></i> پنل مدیریت</a>` : ''}
      </nav>
      <div class="border-t border-line mt-2 pt-2">
        <button class="dash-link w-full text-rose-600 hover:bg-rose-50" data-logout><i data-lucide="log-out" class="w-4 h-4"></i> خروج از حساب</button>
      </div>
    </aside>`;
  }

  function overview() {
    const orders = myOrders();
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const processing = orders.filter((o) => o.status === 'processing').length;
    const spent = orders.filter((o) => o.status !== 'canceled').reduce((s, o) => s + (o.totals.total || 0), 0);
    const address = nxAddresses.mine().find((a) => a.isDefault) || nxAddresses.mine()[0];

    return `<div class="space-y-3">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        ${[
          ['package', 'کل سفارش‌ها', nxFa(orders.length), 'text-primary bg-primary-50'],
          ['truck', 'در حال پردازش', nxFa(processing), 'text-amber-600 bg-amber-50'],
          ['badge-check', 'تحویل شده', nxFa(delivered), 'text-emerald-600 bg-emerald-50'],
          ['wallet', 'مجموع خرید', `${nxNumber(spent)}`, 'text-sky-600 bg-sky-50']
        ]
          .map(
            ([icon, label, value, tone]) => `<div class="card p-3">
              <span class="dash-stat-icon ${tone}"><i data-lucide="${icon}" class="w-4 h-4"></i></span>
              <div class="text-[10px] text-muted mt-2">${label}</div>
              <div class="text-[13px] font-extrabold text-ink mt-0.5">${value}</div>
            </div>`
          )
          .join('')}
      </div>

      <div class="card p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[12.5px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="clock-3" class="w-4 h-4 text-primary"></i> آخرین سفارش‌ها</h2>
          <button class="text-[10px] font-bold text-primary" data-profile-tab="orders">مشاهده همه</button>
        </div>
        ${orders.length
          ? `<div class="space-y-2.5">${orders.slice(0, 2).map(nxOrderCard).join('')}</div>`
          : `<div class="text-center py-6">
              <div class="empty-illu !w-12 !h-12 !rounded-2xl"><i data-lucide="package-open" class="w-5 h-5"></i></div>
              <p class="text-[11px] text-muted">هنوز سفارشی ثبت نکرده‌اید.</p>
              <a href="products.html" class="btn btn-primary btn-sm mt-3">شروع خرید</a>
            </div>`}
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div class="card p-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-[12.5px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-primary"></i> آدرس پیش‌فرض</h2>
            <button class="text-[10px] font-bold text-primary" data-profile-tab="addresses">مدیریت</button>
          </div>
          ${address
            ? `<div class="text-[11px] text-ink/80 leading-6">${nxEscape(address.title || 'آدرس')} — ${nxEscape(address.receiver)}</div>
               <div class="text-[10.5px] text-muted leading-6 mt-1">${nxEscape(address.province)}، ${nxEscape(address.city)}، ${nxEscape(address.line)}</div>
               <div class="text-[10px] text-muted mt-1">${nxEscape(address.phone)} · کد پستی ${nxFa(address.postalCode)}</div>`
            : `<p class="text-[11px] text-muted">آدرسی ثبت نشده است.</p>
               <button class="btn btn-soft btn-sm mt-2" data-profile-tab="addresses">افزودن آدرس</button>`}
        </div>
        <div class="card p-4">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-[12.5px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="heart" class="w-4 h-4 text-rose-500"></i> علاقه‌مندی‌ها</h2>
            <a href="wishlist.html" class="text-[10px] font-bold text-primary">مشاهده همه</a>
          </div>
          ${nxWishlist.count()
            ? `<div class="flex items-center gap-2 flex-wrap">
                ${nxWishlist.products()
                  .slice(0, 4)
                  .map(
                    (p) => `<a href="product-details.html?id=${p.id}" class="w-12 h-12 rounded-lg bg-page border border-line grid place-items-center overflow-hidden">
                      <img src="${NXArt.product(p, 1)}" alt="${nxEscape(p.name)}" class="w-full h-full object-contain">
                    </a>`
                  )
                  .join('')}
                <span class="text-[10px] text-muted">${nxFa(nxWishlist.count())} محصول ذخیره‌شده</span>
              </div>`
            : `<p class="text-[11px] text-muted">هنوز محصولی ذخیره نکرده‌اید.</p>
               <a href="products.html" class="btn btn-soft btn-sm mt-2">مشاهده محصولات</a>`}
        </div>
      </div>

      <div class="card p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-[11.5px] font-bold text-ink">اطلاعات حساب شما</div>
          <div class="text-[10px] text-muted mt-1">نام: ${nxEscape(user.firstName + ' ' + user.lastName)} · موبایل: ${nxEscape(user.phone)}</div>
        </div>
        <button class="btn btn-outline btn-sm" data-profile-tab="edit"><i data-lucide="pencil" class="w-4 h-4"></i> ویرایش اطلاعات</button>
      </div>
    </div>`;
  }

  function editForm() {
    return `<div class="card p-4 md:p-5">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2"><i data-lucide="user-pen" class="w-4 h-4 text-primary"></i> ویرایش پروفایل</h2>
      <p class="text-[10.5px] text-muted mt-1 mb-4">اطلاعات حساب خود را به‌روزرسانی کنید.</p>
      <form id="profile-form" class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="lbl">نام</label>
          <input class="field !text-[11.5px]" name="firstName" value="${nxEscape(user.firstName)}">
        </div>
        <div>
          <label class="lbl">نام خانوادگی</label>
          <input class="field !text-[11.5px]" name="lastName" value="${nxEscape(user.lastName)}">
        </div>
        <div>
          <label class="lbl">ایمیل</label>
          <input class="field !text-[11.5px]" name="email" type="email" value="${nxEscape(user.email)}">
        </div>
        <div>
          <label class="lbl">شماره موبایل</label>
          <input class="field !text-[11.5px]" name="phone" inputmode="numeric" maxlength="11" value="${nxEscape(user.phone)}">
        </div>
        <div class="sm:col-span-2 flex items-center gap-2 pt-1">
          <button class="btn btn-primary" type="submit"><i data-lucide="save" class="w-4 h-4"></i> ذخیره تغییرات</button>
          <span class="text-[9.5px] text-muted">رمز عبور از این صفحه قابل تغییر نیست (نسخه نمایشی).</span>
        </div>
      </form>
      <div class="rounded-xl bg-page border border-line p-3 mt-4">
        <div class="text-[10.5px] font-bold text-ink mb-1.5 flex items-center gap-1.5"><i data-lucide="info" class="w-3.5 h-3.5 text-primary"></i> حساب نمایشی</div>
        <p class="text-[10px] text-muted leading-5">اطلاعات این حساب در LocalStorage همین مرورگر ذخیره می‌شود. برای احراز هویت واقعی و امن، بک‌اند و سرویس احراز هویت لازم است.</p>
      </div>
    </div>`;
  }

  function addressForm() {
    return `<form id="address-form" class="rounded-2xl border border-line bg-page p-3.5 mb-3 grid sm:grid-cols-2 gap-2.5">
      <div>
        <label class="lbl">عنوان آدرس</label>
        <input class="field !text-[11.5px]" name="title" placeholder="خانه، محل کار…" value="خانه">
      </div>
      <div>
        <label class="lbl">نام تحویل‌گیرنده</label>
        <input class="field !text-[11.5px]" name="receiver" value="${nxEscape(user.firstName + ' ' + user.lastName)}">
      </div>
      <div>
        <label class="lbl">شماره تماس</label>
        <input class="field !text-[11.5px]" name="phone" inputmode="numeric" maxlength="11" value="${nxEscape(user.phone)}">
      </div>
      <div>
        <label class="lbl">استان</label>
        <input class="field !text-[11.5px]" name="province" placeholder="مثلاً تهران" value="تهران">
      </div>
      <div>
        <label class="lbl">شهر</label>
        <input class="field !text-[11.5px]" name="city" placeholder="مثلاً تهران">
      </div>
      <div>
        <label class="lbl">کد پستی</label>
        <input class="field !text-[11.5px]" name="postalCode" inputmode="numeric" maxlength="10" placeholder="۱۰ رقم">
      </div>
      <div class="sm:col-span-2">
        <label class="lbl">آدرس کامل</label>
        <textarea class="field !text-[11.5px] !min-h-[70px]" name="line" placeholder="خیابان، کوچه، پلاک، واحد"></textarea>
      </div>
      <div class="sm:col-span-2 flex items-center gap-2">
        <button class="btn btn-primary btn-sm" type="submit">ذخیره آدرس</button>
        <button class="btn btn-ghost btn-sm" type="button" data-cancel-address>انصراف</button>
      </div>
    </form>`;
  }

  function addresses() {
    const list = nxAddresses.mine();
    return `<div class="card p-4 md:p-5">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h2 class="text-sm font-extrabold text-ink flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-primary"></i> آدرس‌های من</h2>
        <button class="btn btn-primary btn-sm" data-new-address><i data-lucide="plus" class="w-4 h-4"></i> آدرس جدید</button>
      </div>
      ${editingAddress ? addressForm() : ''}
      ${list.length
        ? `<div class="space-y-2.5">
            ${list
              .map(
                (a) => `<div class="rounded-xl border ${a.isDefault ? 'border-primary-200 bg-primary-50/30' : 'border-line'} p-3">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="text-[11.5px] font-bold text-ink flex items-center gap-2">
                        ${nxEscape(a.title || 'آدرس')}
                        ${a.isDefault ? '<span class="text-[9px] bg-primary text-white rounded px-1.5 py-0.5">پیش‌فرض</span>' : ''}
                      </div>
                      <div class="text-[10.5px] text-muted mt-1.5">${nxEscape(a.receiver)} · ${nxEscape(a.phone)}</div>
                      <div class="text-[10.5px] text-muted mt-1 leading-6">${nxEscape(a.province)}، ${nxEscape(a.city)}، ${nxEscape(a.line)}${a.postalCode ? ` — کد پستی ${nxFa(a.postalCode)}` : ''}</div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      ${!a.isDefault ? `<button class="text-[9.5px] font-bold text-primary px-1.5" data-default-address="${a.id}">پیش‌فرض</button>` : ''}
                      <button class="text-muted hover:text-rose-500 p-1" data-remove-address="${a.id}" aria-label="حذف آدرس"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                    </div>
                  </div>
                </div>`
              )
              .join('')}
          </div>`
        : !editingAddress
          ? `<div class="text-center py-6">
              <div class="empty-illu !w-12 !h-12 !rounded-2xl"><i data-lucide="map-pin-off" class="w-5 h-5"></i></div>
              <p class="text-[11px] text-muted">هنوز آدرسی ثبت نکرده‌اید.</p>
              <button class="btn btn-primary btn-sm mt-3" data-new-address>افزودن اولین آدرس</button>
            </div>`
          : ''}
    </div>`;
  }

  function ordersTab() {
    const all = myOrders();
    const list = orderFilter === 'all' ? all : all.filter((o) => o.status === orderFilter);
    const filters = [
      ['all', `همه (${nxFa(all.length)})`],
      ['processing', 'در حال پردازش'],
      ['shipped', 'ارسال شده'],
      ['delivered', 'تحویل شده'],
      ['canceled', 'لغو شده']
    ];
    return `<div class="card p-4 md:p-5">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h2 class="text-sm font-extrabold text-ink flex items-center gap-2"><i data-lucide="package" class="w-4 h-4 text-primary"></i> سفارش‌های من</h2>
        <a href="orders.html" class="text-[10px] font-bold text-primary">صفحه پیگیری</a>
      </div>
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
        ${filters
          .map(
            ([key, label]) =>
              `<button class="chip whitespace-nowrap !text-[10px] ${orderFilter === key ? 'is-active' : ''}" data-order-filter="${key}">${label}</button>`
          )
          .join('')}
      </div>
      ${list.length
        ? `<div class="space-y-2.5">${list.map(nxOrderCard).join('')}</div>`
        : `<p class="text-[11px] text-muted text-center py-6">سفارشی با این وضعیت وجود ندارد.</p>`}
    </div>`;
  }

  function wishlistTab() {
    const items = nxWishlist.products();
    return `<div class="card p-4 md:p-5">
      <div class="flex items-center justify-between gap-2 mb-3">
        <h2 class="text-sm font-extrabold text-ink flex items-center gap-2"><i data-lucide="heart" class="w-4 h-4 text-rose-500"></i> علاقه‌مندی‌ها</h2>
        <a href="wishlist.html" class="text-[10px] font-bold text-primary">مشاهده کامل</a>
      </div>
      ${items.length
        ? `<div class="grid grid-cols-2 md:grid-cols-3 gap-2.5">${items.slice(0, 6).map((p) => nxProductCard(p)).join('')}</div>`
        : `<div class="text-center py-6">
            <div class="empty-illu !w-12 !h-12 !rounded-2xl"><i data-lucide="heart" class="w-5 h-5"></i></div>
            <p class="text-[11px] text-muted">لیست علاقه‌مندی‌های شما خالی است.</p>
            <a href="products.html" class="btn btn-primary btn-sm mt-3">مشاهده محصولات</a>
          </div>`}
    </div>`;
  }

  function reviewsTab() {
    const list = myReviews();
    return `<div class="card p-4 md:p-5">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2 mb-3"><i data-lucide="message-square-text" class="w-4 h-4 text-primary"></i> نظرات من</h2>
      ${list.length
        ? `<div class="space-y-2.5">
            ${list
              .map((r) => {
                const p = findProduct(r.productId);
                return `<div class="rounded-xl border border-line p-3">
                  <div class="flex items-center justify-between gap-2">
                    <a href="product-details.html?id=${r.productId}" class="text-[11px] font-bold text-ink hover:text-primary truncate">${p ? nxEscape(p.name) : r.productId}</a>
                    ${nxStars(r.rating)}
                  </div>
                  <p class="text-[11px] text-ink/70 leading-6 mt-2">${nxEscape(r.text)}</p>
                  <div class="text-[9.5px] text-muted mt-1.5">${nxDate(r.date)}</div>
                </div>`;
              })
              .join('')}
          </div>`
        : `<div class="text-center py-6">
            <div class="empty-illu !w-12 !h-12 !rounded-2xl"><i data-lucide="message-square-off" class="w-5 h-5"></i></div>
            <p class="text-[11px] text-muted">هنوز نظری ثبت نکرده‌اید.</p>
            <a href="products.html" class="btn btn-primary btn-sm mt-3">مشاهده محصولات</a>
          </div>`}
    </div>`;
  }

  function content() {
    if (tab === 'edit') return editForm();
    if (tab === 'addresses') return addresses();
    if (tab === 'orders') return ordersTab();
    if (tab === 'wishlist') return wishlistTab();
    if (tab === 'reviews') return reviewsTab();
    return overview();
  }

  function render() {
    root.innerHTML = `<div class="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-3 md:gap-4 items-start">
      ${sidebar()}
      <div class="min-w-0">${content()}</div>
    </div>`;
    nxIcons();
    nxRefreshBadges();
  }

  root.addEventListener('click', (event) => {
    const tabBtn = event.target.closest('[data-profile-tab]');
    if (tabBtn) {
      tab = tabBtn.dataset.profileTab;
      history.replaceState(null, '', `#${tab}`);
      render();
      return;
    }
    if (event.target.closest('[data-new-address]')) {
      editingAddress = true;
      render();
      return;
    }
    if (event.target.closest('[data-cancel-address]')) {
      editingAddress = false;
      render();
      return;
    }
    const removeAddr = event.target.closest('[data-remove-address]');
    if (removeAddr) {
      nxAddresses.remove(removeAddr.dataset.removeAddress);
      nxToast('آدرس حذف شد.', 'info');
      render();
      return;
    }
    const setDefault = event.target.closest('[data-default-address]');
    if (setDefault) {
      nxAddresses.setDefault(setDefault.dataset.defaultAddress);
      nxToast('آدرس پیش‌فرض تغییر کرد.', 'success');
      render();
      return;
    }
    const filterBtn = event.target.closest('[data-order-filter]');
    if (filterBtn) {
      orderFilter = filterBtn.dataset.orderFilter;
      render();
      return;
    }
    const toggle = event.target.closest('[data-order-toggle]');
    if (toggle) {
      const details = root.querySelector(`[data-order-details="${toggle.dataset.orderToggle}"]`);
      if (details) {
        details.classList.toggle('hidden');
        toggle.textContent = details.classList.contains('hidden') ? 'جزئیات' : 'بستن';
      }
      return;
    }
    const rebuy = event.target.closest('[data-order-rebuy]');
    if (rebuy) {
      const order = nxOrders.find(rebuy.dataset.orderRebuy);
      if (!order) return;
      let added = 0;
      order.items.forEach((i) => {
        if (findProduct(i.id)) {
          const res = nxCart.add(i.id, { qty: i.qty || 1, color: i.color, warranty: i.warranty });
          if (res.ok) added++;
        }
      });
      nxToast(added ? `${nxFa(added)} محصول به سبد خرید اضافه شد.` : 'محصولات در دسترس نیستند.', added ? 'success' : 'error');
    }
  });

  root.addEventListener('submit', (event) => {
    if (event.target.id === 'profile-form') {
      event.preventDefault();
      const form = event.target;
      const patch = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim()
      };
      if (patch.firstName.length < 2 || patch.lastName.length < 2) {
        nxToast('نام و نام خانوادگی باید حداقل ۲ حرف باشند.', 'error');
        return;
      }
      if (!/^09\d{9}$/.test(patch.phone)) {
        nxToast('شماره موبایل معتبر نیست.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(patch.email)) {
        nxToast('ایمیل معتبر نیست.', 'error');
        return;
      }
      const result = nxAuth.updateProfile(patch);
      nxToast(result.message, result.ok ? 'success' : 'error');
      if (result.ok) {
        Object.assign(user, patch);
        render();
      }
      return;
    }

    if (event.target.id === 'address-form') {
      event.preventDefault();
      const form = event.target;
      const data = {
        title: form.title.value.trim() || 'آدرس',
        receiver: form.receiver.value.trim(),
        phone: form.phone.value.trim(),
        province: form.province.value.trim(),
        city: form.city.value.trim(),
        postalCode: form.postalCode.value.trim(),
        line: form.line.value.trim()
      };
      if (data.receiver.length < 2 || data.city.length < 2 || data.line.length < 10) {
        nxToast('نام، شهر و آدرس کامل را وارد کنید.', 'error');
        return;
      }
      if (!/^09\d{9}$/.test(data.phone)) {
        nxToast('شماره تماس معتبر نیست.', 'error');
        return;
      }
      const result = nxAddresses.add(data);
      editingAddress = false;
      nxToast(result.message, result.ok ? 'success' : 'error');
      render();
    }
  });

  render();
})();
