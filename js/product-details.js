/* ==========================================================================
   NEXORA — Product details page
   Gallery, purchase panel, tabs (description/specs/reviews/Q&A),
   related & complementary products.
   ========================================================================== */

(function nxProductDetails() {
  const root = document.getElementById('pd-root');
  const crumb = document.getElementById('breadcrumb');
  const id = nxQ('id');
  const product = id ? findProduct(id) : null;

  if (!product) {
    crumb.innerHTML = '<a href="index.html" class="hover:text-primary">خانه</a><i data-lucide="chevron-left" class="w-3 h-3"></i><span class="text-ink">محصول</span>';
    root.innerHTML = `<div class="card p-10 text-center">
      <div class="empty-illu"><i data-lucide="package-x" class="w-8 h-8"></i></div>
      <h1 class="text-base font-extrabold text-ink">این محصول پیدا نشد</h1>
      <p class="text-[11.5px] text-muted mt-2">ممکن است حذف شده باشد یا لینک اشتباه باشد.</p>
      <a href="products.html" class="btn btn-primary btn-sm mt-4">بازگشت به فروشگاه</a>
    </div>`;
    nxIcons();
    return;
  }

  document.title = `${product.name} | NEXORA`;
  crumb.innerHTML = `<a href="index.html" class="hover:text-primary">خانه</a>
    <i data-lucide="chevron-left" class="w-3 h-3"></i>
    <a href="${categoryUrl(product.cat)}" class="hover:text-primary">${product.catName}</a>
    <i data-lucide="chevron-left" class="w-3 h-3"></i>
    <a href="${categoryUrl(product.cat, product.sub)}" class="hover:text-primary">${product.subName}</a>
    <i data-lucide="chevron-left" class="w-3 h-3"></i>
    <span class="text-ink font-medium line-clamp-1">${product.name}</span>`;

  const gallery = [0, 1, 2, 3].map((v) => NXArt.product(product, v));
  const images = [gallery[0], gallery[0], gallery[0], gallery[0]].map((_, i) => NXArt.product(product, i));
  let selectedColor = product.colors[0] ? product.colors[0].name : '';
  let selectedWarranty = product.warranties[0];
  let qty = 1;
  let mainImage = images[0];

  const reviewPool = [
    { name: 'محمد رضایی', rating: 5, days: 4, text: 'کیفیت ساخت واقعاً بالاتر از انتظارم بود. بسته‌بندی سالم رسید و همه چیز مطابق توضیحات سایت بود.' },
    { name: 'سحر موسوی', rating: 4, days: 11, text: 'راضی‌ام؛ عملکردش خوبه و ارزش خرید داره. فقط کاش رنگ‌بندی بیشتری موجود بود.' },
    { name: 'علی کریمی', rating: 5, days: 18, text: 'برای کار روزمره و حرفه‌ای عالیه. پشتیبانی هم قبل از خرید خیلی کمک کرد.' },
    { name: 'فاطمه نیک‌پور', rating: 4, days: 26, text: 'از خریدم راضی هستم، ارسال سریع بود. کیفیت مواد و جزئیات ساخت خوبه.' },
    { name: 'رضا شریفی', rating: 5, days: 33, text: 'بعد از دو هفته استفاده هنوز مثل روز اول کار می‌کنه. پیشنهاد می‌کنم.' }
  ];
  const hash = [...product.id].reduce((s, c) => s + c.charCodeAt(0), 0);
  const demoReviews = [0, 1, 2].map((i) => reviewPool[(hash + i) % reviewPool.length]);
  const myReviews = nxReviews.forProduct(product.id);
  const allReviews = [
    ...myReviews.map((r) => ({ name: r.name, rating: r.rating, days: 0, text: r.text, mine: true })),
    ...demoReviews
  ];

  const qaPool = [
    { q: 'این محصول اصل است و گارانتی معتبر دارد؟', a: 'بله، تمام کالاهای NEXORA با ضمانت اصالت و گارانتی معتبر ارائه می‌شوند و فاکتور رسمی برای شما صادر می‌شود.' },
    { q: 'امکان پرداخت در محل وجود دارد؟', a: 'بله، برای اکثر شهرها پرداخت در محل فعال است. در مرحله نهایی سفارش می‌توانید این روش را انتخاب کنید.' },
    { q: 'اگر محصول را نپسندیدم می‌توانم مرجوع کنم؟', a: 'تا ۷ روز پس از تحویل، در صورت سالم بودن بسته‌بندی و لوازم همراه، امکان بازگشت کالا وجود دارد.' }
  ];

  const ratingBars = [5, 4, 3, 2, 1]
    .map((star) => {
      const percent = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 6 : star === 2 ? 3 : 1;
      return `<div class="flex items-center gap-2 text-[10px]">
        <span class="w-8 text-muted">${nxFa(star)} ★</span>
        <span class="flex-1 h-1.5 rounded-full bg-line overflow-hidden"><span class="block h-full bg-premium" style="width:${percent}%"></span></span>
        <span class="w-8 text-muted">${nxFa(percent)}٪</span>
      </div>`;
    })
    .join('');

  const similar = getProducts()
    .filter((p) => p.id !== product.id && (p.sub === product.sub || p.cat === product.cat))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const complementary = getProducts()
    .filter((p) => p.id !== product.id && (p.cat === 'accessories' || p.cat === 'parts'))
    .slice(0, 4);

  root.innerHTML = `
  <div class="grid lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] gap-3 md:gap-5 items-start">
    <!-- gallery -->
    <div class="card p-3 md:p-4 lg:sticky lg:top-28">
      <div class="relative rounded-2xl overflow-hidden bg-gradient-to-br from-page to-white border border-line zoom-frame">
        <img id="pd-main-image" src="${mainImage}" alt="${nxEscape(product.name)}" class="w-full aspect-square object-contain transition-transform duration-500">
        <div class="absolute top-3 right-3 flex flex-col gap-1.5">
          ${product.discount ? `<span class="badge-sale">${nxFa(product.discount)}٪ تخفیف</span>` : ''}
          ${product.tags.includes('new') ? '<span class="badge-new">جدید</span>' : ''}
        </div>
        <button class="absolute bottom-3 left-3 icon-btn !w-9 !h-9" data-wishlist="${product.id}" aria-label="علاقه‌مندی"><i data-lucide="heart" class="w-4 h-4"></i></button>
      </div>
      <div class="grid grid-cols-4 gap-2 mt-2.5">
        ${images
          .map(
            (img, i) => `<button class="gallery-thumb aspect-square ${i === 0 ? 'is-active' : ''}" data-gallery="${i}" aria-label="تصویر ${nxFa(i + 1)}">
              <img src="${img}" alt="" class="w-full h-full object-contain">
            </button>`
          )
          .join('')}
      </div>
      <div class="flex items-center justify-center gap-3 mt-3 text-[10px] text-muted">
        <span class="inline-flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-500"></i>اصالت کالا</span>
        <span class="divider-dot"></span>
        <span class="inline-flex items-center gap-1"><i data-lucide="truck" class="w-3.5 h-3.5 text-primary"></i>ارسال سریع</span>
        <span class="divider-dot"></span>
        <span class="inline-flex items-center gap-1"><i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-amber-500"></i>۷ روز بازگشت</span>
      </div>
    </div>

    <!-- purchase panel -->
    <div class="space-y-3 md:space-y-4">
      <div class="card p-4 md:p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <a href="products.html?brand=${encodeURIComponent(product.brand)}" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
            <i data-lucide="badge-check" class="w-3.5 h-3.5"></i> ${product.brand}
          </a>
          <div class="flex items-center gap-2 text-[10px] text-muted">
            <span>شناسه محصول: ${product.sku}</span>
            <span class="divider-dot"></span>
            <span>${product.catName}</span>
          </div>
        </div>
        <h1 class="text-[17px] md:text-xl font-black leading-8 text-ink mt-2">${product.name}</h1>
        <div class="flex flex-wrap items-center gap-3 mt-2.5">
          <div class="flex items-center gap-1.5">${nxStars(product.rating, product.reviews)}</div>
          <a href="#reviews" class="text-[10px] text-primary font-semibold">مشاهده ${nxFa(product.reviews)} نظر</a>
          <span class="divider-dot"></span>
          <span class="text-[10px] ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'} font-semibold">
            ${product.stock > 0 ? (product.stock <= 5 ? `تنها ${nxFa(product.stock)} عدد در انبار` : 'موجود در انبار') : 'ناموجود'}
          </span>
        </div>

        <div class="flex items-center gap-2 mt-4 flex-wrap">
          ${(product.features || []).slice(0, 3).map((f) => `<span class="chip !text-[10px] !cursor-default !bg-page"><i data-lucide="check" class="w-3 h-3 text-emerald-500"></i>${f}</span>`).join('')}
        </div>
      </div>

      <div class="card p-4 md:p-5">
        <!-- color -->
        <div class="mb-4">
          <div class="text-[11px] font-bold text-ink mb-2">انتخاب رنگ: <span class="text-muted font-medium" data-color-label>${selectedColor}</span></div>
          <div class="flex flex-wrap gap-2">
            ${product.colors
              .map(
                (c, i) => `<button class="flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] transition ${i === 0 ? 'border-primary bg-primary-50 text-primary-700 font-semibold' : 'border-line hover:border-primary-200'}" data-color-pick="${nxEscape(c.name)}">
                  <span class="w-4 h-4 rounded-full border border-black/10" style="background:${c.hex}"></span>${c.name}
                </button>`
              )
              .join('')}
          </div>
        </div>

        <!-- warranty -->
        <div class="mb-4">
          <div class="text-[11px] font-bold text-ink mb-2">انتخاب گارانتی</div>
          <div class="space-y-2">
            ${product.warranties
              .map(
                (w, i) => `<label class="flex items-center gap-2.5 rounded-xl border border-line p-2.5 cursor-pointer hover:border-primary-200 transition ${i === 0 ? 'border-primary bg-primary-50/50' : ''}" data-warranty-row="${nxEscape(w)}">
                  <input type="radio" name="warranty" value="${nxEscape(w)}" ${i === 0 ? 'checked' : ''} class="accent-primary">
                  <span class="text-[11.5px] text-ink/80 flex-1">${w}</span>
                  <span class="text-[10px] text-muted">${i === 0 ? 'شامل قیمت' : 'با هزینه اضافه'}</span>
                </label>`
              )
              .join('')}
          </div>
        </div>

        <!-- price -->
        <div class="rounded-2xl bg-page border border-line p-3.5">
          <div class="flex items-end justify-between gap-3 flex-wrap">
            <div>
              ${product.oldPrice ? `<div class="text-[11px] text-muted line-through">${nxNumber(product.oldPrice)} تومان</div>` : ''}
              <div class="text-xl md:text-2xl font-black text-ink mt-0.5">${nxNumber(product.price)} <span class="text-[11px] font-medium text-muted">تومان</span></div>
              ${product.oldPrice ? `<div class="text-[10px] text-emerald-600 font-semibold mt-1">${nxNumber(product.oldPrice - product.price)} تومان سود شما از این خرید</div>` : ''}
            </div>
            <div class="text-left">
              <div class="text-[10px] text-muted">تحویل تخمینی</div>
              <div class="text-[11px] font-bold text-ink mt-1">${product.stock > 0 ? 'ارسال از ۱ روز کاری' : 'ناموجود'}</div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 mt-3.5">
            <div class="flex items-center border border-line rounded-xl bg-white overflow-hidden">
              <button class="w-9 h-9 grid place-items-center text-muted hover:bg-page" data-qty="-1" aria-label="کاهش تعداد"><i data-lucide="minus" class="w-4 h-4"></i></button>
              <span class="w-10 text-center text-sm font-extrabold" data-qty-value>۱</span>
              <button class="w-9 h-9 grid place-items-center text-muted hover:bg-page" data-qty="1" aria-label="افزایش تعداد"><i data-lucide="plus" class="w-4 h-4"></i></button>
            </div>
            <button class="btn btn-primary btn-lg flex-1 min-w-[180px] ${product.stock <= 0 ? 'pointer-events-none opacity-50' : ''}" data-pd-add>
              <i data-lucide="shopping-cart" class="w-[18px] h-[18px]"></i> افزودن به سبد خرید
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2 mt-2.5">
            <button class="btn btn-outline btn-sm" data-wishlist="${product.id}"><i data-lucide="heart" class="w-4 h-4"></i> علاقه‌مندی</button>
            <button class="btn btn-outline btn-sm" data-compare="${product.id}"><i data-lucide="git-compare" class="w-4 h-4"></i> مقایسه</button>
            <a href="compare.html" class="btn btn-outline btn-sm"><i data-lucide="scaling" class="w-4 h-4"></i> لیست مقایسه</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- tabs -->
  <section class="card mt-4 md:mt-5 overflow-hidden" id="reviews">
    <div class="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-line p-2">
      ${[
        ['desc', 'معرفی محصول'],
        ['specs', 'مشخصات فنی'],
        ['features', 'ویژگی‌ها'],
        ['reviews', `نظرات کاربران (${nxFa(product.reviews + myReviews.length)})`],
        ['qa', 'پرسش و پاسخ']
      ]
        .map(
          ([key, label], i) =>
            `<button class="tab-btn whitespace-nowrap ${i === 0 ? 'is-active' : ''}" data-tab="${key}">${label}</button>`
        )
        .join('')}
    </div>

    <div class="p-4 md:p-6">
      <div data-panel="desc">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h2 class="text-sm font-extrabold text-ink mb-2">درباره ${product.name}</h2>
            <p class="text-[12px] leading-7 text-ink/70">${product.desc}</p>
            <p class="text-[12px] leading-7 text-ink/70 mt-3">این محصول در فروشگاه NEXORA با ضمانت اصالت کالا عرضه می‌شود. مشخصات و قیمت نمایش‌داده‌شده جنبه نمونه دارند و برای اطلاع دقیق از موجودی روز، با پشتیبانی در تماس باشید.</p>
          </div>
          <div class="rounded-2xl bg-page border border-line p-4">
            <h3 class="text-[12px] font-bold text-ink mb-3">خلاصه مشخصات</h3>
            <dl class="space-y-2.5">
              ${Object.entries(product.specs)
                .slice(0, 6)
                .map(
                  ([k, v]) => `<div class="flex items-start justify-between gap-3 text-[11px]">
                    <dt class="text-muted">${nxEscape(k)}</dt>
                    <dd class="font-semibold text-ink text-left">${nxEscape(v)}</dd>
                  </div>`
                )
                .join('')}
            </dl>
          </div>
        </div>
      </div>

      <div data-panel="specs" class="hidden">
        <h2 class="text-sm font-extrabold text-ink mb-3">مشخصات فنی کامل</h2>
        <div class="rounded-2xl border border-line overflow-hidden">
          <table class="nx-table">
            <tbody>
              ${Object.entries(product.specs)
                .map(
                  ([k, v], i) => `<tr class="${i % 2 ? 'bg-page/40' : ''}">
                    <td class="text-muted w-1/3">${nxEscape(k)}</td>
                    <td class="font-semibold text-ink">${nxEscape(v)}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div data-panel="features" class="hidden">
        <h2 class="text-sm font-extrabold text-ink mb-3">ویژگی‌های کلیدی</h2>
        <div class="grid sm:grid-cols-2 gap-2.5">
          ${product.features
            .map(
              (f) => `<div class="flex items-start gap-2.5 rounded-xl border border-line p-3">
                <span class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center shrink-0"><i data-lucide="check" class="w-3.5 h-3.5"></i></span>
                <span class="text-[11.5px] leading-6 text-ink/80">${f}</span>
              </div>`
            )
            .join('')}
        </div>
      </div>

      <div data-panel="reviews" class="hidden">
        <div class="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-4">
          <div class="rounded-2xl bg-page border border-line p-4 h-fit">
            <div class="text-center">
              <div class="text-3xl font-black text-ink">${nxFa(product.rating)}</div>
              <div class="flex justify-center mt-1">${nxStars(product.rating)}</div>
              <div class="text-[10px] text-muted mt-1.5">از ${nxFa(product.reviews)} نظر ثبت‌شده</div>
            </div>
            <div class="space-y-1.5 mt-4">${ratingBars}</div>
          </div>
          <div>
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-sm font-extrabold text-ink">نظرات کاربران</h2>
              <button class="btn btn-soft btn-sm" data-open-review><i data-lucide="pen-line" class="w-4 h-4"></i> ثبت نظر</button>
            </div>
            <form class="hidden rounded-2xl border border-line bg-page p-3 mb-3" data-review-form>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[11px] font-semibold text-ink">امتیاز شما:</span>
                <select class="field !py-1.5 !w-auto !text-[11px]" name="rating">
                  ${[5, 4, 3, 2, 1].map((n) => `<option value="${n}">${nxFa(n)} ستاره</option>`).join('')}
                </select>
              </div>
              <textarea class="field !text-[11.5px] !min-h-[70px]" name="text" placeholder="تجربه خود از این محصول را بنویسید…" required></textarea>
              <div class="flex items-center gap-2 mt-2">
                <button class="btn btn-primary btn-sm" type="submit">ارسال نظر</button>
                <button class="btn btn-ghost btn-sm" type="button" data-cancel-review>انصراف</button>
                ${nxAuth.current() ? `<span class="text-[10px] text-muted">با نام ${nxEscape(nxAuth.current().firstName)} ثبت می‌شود</span>` : '<span class="text-[10px] text-muted">برای ثبت نظر باید وارد شوید</span>'}
              </div>
            </form>
            <div class="space-y-2.5" data-review-list>
              ${allReviews
                .map(
                  (r) => `<div class="rounded-xl border border-line p-3">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-primary-50 text-primary-700 grid place-items-center text-[10px] font-bold">${r.name.charAt(0)}</span>
                        <div>
                          <div class="text-[11px] font-bold text-ink">${nxEscape(r.name)} ${r.mine ? '<span class="text-[9px] text-emerald-600 font-normal">(نظر شما)</span>' : ''}</div>
                          <div class="text-[9.5px] text-muted mt-0.5">${r.mine ? 'همین حالا' : `${nxFa(r.days)} روز پیش`} · خرید تأییدشده</div>
                        </div>
                      </div>
                      ${nxStars(r.rating)}
                    </div>
                    <p class="text-[11.5px] leading-6 text-ink/70 mt-2">${nxEscape(r.text)}</p>
                  </div>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>

      <div data-panel="qa" class="hidden">
        <h2 class="text-sm font-extrabold text-ink mb-3">پرسش و پاسخ درباره این محصول</h2>
        <div class="space-y-2.5">
          ${qaPool
            .map(
              (item) => `<div class="rounded-xl border border-line p-3">
                <div class="flex items-start gap-2">
                  <span class="w-6 h-6 rounded-lg bg-primary-50 text-primary grid place-items-center shrink-0 text-[10px] font-bold">پ</span>
                  <p class="text-[11.5px] font-semibold text-ink leading-6">${item.q}</p>
                </div>
                <div class="flex items-start gap-2 mt-2">
                  <span class="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center shrink-0 text-[10px] font-bold">ج</span>
                  <p class="text-[11.5px] text-ink/65 leading-6">${item.a}</p>
                </div>
              </div>`
            )
            .join('')}
        </div>
        <form class="mt-3 flex flex-col sm:flex-row gap-2" data-qa-form>
          <input class="field !text-[11.5px]" name="question" placeholder="پرسش خود درباره این محصول را بنویسید…" required>
          <button class="btn btn-primary btn-sm shrink-0" type="submit">ثبت پرسش</button>
        </form>
      </div>
    </div>
  </section>

  <!-- similar -->
  <section class="mt-6 md:mt-8">
    <div class="section-head">
      <h2 class="section-title"><span class="w-1.5 h-5 rounded-full bg-primary inline-block"></span> محصولات مشابه</h2>
      <a href="${categoryUrl(product.cat)}" class="section-link">مشاهده همه <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i></a>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3" id="similar-grid"></div>
  </section>

  <section class="mt-6 md:mt-8">
    <div class="section-head">
      <h2 class="section-title"><span class="w-1.5 h-5 rounded-full bg-pink-500 inline-block"></span> محصولات مکمل</h2>
      <a href="category.html?cat=accessories" class="section-link">لوازم جانبی <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i></a>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3" id="complement-grid"></div>
  </section>`;

  document.getElementById('similar-grid').innerHTML = similar.map((p) => nxProductCard(p)).join('');
  document.getElementById('complement-grid').innerHTML = complementary.map((p) => nxProductCard(p)).join('');
  nxIcons();
  nxRefreshBadges();

  /* ------------------------------ interactions ---------------------------- */
  function syncPurchaseButtons() {
    document.querySelectorAll('[data-pd-add]').forEach((btn) => {
      btn.dataset.color = selectedColor;
      btn.dataset.warranty = selectedWarranty;
      btn.dataset.qty = String(qty);
    });
  }
  syncPurchaseButtons();

  root.addEventListener('click', (event) => {
    const thumb = event.target.closest('[data-gallery]');
    if (thumb) {
      mainImage = images[Number(thumb.dataset.gallery)];
      document.getElementById('pd-main-image').src = mainImage;
      root.querySelectorAll('[data-gallery]').forEach((t) => t.classList.toggle('is-active', t === thumb));
      return;
    }

    const color = event.target.closest('[data-color-pick]');
    if (color) {
      selectedColor = color.dataset.colorPick;
      root.querySelectorAll('[data-color-pick]').forEach((c) => {
        const active = c === color;
        c.classList.toggle('border-primary', active);
        c.classList.toggle('bg-primary-50', active);
        c.classList.toggle('text-primary-700', active);
        c.classList.toggle('font-semibold', active);
        c.classList.toggle('border-line', !active);
      });
      const label = root.querySelector('[data-color-label]');
      if (label) label.textContent = selectedColor;
      syncPurchaseButtons();
      return;
    }

    const qtyBtn = event.target.closest('[data-qty]');
    if (qtyBtn) {
      const max = Math.max(1, product.stock);
      qty = Math.min(max, Math.max(1, qty + Number(qtyBtn.dataset.qty)));
      const value = root.querySelector('[data-qty-value]');
      if (value) value.textContent = nxFa(qty);
      syncPurchaseButtons();
      return;
    }

    if (event.target.closest('[data-pd-add]')) {
      const result = nxCart.add(product.id, { color: selectedColor, warranty: selectedWarranty, qty });
      if (!result.ok) nxToast(result.message, 'error');
      else nxToast('محصول به سبد خرید اضافه شد.', 'success', { action: { label: 'مشاهده سبد خرید', href: 'cart.html' } });
      return;
    }

    const tab = event.target.closest('[data-tab]');
    if (tab) {
      root.querySelectorAll('[data-tab]').forEach((t) => t.classList.toggle('is-active', t === tab));
      root.querySelectorAll('[data-panel]').forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== tab.dataset.tab));
      return;
    }

    if (event.target.closest('[data-open-review]')) {
      root.querySelector('[data-review-form]')?.classList.toggle('hidden');
      return;
    }
    if (event.target.closest('[data-cancel-review]')) {
      root.querySelector('[data-review-form]')?.classList.add('hidden');
    }
  });

  root.addEventListener('change', (event) => {
    const radio = event.target.closest('input[name="warranty"]');
    if (!radio) return;
    selectedWarranty = radio.value;
    root.querySelectorAll('[data-warranty-row]').forEach((row) => {
      const active = row.dataset.warrantyRow === selectedWarranty;
      row.classList.toggle('border-primary', active);
      row.classList.toggle('bg-primary-50/50', active);
      row.classList.toggle('border-line', !active);
    });
    syncPurchaseButtons();
  });

  root.addEventListener('submit', (event) => {
    if (event.target.matches('[data-review-form]')) {
      event.preventDefault();
      const user = nxAuth.current();
      if (!user) {
        nxToast('برای ثبت نظر ابتدا وارد حساب کاربری شوید.', 'error', { action: { label: 'ورود به حساب', href: 'login.html' } });
        return;
      }
      const form = event.target;
      const text = form.querySelector('textarea').value.trim();
      if (text.length < 5) {
        nxToast('متن نظر باید حداقل ۵ کاراکتر باشد.', 'error');
        return;
      }
      nxReviews.add({ productId: product.id, rating: Number(form.querySelector('select').value), text });
      nxToast('نظر شما با موفقیت ثبت شد.', 'success');
      const list = root.querySelector('[data-review-list]');
      if (list) {
        list.insertAdjacentHTML(
          'afterbegin',
          `<div class="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3">
            <div class="flex items-center justify-between gap-2">
              <div class="text-[11px] font-bold text-ink">${nxEscape(user.firstName + ' ' + user.lastName)} <span class="text-[9px] text-emerald-600 font-normal">(نظر شما)</span></div>
              ${nxStars(Number(form.querySelector('select').value))}
            </div>
            <p class="text-[11.5px] leading-6 text-ink/70 mt-2">${nxEscape(text)}</p>
          </div>`
        );
      }
      form.reset();
      form.classList.add('hidden');
      nxIcons();
      return;
    }
    if (event.target.matches('[data-qa-form]')) {
      event.preventDefault();
      const input = event.target.querySelector('input');
      if (!input.value.trim()) return;
      nxToast('پرسش شما ثبت شد و پس از بررسی کارشناسان نمایش داده می‌شود.', 'success');
      input.value = '';
    }
  });
})();
