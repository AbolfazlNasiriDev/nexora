/* ==========================================================================
   NEXORA — Cart page
   ========================================================================== */

(function nxCartPage() {
  const root = document.getElementById('cart-root');
  if (!root) return;

  const COUPON_HINTS = [
    ['NEXORA10', '۱۰٪ تخفیف'],
    ['WELCOME5', '۵٪ خوش‌آمدگویی'],
    ['GAMING15', '۱۵٪ بالای ۲۰ میلیون']
  ];

  function itemRow(item) {
    const p = item.product;
    return `<div class="flex flex-col sm:flex-row gap-3 p-3 md:p-4 border-b border-line last:border-0">
      <a href="product-details.html?id=${p.id}" class="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-page border border-line grid place-items-center overflow-hidden shrink-0">
        <img src="${NXArt.product(p, 1)}" alt="${nxEscape(p.name)}" class="w-full h-full object-contain">
      </a>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <a href="product-details.html?id=${p.id}" class="text-[13px] font-bold text-ink leading-6 line-clamp-2 hover:text-primary">${nxEscape(p.name)}</a>
            <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span class="chip !text-[9.5px] !py-0.5 !cursor-default">${nxEscape(p.brand)}</span>
              <span class="chip !text-[9.5px] !py-0.5 !cursor-default"><span class="w-2.5 h-2.5 rounded-full border border-black/10" style="background:${(p.colors.find((c) => c.name === item.color) || {}).hex || '#ccc'}"></span> ${nxEscape(item.color || '')}</span>
              <span class="chip !text-[9.5px] !py-0.5 !cursor-default">${nxEscape(item.warranty || '')}</span>
            </div>
          </div>
          <button class="text-muted hover:text-rose-500 shrink-0" data-cart-remove="${nxEscape(item.key)}" aria-label="حذف محصول">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="flex flex-wrap items-end justify-between gap-3 mt-3">
          <div class="flex items-center border border-line rounded-xl overflow-hidden bg-white">
            <button class="w-8 h-8 grid place-items-center text-muted hover:bg-page" data-cart-inc="${nxEscape(item.key)}" aria-label="افزایش"><i data-lucide="plus" class="w-3.5 h-3.5"></i></button>
            <span class="w-9 text-center text-[12px] font-extrabold">${nxFa(item.qty)}</span>
            <button class="w-8 h-8 grid place-items-center text-muted hover:bg-page" data-cart-dec="${nxEscape(item.key)}" aria-label="کاهش"><i data-lucide="minus" class="w-3.5 h-3.5"></i></button>
          </div>
          <div class="text-left">
            ${p.oldPrice ? `<div class="text-[10px] text-muted line-through">${nxNumber(p.oldPrice * item.qty)}</div>` : ''}
            <div class="text-[13px] font-extrabold text-ink">${nxNumber(p.price * item.qty)} <span class="text-[9px] font-medium text-muted">تومان</span></div>
            ${p.discount ? `<div class="text-[9.5px] text-emerald-600 font-semibold mt-0.5">${nxFa(p.discount)}٪ تخفیف</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  }

  function summary(totals) {
    return `<div class="card p-4 md:p-5 sticky top-28">
      <h2 class="text-sm font-extrabold text-ink mb-3 flex items-center gap-2"><i data-lucide="receipt-text" class="w-4 h-4 text-primary"></i> خلاصه سفارش</h2>

      <!-- shipping -->
      <div class="mb-4">
        <div class="text-[11px] font-bold text-ink mb-2">روش ارسال</div>
        <div class="space-y-2">
          ${Object.entries(NX_SHIPPING)
            .map(([key, option]) => {
              const active = totals.shippingMethod === key;
              const free = key === 'normal' && totals.subtotal >= NX_FREE_SHIPPING_MIN;
              return `<label class="flex items-center gap-2.5 rounded-xl border p-2.5 cursor-pointer transition ${active ? 'border-primary bg-primary-50/40' : 'border-line hover:border-primary-200'}">
                <input type="radio" name="shipping" value="${key}" ${active ? 'checked' : ''} class="accent-primary">
                <span class="flex-1">
                  <span class="block text-[11.5px] font-semibold text-ink">${option.label}</span>
                  <span class="block text-[10px] text-muted mt-0.5">${option.time}</span>
                </span>
                <span class="text-[10.5px] font-bold ${free ? 'text-emerald-600' : 'text-ink'}">${free ? 'رایگان' : `${nxNumber(option.price)} تومان`}</span>
              </label>`;
            })
            .join('')}
        </div>
      </div>

      <!-- coupon -->
      <div class="mb-4">
        <div class="text-[11px] font-bold text-ink mb-2">کد تخفیف</div>
        ${totals.coupon
          ? `<div class="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5">
              <div class="flex items-center gap-2">
                <i data-lucide="badge-percent" class="w-4 h-4 text-emerald-600"></i>
                <div>
                  <div class="text-[11px] font-bold text-emerald-700">${nxEscape(totals.coupon.code)}</div>
                  <div class="text-[9.5px] text-emerald-600 mt-0.5">${nxEscape(totals.coupon.label)}</div>
                </div>
              </div>
              <button class="text-[10px] font-bold text-rose-600" data-remove-coupon>حذف</button>
            </div>`
          : `<form id="coupon-form" class="flex gap-2">
              <input class="field !py-2 !text-[11px]" placeholder="کد تخفیف را وارد کنید" name="coupon" autocomplete="off">
              <button class="btn btn-outline btn-sm shrink-0" type="submit">اعمال</button>
            </form>`}
        <div class="flex flex-wrap gap-1.5 mt-2">
          ${COUPON_HINTS.map(
            ([code, label]) => `<button class="chip !text-[9.5px] !py-0.5" data-coupon-hint="${code}" title="${label}">${code}</button>`
          ).join('')}
        </div>
      </div>

      <!-- totals -->
      <div class="space-y-2 text-[11.5px] border-t border-line pt-3">
        <div class="flex items-center justify-between"><span class="text-muted">جمع کل (${nxFa(totals.count)} کالا)</span><span class="font-semibold">${nxNumber(totals.subtotal)} تومان</span></div>
        ${totals.productDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>تخفیف محصولات</span><span class="font-semibold">${nxNumber(totals.productDiscount)} تومان</span></div>` : ''}
        ${totals.couponDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>کد تخفیف</span><span class="font-semibold">${nxNumber(totals.couponDiscount)} تومان</span></div>` : ''}
        <div class="flex items-center justify-between"><span class="text-muted">هزینه ارسال</span><span class="font-semibold ${totals.shipping === 0 ? 'text-emerald-600' : ''}">${totals.shipping === 0 ? 'رایگان' : `${nxNumber(totals.shipping)} تومان`}</span></div>
        <div class="flex items-center justify-between pt-2 border-t border-line mt-1">
          <span class="font-extrabold text-ink text-[12.5px]">مبلغ قابل پرداخت</span>
          <span class="font-black text-ink text-base">${nxNumber(totals.total)} <span class="text-[9px] font-medium text-muted">تومان</span></span>
        </div>
        ${totals.saved ? `<div class="rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold text-center py-1.5">${nxNumber(totals.saved)} تومان سود شما از این خرید</div>` : ''}
      </div>

      <a href="checkout.html" class="btn btn-primary btn-lg btn-block mt-3">
        <i data-lucide="credit-card" class="w-[18px] h-[18px]"></i> ادامه و پرداخت
      </a>
      <div class="flex items-center justify-center gap-3 text-[9.5px] text-muted mt-3">
        <span class="inline-flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>پرداخت امن</span>
        <span class="inline-flex items-center gap-1"><i data-lucide="truck" class="w-3.5 h-3.5 text-primary"></i>ارسال tracked</span>
        <span class="inline-flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-amber-500"></i>۷ روز بازگشت</span>
      </div>
    </div>`;
  }

  function render() {
    const totals = nxCartTotals();
    if (!totals.items.length) {
      root.innerHTML = `<div class="card p-8 md:p-12 text-center">
        <div class="empty-illu"><i data-lucide="shopping-bag" class="w-9 h-9"></i></div>
        <h2 class="text-base font-extrabold text-ink">سبد خرید شما خالی است</h2>
        <p class="text-[11.5px] text-muted mt-2 leading-6 max-w-md mx-auto">هنوز محصولی به سبد اضافه نکرده‌اید. از میان محصولات منتخب NEXORA انتخاب کنید و خرید خود را شروع کنید.</p>
        <div class="flex flex-wrap items-center justify-center gap-2 mt-5">
          <a href="products.html" class="btn btn-primary">مشاهده همه محصولات</a>
          <a href="products.html?deals=1" class="btn btn-outline"><i data-lucide="flame" class="w-4 h-4 text-rose-500"></i> پیشنهاد شگفت‌انگیز</a>
        </div>
      </div>`;
      nxIcons();
      return;
    }

    root.innerHTML = `<div class="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-3 md:gap-4 items-start">
      <div class="space-y-3">
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between p-3 md:p-4 border-b border-line">
            <div class="text-[12px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="package" class="w-4 h-4 text-primary"></i> ${nxFa(totals.count)} کالا در سبد</div>
            <button class="text-[10px] font-bold text-rose-600 hover:underline" data-clear-cart>حذف همه</button>
          </div>
          ${totals.items.map(itemRow).join('')}
        </div>
        <div class="card p-3 flex flex-wrap items-center justify-between gap-2">
          <span class="text-[10.5px] text-muted inline-flex items-center gap-1.5"><i data-lucide="info" class="w-3.5 h-3.5 text-primary"></i>برای خریدهای بالای ${nxNumber(NX_FREE_SHIPPING_MIN)} تومان، ارسال عادی رایگان است.</span>
          <a href="products.html" class="text-[10.5px] font-bold text-primary">افزودن محصول دیگر</a>
        </div>
      </div>
      ${summary(totals)}
    </div>`;
    nxIcons();
  }

  document.addEventListener('nx:cart', render);

  root.addEventListener('submit', (event) => {
    if (event.target.id !== 'coupon-form') return;
    event.preventDefault();
    const code = event.target.querySelector('input').value;
    const totals = nxCartTotals();
    const result = nxApplyCoupon(code, totals.subtotal);
    nxToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) render();
  });

  root.addEventListener('click', (event) => {
    const hint = event.target.closest('[data-coupon-hint]');
    if (hint) {
      const input = document.querySelector('#coupon-form input');
      if (input) {
        input.value = hint.dataset.couponHint;
        input.focus();
      }
      return;
    }
    if (event.target.closest('[data-remove-coupon]')) {
      nxSetCoupon(null);
      nxToast('کد تخفیف حذف شد.', 'info');
      return;
    }
    if (event.target.closest('[data-clear-cart]')) {
      if (!nxCart.isEmpty() && confirm('همه محصولات از سبد خرید حذف شوند؟')) {
        nxCart.clear();
        nxToast('سبد خرید خالی شد.', 'info');
      }
    }
  });

  root.addEventListener('change', (event) => {
    if (event.target.name === 'shipping') {
      nxSetShipping(event.target.value);
      nxToast('روش ارسال به‌روزرسانی شد.', 'success');
      render();
    }
  });

  render();
})();
