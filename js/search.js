/* ==========================================================================
   NEXORA — Live search suggestions (shared by every page header)
   ========================================================================== */

const NX_SEARCH_HOT = ['آیفون', 'سامسونگ', 'هدفون', 'لپ‌تاپ گیمینگ', 'پاوربانک'];

/* فارسی‌نویسی نام‌های لاتین: «آیفون» باید «iPhone» را پیدا کند. */
const NX_SEARCH_ALIASES = {
  'آیفون': 'iphone',
  'ایفون': 'iphone',
  'ایرپاد': 'airpods',
  'ایرپادز': 'airpods',
  'مک بوک': 'macbook',
  'مکبوک': 'macbook',
  'گلکسی': 'galaxy',
  'پلی استیشن': 'playstation',
  'پلی‌استیشن': 'playstation',
  'ایکس باکس': 'xbox',
  'ایکس‌باکس': 'xbox',
  'ایکسباکس': 'xbox',
  'نینتندو': 'nintendo',
  'ردمی': 'redmi',
  'پیکسل': 'pixel',
  'سرفیس': 'surface',
  'الجی': 'lg',
  'ال‌جی': 'lg'
};

function nxSearchProducts(query, limit = 7) {
  let q = String(query || '')
    .trim()
    .toLowerCase()
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ');
  if (!q) return [];
  Object.entries(NX_SEARCH_ALIASES).forEach(([fa, en]) => {
    q = q.split(fa).join(en);
  });
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = getProducts().map((p) => {
    let score = 0;
    terms.forEach((term) => {
      if (p.name.toLowerCase().includes(term)) score += 6;
      if (p.brand.toLowerCase().includes(term)) score += 5;
      if (p.catName.includes(term)) score += 4;
      if (p.subName.includes(term)) score += 3;
      if (p.searchText.includes(term)) score += 1;
    });
    return { p, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .slice(0, limit)
    .map((x) => x.p);
}

function nxSearchPanelHTML(query) {
  const q = query.trim();
  if (!q) {
    return `<div class="p-1">
      <div class="text-[10px] font-bold text-muted px-2 py-1.5">جستجوهای پرطرفدار</div>
      <div class="flex flex-wrap gap-1.5 px-1">
        ${NX_SEARCH_HOT.map((tag) => `<button type="button" class="chip !text-[11px] !py-1.5" data-search-tag="${tag}">
          <i data-lucide="trending-up" class="w-3 h-3"></i> ${tag}
        </button>`).join('')}
      </div>
      <div class="mt-2 px-1">
        ${CATEGORIES.slice(0, 4)
          .map(
            (c) => `<a href="${categoryUrl(c.id)}" class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-page text-[11px] text-ink/70">
              <i data-lucide="${c.icon}" class="w-3.5 h-3.5" style="color:${c.color}"></i> ${c.name}
            </a>`
          )
          .join('')}
      </div>
    </div>`;
  }

  const results = nxSearchProducts(q);
  if (!results.length) {
    return `<div class="p-4 text-center">
      <div class="empty-illu !w-12 !h-12 !rounded-2xl"><i data-lucide="search-x" class="w-5 h-5"></i></div>
      <div class="text-xs font-bold text-ink">نتیجه‌ای برای «${nxEscape(q)}» پیدا نشد</div>
      <p class="text-[11px] text-muted mt-1 leading-6">املای عبارت را بررسی کنید یا نام برند و دسته‌بندی را جستجو کنید.</p>
      <a href="products.html" class="btn btn-soft btn-sm mt-3">مشاهده همه محصولات</a>
    </div>`;
  }

  const cats = [...new Set(results.map((p) => p.cat))].slice(0, 3);

  return `<div class="p-1">
    ${cats.length ? `<div class="flex flex-wrap gap-1.5 px-1 pb-1.5">
      ${cats
        .map((id) => {
          const c = getCategory(id);
          return `<a href="${categoryUrl(id)}" class="chip !text-[10px] !py-1">${c ? c.name : id}</a>`;
        })
        .join('')}
    </div>` : ''}
    ${results
      .map(
        (p) => `<a href="product-details.html?id=${p.id}" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-page transition">
          <span class="w-11 h-11 rounded-lg bg-page border border-line grid place-items-center overflow-hidden shrink-0">
            <img src="${NXArt.product(p, 1)}" alt="" class="w-full h-full object-contain">
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-[11.5px] font-semibold text-ink truncate">${nxEscape(p.name)}</span>
            <span class="block text-[10px] text-muted mt-0.5">${p.brand} · ${p.catName}</span>
          </span>
          <span class="text-[11px] font-bold text-ink whitespace-nowrap">${nxNumber(p.price)} <span class="text-[9px] font-medium text-muted">تومان</span></span>
        </a>`
      )
      .join('')}
    <a href="products.html?q=${encodeURIComponent(q)}" class="flex items-center justify-center gap-1.5 mt-1.5 py-2 rounded-xl bg-primary-50 text-primary-700 text-[11px] font-bold hover:bg-primary-100 transition">
      نمایش همه نتایج برای «${nxEscape(q)}» <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
    </a>
  </div>`;
}

function nxBindSearchForm(form) {
  const input = form.querySelector('input[type="search"]');
  const panel = form.querySelector('[id^="nx-search-panel"]');
  const clear = form.querySelector('[data-search-clear]');
  if (!input || !panel) return;

  const close = () => panel.classList.add('hidden');
  const open = (html) => {
    panel.innerHTML = html;
    panel.classList.remove('hidden');
    nxIcons();
  };

  const render = () => {
    if (clear) clear.classList.toggle('hidden', !input.value);
    if (document.activeElement === input || input.value) open(nxSearchPanelHTML(input.value));
  };

  let timer = null;
  input.addEventListener('input', () => {
    if (clear) clear.classList.toggle('hidden', !input.value);
    clearTimeout(timer);
    timer = setTimeout(render, 110);
  });
  input.addEventListener('focus', render);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const q = input.value.trim();
    if (!q) {
      input.focus();
      return;
    }
    location.href = `products.html?q=${encodeURIComponent(q)}`;
  });

  form.addEventListener('click', (event) => {
    const tag = event.target.closest('[data-search-tag]');
    if (tag) {
      input.value = tag.dataset.searchTag;
      input.focus();
      render();
      event.preventDefault();
      return;
    }
    if (event.target.closest('[data-search-clear]')) {
      input.value = '';
      input.focus();
      if (event.target.closest('button').classList.contains('hidden')) return;
      render();
    }
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });

  document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

document.querySelectorAll('[data-nx-search]').forEach(nxBindSearchForm);
