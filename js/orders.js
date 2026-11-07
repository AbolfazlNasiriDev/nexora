/* ==========================================================================
   NEXORA — Orders list & reusable order card
   ========================================================================== */

function nxOrderStatusBadge(status) {
  const config = NX_ORDER_STATUS[status] || NX_ORDER_STATUS.processing;
  return `<span class="text-[9.5px] font-bold rounded-lg border px-2 py-1 ${config.tone}">${config.label}</span>`;
}

function nxOrderCard(order) {
  const items = order.items || [];
  const totals = order.totals || {};
  const count = items.reduce((sum, i) => sum + (i.qty || 1), 0);
  const paymentLabel = order.payment === 'cod' ? 'پرداخت در محل (نمایشی)' : 'پرداخت آنلاین (نمایشی)';
  const shippingLabel = NX_SHIPPING[order.shipping] ? NX_SHIPPING[order.shipping].label : 'ارسال عادی';
  const address = order.address || {};
  const customer = order.customer || {};

  return `<div class="card p-3.5 md:p-4">
    <div class="flex flex-wrap items-start justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <span class="w-10 h-10 rounded-xl bg-primary-50 text-primary grid place-items-center shrink-0"><i data-lucide="package" class="w-4 h-4"></i></span>
        <div>
          <div class="text-[12px] font-extrabold text-ink">سفارش ${order.code}</div>
          <div class="text-[9.5px] text-muted mt-1">${nxDate(order.createdAt)} · ${nxFa(count)} کالا · ${shippingLabel}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${nxOrderStatusBadge(order.status)}
        <span class="text-[11.5px] font-extrabold text-ink whitespace-nowrap">${nxNumber(totals.total)} <span class="text-[9px] font-medium text-muted">تومان</span></span>
      </div>
    </div>

    <div class="flex items-center gap-2 mt-3">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
        ${items
          .slice(0, 6)
          .map(
            (i) => `<a href="product-details.html?id=${i.id}" class="w-11 h-11 rounded-lg bg-page border border-line grid place-items-center overflow-hidden shrink-0" title="${nxEscape(i.name || '')}">
              <img src="${NXArt.art(i.art || 'generic', i.accent || '#5B45E8', 1)}" alt="${nxEscape(i.name || '')}" class="w-full h-full object-contain">
            </a>`
          )
          .join('')}
        ${items.length > 6 ? `<span class="text-[10px] text-muted">+${nxFa(items.length - 6)}</span>` : ''}
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button class="btn btn-outline btn-sm !text-[10px]" data-order-toggle="${order.id}">جزئیات</button>
        <button class="btn btn-soft btn-sm !text-[10px]" data-order-rebuy="${order.id}"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> خرید مجدد</button>
      </div>
    </div>

    <div class="hidden mt-3 pt-3 border-t border-line" data-order-details="${order.id}">
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl bg-page border border-line p-3">
          <div class="text-[10px] font-bold text-ink mb-1.5">اطلاعات تحویل</div>
          <div class="text-[10.5px] text-muted leading-6">${nxEscape((customer.firstName || '') + ' ' + (customer.lastName || ''))}</div>
          <div class="text-[10.5px] text-muted leading-6">${nxEscape(customer.phone || '')}</div>
          <div class="text-[10.5px] text-muted leading-6 mt-1">${nxEscape(address.province || '')}${address.city ? '، ' + nxEscape(address.city) : ''}، ${nxEscape(address.line || '')}</div>
          ${address.postalCode ? `<div class="text-[10px] text-muted mt-1">کد پستی: ${nxFa(address.postalCode)}</div>` : ''}
        </div>
        <div class="rounded-xl bg-page border border-line p-3">
          <div class="text-[10px] font-bold text-ink mb-1.5">اطلاعات پرداخت</div>
          <div class="text-[10.5px] text-muted">${paymentLabel}</div>
          <div class="text-[10.5px] text-muted mt-1">${shippingLabel}</div>
          <div class="mt-2 pt-2 border-t border-line space-y-1 text-[10px]">
            <div class="flex justify-between"><span class="text-muted">جمع کالاها</span><span>${nxNumber(totals.subtotal)}</span></div>
            ${totals.couponDiscount ? `<div class="flex justify-between text-emerald-600"><span>کد تخفیف</span><span>− ${nxNumber(totals.couponDiscount)}</span></div>` : ''}
            <div class="flex justify-between"><span class="text-muted">ارسال</span><span>${totals.shipping ? nxNumber(totals.shipping) : 'رایگان'}</span></div>
            <div class="flex justify-between font-bold text-ink pt-1"><span>مبلغ نهایی</span><span>${nxNumber(totals.total)}</span></div>
          </div>
        </div>
      </div>
      <div class="mt-2.5 space-y-1.5">
        ${items
          .map(
            (i) => `<div class="flex items-center gap-2 text-[10.5px]">
              <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
              <a href="product-details.html?id=${i.id}" class="flex-1 text-ink/80 hover:text-primary truncate">${nxEscape(i.name || '')}</a>
              <span class="text-muted">${nxFa(i.qty || 1)} عدد</span>
              <span class="font-bold text-ink">${nxNumber((i.price || 0) * (i.qty || 1))}</span>
            </div>`
          )
          .join('')}
      </div>
      <p class="text-[9.5px] text-muted mt-2 flex items-center gap-1"><i data-lucide="info" class="w-3 h-3"></i> این سفارش نمایشی است و در LocalStorage مرورگر ذخیره شده است.</p>
    </div>
  </div>`;
}

function nxOrderDetailsHTML(order) {
  return nxOrderCard(order);
}

(function nxOrdersPage() {
  const root = document.getElementById('orders-root');
  if (!root) return;

  const user = nxAuth.current();
  let filter = 'all';

  if (!user) {
    root.innerHTML = `<div class="card p-8 md:p-12 text-center">
      <div class="empty-illu"><i data-lucide="lock" class="w-8 h-8"></i></div>
      <h2 class="text-base font-extrabold text-ink">برای مشاهده سفارش‌ها وارد شوید</h2>
      <p class="text-[11.5px] text-muted mt-2">با ورود به حساب، سفارش‌های خود را پیگیری کنید.</p>
      <div class="flex items-center justify-center gap-2 mt-4">
        <a href="login.html?next=orders.html" class="btn btn-primary">ورود به حساب</a>
        <a href="register.html" class="btn btn-outline">ثبت‌نام</a>
      </div>
    </div>`;
    nxIcons();
    return;
  }

  function render() {
    const all = nxOrders.mine().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const counts = {
      all: all.length,
      processing: all.filter((o) => o.status === 'processing').length,
      shipped: all.filter((o) => o.status === 'shipped').length,
      delivered: all.filter((o) => o.status === 'delivered').length,
      canceled: all.filter((o) => o.status === 'canceled').length
    };
    const list = filter === 'all' ? all : all.filter((o) => o.status === filter);
    const tabs = [
      ['all', 'همه سفارش‌ها'],
      ['processing', 'در حال پردازش'],
      ['shipped', 'ارسال شده'],
      ['delivered', 'تحویل شده'],
      ['canceled', 'لغو شده']
    ];

    root.innerHTML = `
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
        ${tabs
          .map(
            ([key, label]) => `<button class="chip whitespace-nowrap ${filter === key ? 'is-active' : ''}" data-order-filter="${key}">
              ${label} <span class="${filter === key ? 'text-white/70' : 'text-muted'}">${nxFa(counts[key])}</span>
            </button>`
          )
          .join('')}
      </div>
      ${list.length
        ? `<div class="space-y-3">${list.map(nxOrderCard).join('')}</div>`
        : `<div class="card p-8 text-center">
            <div class="empty-illu"><i data-lucide="package-search" class="w-8 h-8"></i></div>
            <h2 class="text-sm font-bold text-ink">سفارشی در این وضعیت وجود ندارد</h2>
            <p class="text-[11px] text-muted mt-1.5">پس از ثبت سفارش، وضعیت آن در این بخش نمایش داده می‌شود.</p>
            <a href="products.html" class="btn btn-primary btn-sm mt-4">مشاهده محصولات</a>
          </div>`}
      <div class="card p-3 mt-4 flex items-center gap-2">
        <i data-lucide="info" class="w-4 h-4 text-primary shrink-0"></i>
        <p class="text-[10px] text-muted leading-5">وضعیت سفارش‌ها در این نسخه نمایشی توسط پنل مدیریت فروشگاه قابل تغییر است. تغییرات بلافاصله در این صفحه نمایش داده می‌شوند.</p>
      </div>`;
    nxIcons();
  }

  root.addEventListener('click', (event) => {
    const filterBtn = event.target.closest('[data-order-filter]');
    if (filterBtn) {
      filter = filterBtn.dataset.orderFilter;
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
      nxToast(added ? `${nxFa(added)} محصول به سبد خرید اضافه شد.` : 'محصولات این سفارش در دسترس نیستند.', added ? 'success' : 'error', {
        action: added ? { label: 'مشاهده سبد خرید', href: 'cart.html' } : null
      });
    }
  });

  render();
})();
