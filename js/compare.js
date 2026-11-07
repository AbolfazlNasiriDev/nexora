/* ==========================================================================
   NEXORA — Product comparison
   ========================================================================== */

(function nxComparePage() {
  const root = document.getElementById('compare-root');
  if (!root) return;

  function pickerHTML(items) {
    const available = getProducts().filter((p) => !items.some((i) => i.id === p.id));
    return `<div class="flex flex-wrap items-center gap-2">
      <select id="compare-select" class="field !w-auto !text-[11px] !py-1.5 !rounded-xl !ps-9" ${items.length >= nxCompare.max ? 'disabled' : ''}>
        <option value="">افزودن محصول به مقایسه…</option>
        ${available
          .map((p) => `<option value="${p.id}">${nxEscape(p.name)} — ${nxNumber(p.price)} تومان</option>`)
          .join('')}
      </select>
      ${items.length ? `<button class="text-[10px] font-bold text-rose-600 hover:underline" data-compare-clear>پاک کردن همه</button>` : ''}
    </div>`;
  }

  function cellRow(label, values, options = {}) {
    const normalized = values.map((v) => String(v ?? '—'));
    const isDiff = new Set(normalized).size > 1;
    return `<tr>
      <th class="is-sticky ${options.muted ? 'font-medium text-muted' : ''}">${label}</th>
      ${normalized
        .map(
          (v) => `<td class="${isDiff ? 'cmp-diff' : ''} ${options.strong ? 'font-bold text-ink' : 'text-ink/80'}">${v}</td>`
        )
        .join('')}
    </tr>`;
  }

  function render() {
    const items = nxCompare.products();

    if (!items.length) {
      const suggestions = getProducts()
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      root.innerHTML = `<div class="card p-6 md:p-8">
        <div class="text-center max-w-lg mx-auto">
          <div class="empty-illu"><i data-lucide="git-compare" class="w-9 h-9"></i></div>
          <h2 class="text-base font-extrabold text-ink">لیست مقایسه خالی است</h2>
          <p class="text-[11.5px] text-muted mt-2 leading-6">از دکمه مقایسه روی کارت محصولات یا فهرست زیر استفاده کنید. می‌توانید تا ۴ محصول را هم‌زمان بررسی کنید.</p>
          <div class="mt-4 flex justify-center">${pickerHTML(items)}</div>
        </div>
        <div class="mt-7">
          <div class="text-[11px] font-bold text-muted mb-2 text-center">پیشنهاد برای شروع مقایسه</div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            ${suggestions.map((p) => nxProductCard(p)).join('')}
          </div>
        </div>
      </div>`;
      nxIcons();
      nxRefreshBadges();
      return;
    }

    const specKeys = [...new Set(items.flatMap((p) => Object.keys(p.specs)))];

    root.innerHTML = `
      <div class="card p-3 mb-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="w-8 h-8 rounded-xl bg-primary-50 text-primary grid place-items-center"><i data-lucide="git-compare" class="w-4 h-4"></i></span>
          <div>
            <div class="text-[12px] font-extrabold text-ink">${nxFa(items.length)} محصول انتخاب شده</div>
            <div class="text-[10px] text-muted mt-0.5">مقادیر متفاوت با رنگ زرد مشخص شده‌اند.</div>
          </div>
        </div>
        ${pickerHTML(items)}
      </div>

      ${items.length < 2 ? `<div class="card p-3 mb-3 border-amber-200 bg-amber-50 flex items-center gap-2">
        <i data-lucide="info" class="w-4 h-4 text-amber-600"></i>
        <p class="text-[11px] text-amber-700">برای مقایسه دقیق، حداقل یک محصول دیگر اضافه کنید.</p>
      </div>` : ''}

      <div class="card overflow-x-auto scroll-thin">
        <table class="nx-table cmp-table !text-[11px]">
          <thead>
            <tr>
              <th class="is-sticky align-bottom !bg-white !text-[11px] !font-extrabold !text-ink">
                <div class="mb-2">مشخصات محصول</div>
                <div class="flex items-center gap-1.5 text-[10px] font-medium text-muted">
                  <i data-lucide="info" class="w-3.5 h-3.5"></i> انتخاب از فهرست
                </div>
              </th>
              ${items
                .map(
                  (p) => `<th class="align-top !bg-white !text-right">
                    <div class="relative">
                      <button class="absolute top-0 left-0 z-10 w-6 h-6 rounded-lg bg-white border border-line grid place-items-center text-muted hover:text-rose-500" data-compare-remove="${p.id}" aria-label="حذف از مقایسه">
                        <i data-lucide="x" class="w-3 h-3"></i>
                      </button>
                      <a href="product-details.html?id=${p.id}" class="block w-24 h-24 mx-auto rounded-xl bg-page border border-line overflow-hidden">
                        <img src="${NXArt.product(p, 1)}" alt="${nxEscape(p.name)}" class="w-full h-full object-contain">
                      </a>
                      <a href="product-details.html?id=${p.id}" class="block text-[11px] font-bold text-ink leading-5 mt-2 hover:text-primary line-clamp-2 min-h-[2.5rem]">${nxEscape(p.name)}</a>
                      <div class="text-[11px] font-extrabold text-primary mt-1.5">${nxNumber(p.price)} <span class="text-[9px] font-medium text-muted">تومان</span></div>
                      <button class="btn btn-primary btn-sm btn-block mt-2" data-add-to-cart="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
                        <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>${p.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}
                      </button>
                    </div>
                  </th>`
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${cellRow('برند', items.map((p) => nxEscape(p.brand)))}
            ${cellRow('دسته‌بندی', items.map((p) => nxEscape(p.subName || p.catName)))}
            ${cellRow('قیمت (تومان)', items.map((p) => nxNumber(p.price)), { strong: true })}
            ${cellRow('قیمت قبل از تخفیف', items.map((p) => (p.oldPrice ? nxNumber(p.oldPrice) : '—')), { muted: true })}
            ${cellRow('تخفیف', items.map((p) => (p.discount ? `${nxFa(p.discount)}٪` : '—')))}
            ${cellRow('امتیاز کاربران', items.map((p) => `${nxFa(p.rating)} از ۵ (${nxFa(p.reviews)} نظر)`))}
            ${cellRow(
              'موجودی',
              items.map((p) =>
                p.stock <= 0
                  ? '<span class="text-rose-600 font-semibold">ناموجود</span>'
                  : p.stock <= 5
                    ? `<span class="text-amber-600 font-semibold">${nxFa(p.stock)} عدد</span>`
                    : '<span class="text-emerald-600 font-semibold">موجود</span>'
              )
            )}
            ${cellRow('گارانتی', items.map((p) => nxEscape(p.warranties[0] || '—')))}
            ${specKeys
              .map((key) => cellRow(nxEscape(key), items.map((p) => nxEscape(p.specs[key] || '—'))))
              .join('')}
            <tr>
              <th class="is-sticky">ویژگی‌ها</th>
              ${items
                .map(
                  (p) => `<td class="text-ink/75">
                    <ul class="space-y-1.5">
                      ${p.features.map((f) => `<li class="flex items-start gap-1.5"><i data-lucide="check" class="w-3 h-3 text-emerald-500 mt-1 shrink-0"></i>${nxEscape(f)}</li>`).join('')}
                    </ul>
                  </td>`
                )
                .join('')}
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 mt-3">
        <p class="text-[10px] text-muted">مقایسه بر اساس داده‌های نمونه NEXORA انجام شده است.</p>
        <div class="flex items-center gap-2">
          <a href="wishlist.html" class="btn btn-outline btn-sm"><i data-lucide="heart" class="w-4 h-4"></i> علاقه‌مندی‌ها</a>
          <a href="products.html" class="btn btn-soft btn-sm">افزودن محصول دیگر</a>
        </div>
      </div>`;

    nxIcons();
    nxRefreshBadges();
  }

  document.addEventListener('nx:compare', render);

  document.addEventListener('change', (event) => {
    if (event.target.id !== 'compare-select') return;
    const id = event.target.value;
    if (!id) return;
    const result = nxCompare.toggle(id);
    if (result.error) nxToast(result.error, 'error');
    else nxToast('محصول به مقایسه اضافه شد.', 'success');
  });

  document.addEventListener('click', (event) => {
    const remove = event.target.closest('[data-compare-remove]');
    if (remove) {
      nxCompare.remove(remove.dataset.compareRemove);
      nxToast('محصول از لیست مقایسه حذف شد.', 'info');
      return;
    }
    if (event.target.closest('[data-compare-clear]')) {
      nxCompare.clear();
      nxToast('لیست مقایسه پاک شد.', 'info');
    }
  });

  render();
})();
