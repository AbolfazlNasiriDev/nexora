/* ==========================================================================
   NEXORA — Product listing (products.html + category.html)
   Real filtering, sorting, pagination and URL state.
   ========================================================================== */

(function nxCatalog() {
  const PAGE = document.body.dataset.page;
  const params = new URLSearchParams(location.search);
  const PAGE_SIZE = 12;

  const state = {
    q: (params.get('q') || '').trim(),
    cat: params.get('cat') || '',
    sub: params.get('sub') || '',
    brands: params.getAll('brand').filter(Boolean),
    colors: (params.get('colors') || '').split('|').filter(Boolean),
    min: Number(params.get('min')) || 0,
    max: Number(params.get('max')) || 0,
    stock: params.get('stock') === '1',
    discount: Number(params.get('discount')) || 0,
    rating: Number(params.get('rating')) || 0,
    deals: params.get('deals') === '1',
    specs: {},
    sort: params.get('sort') || 'relevance',
    page: Math.max(1, Number(params.get('page')) || 1)
  };

  params.getAll('f').forEach((entry) => {
    const idx = entry.indexOf(':');
    if (idx < 1) return;
    const key = entry.slice(0, idx);
    const value = entry.slice(idx + 1);
    state.specs[key] = [...(state.specs[key] || []), value];
  });

  let category = null;
  if (PAGE === 'category') {
    category = getCategory(state.cat);
    if (!category) {
      location.replace('products.html');
      return;
    }
    if (state.sub && !category.subs.some((s) => s.id === state.sub)) state.sub = '';
  }

  const el = {
    grid: document.getElementById('listing-grid'),
    toolbar: document.getElementById('listing-toolbar'),
    pagination: document.getElementById('listing-pagination'),
    active: document.getElementById('active-filters'),
    filtersDesktop: document.getElementById('filters-root-desktop'),
    filtersMobile: document.getElementById('filters-root-mobile'),
    overlay: document.getElementById('filters-overlay'),
    panel: document.getElementById('filters-mobile'),
    breadcrumb: document.getElementById('breadcrumb'),
    hero: document.getElementById('category-hero')
  };

  /* -------------------------------- data --------------------------------- */
  function baseList() {
    let list = getProducts();
    if (category) list = list.filter((p) => p.cat === category.id);
    if (state.sub) list = list.filter((p) => p.sub === state.sub);
    if (state.deals) list = list.filter((p) => p.discount > 0);
    if (state.q) {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      list = list.filter((p) => {
        const haystack = `${p.name} ${p.brand} ${p.catName} ${p.subName} ${p.searchText}`.toLowerCase();
        return terms.every((t) => haystack.includes(t));
      });
    }
    return list;
  }

  function filteredList() {
    let list = baseList();
    if (state.brands.length) list = list.filter((p) => state.brands.includes(p.brand));
    if (state.colors.length) list = list.filter((p) => p.colors.some((c) => state.colors.includes(c.name)));
    if (state.min) list = list.filter((p) => p.price >= state.min);
    if (state.max) list = list.filter((p) => p.price <= state.max);
    if (state.stock) list = list.filter((p) => p.stock > 0);
    if (state.discount) list = list.filter((p) => p.discount >= state.discount);
    if (state.rating) list = list.filter((p) => p.rating >= state.rating);
    const specDefs = category ? getCategoryFilters(category.id) : [];
    specDefs.forEach((def) => {
      const chosen = state.specs[def.key];
      if (chosen && chosen.length) list = list.filter((p) => chosen.includes(p.filters[def.key]));
    });
    return list;
  }

  function sortedList(list) {
    const copy = [...list];
    switch (state.sort) {
      case 'popular':
        return copy.sort((a, b) => b.reviews - a.reviews);
      case 'newest':
        return copy.sort(
          (a, b) => Number((b.tags || []).includes('new')) - Number((a.tags || []).includes('new')) || b.reviews - a.reviews
        );
      case 'price-asc':
        return copy.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return copy.sort((a, b) => b.price - a.price);
      case 'discount':
        return copy.sort((a, b) => b.discount - a.discount);
      case 'rating':
        return copy.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      default:
        return copy.sort((a, b) => b.rating * 10 + b.reviews / 100 - (a.rating * 10 + a.reviews / 100));
    }
  }

  function countBy(list, getKey) {
    return list.reduce((acc, item) => {
      const keys = [].concat(getKey(item));
      keys.filter(Boolean).forEach((key) => {
        acc[key] = (acc[key] || 0) + 1;
      });
      return acc;
    }, {});
  }

  function activeFilterCount() {
    return (
      state.brands.length +
      state.colors.length +
      (state.min || state.max ? 1 : 0) +
      (state.stock ? 1 : 0) +
      (state.discount ? 1 : 0) +
      (state.rating ? 1 : 0) +
      (state.deals ? 1 : 0) +
      Object.values(state.specs).reduce((sum, arr) => sum + arr.length, 0)
    );
  }

  /* ------------------------------- header -------------------------------- */
  function renderBreadcrumb() {
    const parts = [`<a href="products.html" class="hover:text-primary">محصولات</a>`];
    if (category) {
      parts.push(`<a href="${categoryUrl(category.id)}" class="hover:text-primary">${category.name}</a>`);
      if (state.sub) {
        const sub = category.subs.find((s) => s.id === state.sub);
        if (sub) parts.push(`<span class="text-ink font-medium">${sub.name}</span>`);
      }
    }
    if (state.q) parts.push(`<span class="text-ink font-medium">جستجو: ${nxEscape(state.q)}</span>`);
    el.breadcrumb.innerHTML = `<a href="index.html" class="hover:text-primary">خانه</a>
      <i data-lucide="chevron-left" class="w-3 h-3"></i>${parts.join('<i data-lucide="chevron-left" class="w-3 h-3"></i>')}`;
  }

  function renderCategoryHero() {
    if (!category) {
      document.title = state.q ? `نتایج جستجو «${state.q}» | NEXORA` : 'همه محصولات | NEXORA';
      const title = document.getElementById('page-title');
      const desc = document.getElementById('page-desc');
      if (state.q) {
        title.textContent = `نتایج جستجو برای «${state.q}»`;
        desc.textContent = 'محصولات مطابق با عبارت جستجوی شما. می‌توانید نتایج را با فیلترهای سمت راست دقیق‌تر کنید.';
      } else if (state.deals) {
        title.textContent = 'پیشنهادهای شگفت‌انگیز NEXORA';
        desc.textContent = 'محصولات دارای تخفیف فعال؛ فرصت محدود است. قیمت‌های نمایش‌داده‌شده نمونه هستند.';
      }
      const quick = document.getElementById('quick-cats');
      if (quick) {
        quick.innerHTML = CATEGORIES.map(
          (c) => `<a href="${categoryUrl(c.id)}" class="chip whitespace-nowrap">
            <i data-lucide="${c.icon}" class="w-3.5 h-3.5" style="color:${c.color}"></i>${c.name}
          </a>`
        ).join('');
      }
      return;
    }

    const sub = category.subs.find((s) => s.id === state.sub);
    const total = getProducts().filter((p) => p.cat === category.id).length;
    document.title = `${sub ? sub.name : category.name} | NEXORA`;
    document.body.dataset.cat = category.id;
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.getAttribute('href') === categoryUrl(category.id)) link.classList.add('is-active');
    });

    if (!el.hero) return;
    el.hero.innerHTML = `<div class="relative overflow-hidden rounded-3xl border border-line p-5 md:p-7" style="background:linear-gradient(120deg, ${category.tint} 0%, #FFFFFF 62%)">
      <div class="absolute -left-8 -bottom-10 opacity-[.08] pointer-events-none" style="color:${category.color}">
        <i data-lucide="${category.icon}" class="w-52 h-52"></i>
      </div>
      <div class="relative flex flex-wrap items-start gap-4">
        <span class="w-14 h-14 rounded-2xl grid place-items-center text-white shrink-0 shadow-soft" style="background:${category.color}">
          <i data-lucide="${category.icon}" class="w-7 h-7"></i>
        </span>
        <div class="flex-1 min-w-[220px]">
          <div class="flex items-center gap-2 text-[10px] font-semibold text-muted">
            <span>دسته‌بندی محصولات</span><span class="divider-dot"></span><span>${nxFa(total)} محصول</span>
            <span class="divider-dot"></span><span>${nxFa(category.subs.length)} زیردسته</span>
          </div>
          <h1 class="text-xl md:text-2xl font-black text-ink mt-1.5">${sub ? sub.name : category.name}</h1>
          <p class="text-[11.5px] leading-6 text-muted mt-1.5 max-w-2xl">${sub ? `${sub.name} — ${category.desc}` : category.desc}</p>
        </div>
      </div>
      <div class="relative flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-0.5">
        <a href="category.html?cat=${category.id}" class="chip whitespace-nowrap ${!state.sub ? 'is-active' : ''}">همه محصولات</a>
        ${category.subs
          .map(
            (s) => `<a href="category.html?cat=${category.id}&sub=${s.id}" class="chip whitespace-nowrap ${state.sub === s.id ? 'is-active' : ''}">${s.name}</a>`
          )
          .join('')}
      </div>
    </div>`;
  }

  /* -------------------------------- filters ------------------------------- */
  function filterGroup(title, body, open = true) {
    return `<details class="filter-group" ${open ? 'open' : ''}>
      <summary class="flex items-center justify-between py-2.5 cursor-pointer">
        <span class="text-[12px] font-bold text-ink">${title}</span>
        <i data-lucide="chevron-down" class="chev w-4 h-4 text-muted transition-transform"></i>
      </summary>
      <div class="pb-3">${body}</div>
    </details>`;
  }

  function filtersHTML() {
    const base = baseList();
    const brandCounts = countBy(base, (p) => p.brand);
    const brands = Object.keys(brandCounts).sort();
    const colorCounts = {};
    base.forEach((p) =>
      p.colors.forEach((c) => {
        colorCounts[c.name] = (colorCounts[c.name] || 0) + 1;
      })
    );
    const specDefs = category ? getCategoryFilters(category.id) : [];

    return `<div class="flex items-center justify-between mb-1">
      <div class="text-[13px] font-extrabold text-ink flex items-center gap-2">
        <i data-lucide="sliders-horizontal" class="w-4 h-4 text-primary"></i> فیلترها
        ${activeFilterCount() ? `<span class="text-[10px] bg-primary text-white rounded-full px-1.5 py-0.5">${nxFa(activeFilterCount())}</span>` : ''}
      </div>
      <button class="text-[10px] font-bold text-rose-600 hover:underline" data-clear-filters>پاک کردن همه</button>
    </div>

    ${filterGroup(
      'محدوده قیمت',
      `<div class="flex items-center gap-2">
        <input type="number" inputmode="numeric" class="field !py-2 !text-[11px]" placeholder="از (تومان)" value="${state.min || ''}" data-price="min" min="0">
        <span class="text-muted text-xs">—</span>
        <input type="number" inputmode="numeric" class="field !py-2 !text-[11px]" placeholder="تا (تومان)" value="${state.max || ''}" data-price="max" min="0">
      </div>
      <div class="flex flex-wrap gap-1.5 mt-2.5">
        ${[
          ['زیر ۵ میلیون', '0', '5000000'],
          ['۵ تا ۳۰ میلیون', '5000000', '30000000'],
          ['۳۰ تا ۸۰ میلیون', '30000000', '80000000'],
          ['بالای ۸۰ میلیون', '80000000', '']
        ]
          .map(
            ([label, min, max]) =>
              `<button class="chip !text-[10px] !py-1 ${String(state.min) === min && String(state.max) === max ? 'is-active' : ''}" data-price-range="${min}-${max}">${label}</button>`
          )
          .join('')}
      </div>`,
      false
    )}

    ${filterGroup(
      'برند',
      `<div class="max-h-52 overflow-y-auto scroll-thin pe-1 space-y-2">
        ${brands
          .map(
            (brand) => `<label class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" class="check" data-brand="${nxEscape(brand)}" ${state.brands.includes(brand) ? 'checked' : ''}>
              <span class="flex-1 text-[11.5px] text-ink/80 group-hover:text-primary">${nxEscape(brand)}</span>
              <span class="text-[10px] text-muted">${nxFa(brandCounts[brand])}</span>
            </label>`
          )
          .join('') || '<p class="text-[11px] text-muted">برندی برای این فیلتر یافت نشد.</p>'}
      </div>`
    )}

    ${filterGroup(
      'رنگ',
      `<div class="flex flex-wrap gap-2">
        ${Object.entries(colorCounts)
          .map(([name, count]) => {
            const color = Object.values(NX_COLORS).find((c) => c.name === name);
            return `<button class="flex items-center gap-1.5 rounded-xl border px-2 py-1 text-[10px] transition ${
              state.colors.includes(name) ? 'border-primary bg-primary-50 text-primary-700 font-semibold' : 'border-line text-ink/70 hover:border-primary-200'
            }" data-color="${nxEscape(name)}" title="${name}">
              <span class="w-3.5 h-3.5 rounded-full border border-black/10" style="background:${color ? color.hex : '#ccc'}"></span>
              ${name} <span class="text-muted">${nxFa(count)}</span>
            </button>`;
          })
          .join('')}
      </div>`
    )}

    ${filterGroup(
      'میزان تخفیف',
      `<div class="flex flex-wrap gap-1.5">
        ${[0, 10, 20, 30]
          .map(
            (d) =>
              `<button class="chip !text-[10px] !py-1 ${state.discount === d ? 'is-active' : ''}" data-discount="${d}">${d ? `بالای ${nxFa(d)}٪` : 'همه'}</button>`
          )
          .join('')}
      </div>`
    )}

    ${filterGroup(
      'امتیاز کاربران',
      `<div class="flex flex-wrap gap-1.5">
        ${[0, 4, 4.5]
          .map(
            (r) =>
              `<button class="chip !text-[10px] !py-1 ${state.rating === r ? 'is-active' : ''}" data-rate="${r}">
                ${r ? `${nxFa(r)} به بالا` : 'همه'}
              </button>`
          )
          .join('')}
      </div>`
    )}

    ${filterGroup(
      'وضعیت کالا',
      `<div class="space-y-2.5">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="check" data-stock ${state.stock ? 'checked' : ''}>
          <span class="text-[11.5px] text-ink/80">فقط کالاهای موجود</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" class="check" data-deals ${state.deals ? 'checked' : ''}>
          <span class="text-[11.5px] text-ink/80">فقط دارای تخفیف</span>
        </label>
      </div>`
    )}

    ${specDefs
      .map((def) => {
        const values = [...new Set(base.map((p) => p.filters[def.key]).filter(Boolean))];
        if (!values.length) return '';
        const chosen = state.specs[def.key] || [];
        return filterGroup(
          def.label,
          `<div class="space-y-2">
            ${values
              .map(
                (value) => `<label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" class="check" data-spec-key="${def.key}" data-spec-value="${nxEscape(value)}" ${chosen.includes(value) ? 'checked' : ''}>
                  <span class="flex-1 text-[11.5px] text-ink/80 group-hover:text-primary">${nxEscape(value)}</span>
                </label>`
              )
              .join('')}
          </div>`,
          false
        );
      })
      .join('')}

    <div class="mt-3 rounded-xl bg-primary-50 border border-primary-100 p-3">
      <div class="flex items-center gap-1.5 text-[10px] font-bold text-primary-700"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i> خرید مطمئن از NEXORA</div>
      <p class="text-[10px] text-primary-700/70 leading-5 mt-1">تمام کالاها دارای ضمانت اصالت و ۷ روز مهلت بازگشت هستند.</p>
    </div>`;
  }

  function renderFilters() {
    const html = filtersHTML();
    if (el.filtersDesktop) el.filtersDesktop.innerHTML = html;
    if (el.filtersMobile) el.filtersMobile.innerHTML = html;
    nxIcons();
  }

  /* -------------------------------- toolbar ------------------------------- */
  function renderToolbar(total) {
    const sortOptions = [
      ['relevance', 'پیشنهاد NEXORA'],
      ['popular', 'پرفروش‌ترین'],
      ['newest', 'جدیدترین'],
      ['price-asc', 'ارزان‌ترین'],
      ['price-desc', 'گران‌ترین'],
      ['discount', 'بیشترین تخفیف'],
      ['rating', 'بالاترین امتیاز']
    ];
    el.toolbar.innerHTML = `<div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <button class="btn btn-outline btn-sm lg:hidden" data-open-filters>
          <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> فیلترها
          ${activeFilterCount() ? `<span class="bg-primary text-white text-[9px] rounded-full px-1.5">${nxFa(activeFilterCount())}</span>` : ''}
        </button>
        <span class="text-[11px] text-muted">
          <b class="text-ink font-extrabold">${nxFa(total)}</b> محصول
          ${state.q ? `برای «<span class="text-ink">${nxEscape(state.q)}</span>»` : ''}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <label for="sort-select" class="text-[11px] text-muted hidden sm:block">مرتب‌سازی:</label>
        <select id="sort-select" class="field !w-auto !py-1.5 !text-[11px] !rounded-xl !ps-9">
          ${sortOptions.map(([v, l]) => `<option value="${v}" ${state.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
    </div>`;
  }

  function renderActiveFilters() {
    const chips = [];
    const remove = (key, value, label) => `<button class="chip is-active !text-[10px] !py-1 gap-1" data-remove-filter="${key}:${encodeURIComponent(value)}">
      ${nxEscape(label || value)} <i data-lucide="x" class="w-3 h-3"></i>
    </button>`;

    state.brands.forEach((b) => chips.push(remove('brand', b)));
    state.colors.forEach((c) => chips.push(remove('color', c)));
    Object.entries(state.specs).forEach(([key, values]) =>
      values.forEach((v) => chips.push(remove('spec', `${key}|${v}`, v)))
    );
    if (state.discount) chips.push(remove('discount', `بالای ${nxFa(state.discount)}٪`));
    if (state.rating) chips.push(remove('rating', `امتیاز ${nxFa(state.rating)}+`));
    if (state.stock) chips.push(remove('stock', 'موجود در انبار'));
    if (state.min || state.max) chips.push(remove('price', `${nxNumber(state.min)} تا ${state.max ? nxNumber(state.max) : 'بی‌نهایت'}`));
    if (state.deals) chips.push(remove('deals', 'فقط تخفیف‌دار'));
    if (state.sub && category) {
      const sub = category.subs.find((s) => s.id === state.sub);
      chips.push(`<a href="category.html?cat=${category.id}" class="chip is-active !text-[10px] !py-1 gap-1">${sub ? sub.name : ''} <i data-lucide="x" class="w-3 h-3"></i></a>`);
    }

    el.active.innerHTML = chips.length
      ? `<span class="text-[10px] text-muted self-center">فیلترهای فعال:</span>${chips.join('')}
         <button class="text-[10px] font-bold text-rose-600 self-center hover:underline" data-clear-filters>حذف همه</button>`
      : '';
    nxIcons();
  }

  /* --------------------------------- grid --------------------------------- */
  function renderGrid(list) {
    if (!list.length) {
      el.grid.innerHTML = '';
      el.grid.parentElement.querySelector('#empty-state')?.remove();
      el.grid.insertAdjacentHTML(
        'afterend',
        `<div id="empty-state" class="card p-8 text-center">
          <div class="empty-illu"><i data-lucide="package-search" class="w-8 h-8"></i></div>
          <h3 class="text-sm font-bold text-ink">محصولی با این فیلترها پیدا نشد</h3>
          <p class="text-[11px] text-muted mt-1.5 leading-6">فیلترها را تغییر دهید یا همه آن‌ها را پاک کنید تا نتایج بیشتری ببینید.</p>
          <button class="btn btn-primary btn-sm mt-4" data-clear-filters>پاک کردن فیلترها</button>
        </div>`
      );
      nxIcons();
      return;
    }
    document.getElementById('empty-state')?.remove();
    el.grid.innerHTML = list.map((p) => nxProductCard(p)).join('');
    nxIcons();
  }

  function renderPagination(total) {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) {
      el.pagination.innerHTML = total
        ? `<p class="text-center text-[10px] text-muted">همه ${nxFa(total)} محصول این نتیجه نمایش داده شد.</p>`
        : '';
      return;
    }
    if (state.page > pages) state.page = pages;
    const nums = [];
    const start = Math.max(1, Math.min(state.page - 2, pages - 4));
    const end = Math.min(pages, start + 4);
    for (let i = start; i <= end; i++) nums.push(i);

    el.pagination.innerHTML = `<div class="card p-2.5 flex items-center justify-between gap-2 flex-wrap">
      <button class="btn btn-outline btn-sm ${state.page === 1 ? 'opacity-40 pointer-events-none' : ''}" data-page="${state.page - 1}">
        <i data-lucide="chevron-right" class="w-4 h-4"></i> قبلی
      </button>
      <div class="flex items-center gap-1">
        ${start > 1 ? `<button class="w-8 h-8 rounded-lg text-[11px] text-muted hover:bg-page" data-page="1">۱</button>${start > 2 ? '<span class="text-muted text-xs">…</span>' : ''}` : ''}
        ${nums
          .map(
            (n) => `<button class="w-8 h-8 rounded-lg text-[11px] font-bold transition ${
              n === state.page ? 'bg-primary text-white shadow-glow' : 'text-ink/70 hover:bg-page'
            }" data-page="${n}">${nxFa(n)}</button>`
          )
          .join('')}
        ${end < pages ? `${end < pages - 1 ? '<span class="text-muted text-xs">…</span>' : ''}<button class="w-8 h-8 rounded-lg text-[11px] text-muted hover:bg-page" data-page="${pages}">${nxFa(pages)}</button>` : ''}
      </div>
      <button class="btn btn-outline btn-sm ${state.page === pages ? 'opacity-40 pointer-events-none' : ''}" data-page="${state.page + 1}">
        بعدی <i data-lucide="chevron-left" class="w-4 h-4"></i>
      </button>
    </div>`;
    nxIcons();
  }

  /* --------------------------------- url ---------------------------------- */
  function syncURL() {
    const p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (category) {
      p.set('cat', category.id);
      if (state.sub) p.set('sub', state.sub);
    }
    state.brands.forEach((b) => p.append('brand', b));
    if (state.colors.length) p.set('colors', state.colors.join('|'));
    if (state.min) p.set('min', state.min);
    if (state.max) p.set('max', state.max);
    if (state.stock) p.set('stock', '1');
    if (state.discount) p.set('discount', state.discount);
    if (state.rating) p.set('rating', state.rating);
    if (state.deals) p.set('deals', '1');
    Object.entries(state.specs).forEach(([key, values]) => values.forEach((v) => p.append('f', `${key}:${v}`)));
    if (state.sort !== 'relevance') p.set('sort', state.sort);
    if (state.page > 1) p.set('page', state.page);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  }

  /* -------------------------------- render -------------------------------- */
  function renderAll() {
    const filtered = sortedList(filteredList());
    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (state.page > maxPage) state.page = maxPage;
    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    renderBreadcrumb();
    renderCategoryHero();
    renderFilters();
    renderToolbar(total);
    renderActiveFilters();
    renderGrid(pageItems);
    renderPagination(total);
    syncURL();
  }

  function update(mutator, options = {}) {
    mutator();
    if (!options.keepPage) state.page = 1;
    renderAll();
  }

  /* -------------------------------- events -------------------------------- */
  document.addEventListener('change', (event) => {
    const brand = event.target.closest('[data-brand]');
    if (brand) {
      const value = brand.dataset.brand;
      update(() => {
        state.brands = brand.checked ? [...state.brands, value] : state.brands.filter((b) => b !== value);
      });
      return;
    }
    if (event.target.closest('[data-stock]')) {
      update(() => (state.stock = event.target.checked));
      return;
    }
    if (event.target.closest('[data-deals]')) {
      update(() => (state.deals = event.target.checked));
      return;
    }
    const spec = event.target.closest('[data-spec-key]');
    if (spec) {
      const key = spec.dataset.specKey;
      const value = spec.dataset.specValue;
      update(() => {
        const current = state.specs[key] || [];
        const next = spec.checked ? [...current, value] : current.filter((v) => v !== value);
        if (next.length) state.specs[key] = next;
        else delete state.specs[key];
      });
      return;
    }
    if (event.target.id === 'sort-select') {
      update(() => (state.sort = event.target.value));
      return;
    }
    const priceInput = event.target.closest('[data-price]');
    if (priceInput) {
      update(() => {
        const value = Math.max(0, Number(priceInput.value) || 0);
        if (priceInput.dataset.price === 'min') state.min = value;
        else state.max = value;
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-open-filters]')) {
      el.panel?.classList.add('is-open');
      el.overlay?.classList.remove('hidden');
      document.body.classList.add('filters-open');
      return;
    }
    if (event.target.closest('[data-close-filters]') || event.target === el.overlay) {
      el.panel?.classList.remove('is-open');
      el.overlay?.classList.add('hidden');
      document.body.classList.remove('filters-open');
      return;
    }
    if (event.target.closest('[data-clear-filters]')) {
      update(() => {
        state.brands = [];
        state.colors = [];
        state.specs = {};
        state.min = 0;
        state.max = 0;
        state.stock = false;
        state.discount = 0;
        state.rating = 0;
        state.deals = false;
        state.q = '';
        if (!category) state.sort = 'relevance';
      });
      return;
    }
    const color = event.target.closest('[data-color]');
    if (color) {
      const value = color.dataset.color;
      update(() => {
        state.colors = state.colors.includes(value) ? state.colors.filter((c) => c !== value) : [...state.colors, value];
      });
      return;
    }
    const discount = event.target.closest('[data-discount]');
    if (discount) {
      update(() => (state.discount = Number(discount.dataset.discount)));
      return;
    }
    const rate = event.target.closest('[data-rate]');
    if (rate) {
      update(() => (state.rating = Number(rate.dataset.rate)));
      return;
    }
    const range = event.target.closest('[data-price-range]');
    if (range) {
      const [min, max] = range.dataset.priceRange.split('-');
      update(() => {
        state.min = Number(min) || 0;
        state.max = Number(max) || 0;
      });
      return;
    }
    const pageBtn = event.target.closest('[data-page]');
    if (pageBtn) {
      const next = Number(pageBtn.dataset.page);
      if (!next || next === state.page) return;
      state.page = next;
      renderAll();
      document.getElementById('listing-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const removeFilter = event.target.closest('[data-remove-filter]');
    if (removeFilter) {
      const raw = removeFilter.dataset.removeFilter;
      const sep = raw.indexOf(':');
      const kind = sep > -1 ? raw.slice(0, sep) : raw;
      const encoded = sep > -1 ? raw.slice(sep + 1) : '';
      const value = decodeURIComponent(encoded || '');
      update(() => {
        if (kind === 'brand') state.brands = state.brands.filter((b) => b !== value);
        else if (kind === 'color') state.colors = state.colors.filter((c) => c !== value);
        else if (kind === 'spec') {
          const [specKey, specValue] = value.split('|');
          const next = (state.specs[specKey] || []).filter((v) => v !== specValue);
          if (next.length) state.specs[specKey] = next;
          else delete state.specs[specKey];
        } else if (kind === 'discount') state.discount = 0;
        else if (kind === 'rating') state.rating = 0;
        else if (kind === 'stock') state.stock = false;
        else if (kind === 'price') {
          state.min = 0;
          state.max = 0;
        } else if (kind === 'deals') state.deals = false;
      });
    }
  });

  renderAll();
})();
