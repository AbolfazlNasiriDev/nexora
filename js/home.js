/* ==========================================================================
   NEXORA — Home page rendering
   ========================================================================== */

const NX_HERO_SLIDES = [
  {
    badge: 'تازه رسیده',
    title: 'جدیدترین گوشی‌های هوشمند',
    desc: 'نسل جدید پرچم‌داران اپل، سامسونگ و شیائومی با پردازنده‌های قدرتمند، دوربین‌های حرفه‌ای و شارژ فوق سریع.',
    productId: 'iphone-17-pro',
    primary: { label: 'مشاهده گوشی‌ها', href: 'category.html?cat=mobile' },
    secondary: { label: 'مقایسه پرچم‌داران', href: 'compare.html' },
    chips: ['تراشه A19 Pro', 'دوربین ۴۸ مگاپیکسل'],
    meta: ['ارسال سریع', 'گارانتی ۱۸ ماهه', 'پرداخت در محل']
  },
  {
    badge: 'تخفیف ویژه',
    title: 'لپ‌تاپ‌های گیمینگ با تخفیف',
    desc: 'سیستم‌های RTX با نمایشگر پرسرعت و خنک‌کننده حرفه‌ای؛ آماده برای بازی، رندر و کار سنگین.',
    productId: 'rog-strix-g16',
    primary: { label: 'مشاهده لپ‌تاپ‌ها', href: 'category.html?cat=laptop&sub=gaming-laptop' },
    secondary: { label: 'همه پیشنهادها', href: 'products.html?deals=1' },
    chips: ['RTX 4070', 'نمایشگر ۱۶۵ هرتز'],
    meta: ['تا ۱۴٪ تخفیف', 'ارسال رایگان', 'اقساط اختیاری']
  },
  {
    badge: 'دنیای جدید',
    title: 'دنیای جدید تجهیزات دیجیتال',
    desc: 'از ساعت هوشمند و هدفون حرفه‌ای تا گجت‌های خانه هوشمند؛ هر چیزی که زندگی را یک قدم جلوتر می‌برد.',
    productId: 'sony-wh-1000xm6',
    primary: { label: 'مشاهده محصولات', href: 'products.html' },
    secondary: { label: 'گجت‌های هوشمند', href: 'category.html?cat=wearables' },
    chips: ['حذف نویز فعال', 'باتری ۳۰ ساعت'],
    meta: ['۷ روز بازگشت', 'ضمانت اصالت', 'پشتیبانی آنلاین']
  }
];

const NX_POPULAR_CATS = [
  { name: 'موبایل', icon: 'smartphone', href: 'category.html?cat=mobile', color: '#5B45E8', tint: '#EFEBFF' },
  { name: 'لپ‌تاپ', icon: 'laptop', href: 'category.html?cat=laptop', color: '#0EA5E9', tint: '#E6F6FE' },
  { name: 'هدفون', icon: 'headphones', href: 'category.html?cat=accessories&sub=headphones', color: '#EC4899', tint: '#FDEBF4' },
  { name: 'ساعت هوشمند', icon: 'watch', href: 'category.html?cat=wearables&sub=smartwatch', color: '#14B8A6', tint: '#E6FAF7' },
  { name: 'گیمینگ', icon: 'gamepad-2', href: 'category.html?cat=gaming', color: '#EF4444', tint: '#FDECEC' },
  { name: 'مانیتور', icon: 'monitor', href: 'category.html?cat=laptop&sub=monitor', color: '#8B5CF6', tint: '#F3EDFF' },
  { name: 'قطعات کامپیوتر', icon: 'cpu', href: 'category.html?cat=parts', color: '#F97316', tint: '#FFF2E7' },
  { name: 'لوازم جانبی', icon: 'cable', href: 'category.html?cat=accessories', color: '#64748B', tint: '#EEF2F7' }
];

const NX_TESTIMONIALS = [
  {
    name: 'نگار احمدی',
    role: 'خریدار MacBook Air',
    rating: 5,
    text: 'سفارشم صبح روز بعد رسید و بسته‌بندی واقعاً حرفه‌ای بود. محصول کاملاً اصل و مطابق توضیحات سایت بود؛ تجربه‌ای بهتر از انتظارم.'
  },
  {
    name: 'امیرحسین رضایی',
    role: 'خریدار لپ‌تاپ گیمینگ',
    rating: 5,
    text: 'برای انتخاب لپ‌تاپ گیمینگ از بخش مقایسه استفاده کردم؛ مشخصات دقیق و شفاف بود. پشتیبانی هم قبل از خرید حسابی راهنمایی کرد.'
  },
  {
    name: 'مریم کاظمی',
    role: 'خریدار لوازم خانه هوشمند',
    rating: 4,
    text: 'قیمت‌ها منصفانه و فرایند خرید ساده بود. تنها نکته اینکه ارسال به شهر ما یک روز بیشتر طول کشید، ولی پیگیری سفارش خیلی شفاف بود.'
  }
];

const NX_BENEFITS = [
  { icon: 'shield-check', title: 'ضمانت اصالت کالا', text: 'تمام محصولات با گارانتی معتبر و تأییدیه اصالت عرضه می‌شوند.' },
  { icon: 'truck', title: 'ارسال سریع و مطمئن', text: 'ارسال تهران زیر ۲۴ ساعت و بسته‌بندی ایمن برای تمام شهرها.' },
  { icon: 'rotate-ccw', title: '۷ روز ضمانت بازگشت', text: 'اگر محصول مطابق انتظار نبود، تا هفت روز بدون دردسر مرجوع کنید.' },
  { icon: 'credit-card', title: 'پرداخت شفاف', text: 'درگاه پرداخت امن، پرداخت در محل و امکان مشاهده فاکتور رسمی.' },
  { icon: 'headphones', title: 'پشتیبانی واقعی', text: 'کارشناسان NEXORA هر روز از ۹ تا ۲۱ پاسخگوی سوالات فنی شما هستند.' },
  { icon: 'badge-percent', title: 'قیمت منصفانه', text: 'تخفیف‌های دوره‌ای و قیمت‌گذاری شفاف بدون هزینه پنهان.' }
];

/* -------------------------------- helpers -------------------------------- */
function nxProductGrid(products, container) {
  if (!container) return;
  container.innerHTML = products.map((p) => nxProductCard(p)).join('');
  nxIcons();
}

function nxPickByTag(tag, count, fallbackFn) {
  const all = getProducts();
  let list = all.filter((p) => (p.tags || []).includes(tag));
  if (list.length < count) {
    const extra = (fallbackFn ? fallbackFn(all) : all).filter((p) => !list.some((x) => x.id === p.id));
    list = [...list, ...extra];
  }
  return list.slice(0, count);
}

/* --------------------------------- hero ---------------------------------- */
function nxRenderHero() {
  const wrap = document.getElementById('hero-slides');
  const dots = document.getElementById('hero-dots');
  if (!wrap) return;

  wrap.innerHTML = NX_HERO_SLIDES.map((slide, index) => {
    const product = findProduct(slide.productId);
    return `<div class="hero-slide ${index === 0 ? 'is-active' : ''}" data-slide="${index}">
      <div class="grid md:grid-cols-2 gap-4 md:gap-8 items-center p-5 md:p-10 min-h-[360px] md:min-h-[420px]">
        <div class="text-white order-2 md:order-1">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-semibold text-white/85">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${slide.badge}
          </span>
          <h1 class="text-[26px] leading-tight md:text-4xl lg:text-[42px] font-black mt-3">${slide.title}</h1>
          <p class="text-white/60 text-[12px] md:text-[13px] mt-3 leading-7 max-w-md">${slide.desc}</p>
          <div class="flex flex-wrap items-center gap-2 mt-6">
            <a href="${slide.primary.href}" class="btn btn-primary btn-lg">${slide.primary.label} <i data-lucide="arrow-left" class="w-4 h-4"></i></a>
            <a href="${slide.secondary.href}" class="btn btn-lg !bg-white/5 border border-white/20 !text-white hover:!bg-white/10">${slide.secondary.label}</a>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-6 text-[10px] text-white/45">
            ${slide.meta.map((m) => `<span class="inline-flex items-center gap-1"><i data-lucide="check" class="w-3 h-3 text-emerald-400"></i>${m}</span>`).join('')}
          </div>
        </div>
        <div class="relative order-1 md:order-2 flex justify-center">
          <div class="absolute top-6 w-56 h-56 md:w-72 md:h-72 rounded-full bg-primary-500/35 blur-3xl"></div>
          <div class="relative w-56 h-56 md:w-80 md:h-80 rounded-[2rem] overflow-hidden border border-white/15 bg-white shadow-2xl animate-float">
            <img src="${product ? NXArt.product(product, 0) : ''}" alt="${product ? nxEscape(product.name) : ''}" class="w-full h-full object-contain">
          </div>
          <span class="absolute top-2 right-0 md:right-2 rounded-xl bg-white/95 text-ink text-[10px] font-bold px-2.5 py-1.5 shadow-soft">${slide.chips[0]}</span>
          <span class="absolute bottom-4 left-0 md:left-2 rounded-xl bg-white/95 text-ink text-[10px] font-bold px-2.5 py-1.5 shadow-soft">${slide.chips[1]}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  if (dots) {
    dots.innerHTML = NX_HERO_SLIDES.map(
      (_, i) => `<button class="hero-dot ${i === 0 ? 'is-active' : ''}" data-hero-dot="${i}" aria-label="اسلاید ${nxFa(i + 1)}"></button>`
    ).join('');
  }

  const slides = [...wrap.querySelectorAll('.hero-slide')];
  let current = 0;
  let timer = null;

  const go = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots?.querySelectorAll('[data-hero-dot]').forEach((d, i) => d.classList.toggle('is-active', i === current));
  };

  const play = () => {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 6500);
  };

  document.getElementById('hero-next')?.addEventListener('click', () => {
    go(current + 1);
    play();
  });
  document.getElementById('hero-prev')?.addEventListener('click', () => {
    go(current - 1);
    play();
  });
  dots?.addEventListener('click', (event) => {
    const dot = event.target.closest('[data-hero-dot]');
    if (!dot) return;
    go(Number(dot.dataset.heroDot));
    play();
  });
  const hero = document.getElementById('hero-wrap');
  hero?.addEventListener('mouseenter', () => clearInterval(timer));
  hero?.addEventListener('mouseleave', play);

  let startX = 0;
  hero?.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  }, { passive: true });
  hero?.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) {
      go(delta > 0 ? current - 1 : current + 1);
      play();
    }
  });

  play();
  nxIcons();
}

/* --------------------------------- deals --------------------------------- */
function nxRenderDeals() {
  const grid = document.getElementById('deals-grid');
  if (!grid) return;
  const deals = getProducts()
    .filter((p) => p.discount >= 8 && p.stock > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);
  nxProductGrid(deals, grid);

  const deadline = new Date();
  deadline.setHours(23, 59, 59, 999);
  const tick = () => {
    const diff = Math.max(0, deadline - new Date());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => nxFa(String(n).padStart(2, '0'));
    document.querySelectorAll('[data-cd="h"]').forEach((el) => (el.textContent = pad(h)));
    document.querySelectorAll('[data-cd="m"]').forEach((el) => (el.textContent = pad(m)));
    document.querySelectorAll('[data-cd="s"]').forEach((el) => (el.textContent = pad(s)));
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------- sections -------------------------------- */
function nxRenderHome() {
  nxRenderHero();

  const cats = document.getElementById('popular-cats');
  if (cats) {
    cats.innerHTML = NX_POPULAR_CATS.map((cat) => {
      const count = getProducts().filter((p) => cat.href.includes(p.cat)).length;
      return `<a href="${cat.href}" class="card card-hover p-3 md:p-4 text-center group">
        <span class="w-11 h-11 md:w-12 md:h-12 mx-auto rounded-2xl grid place-items-center transition-transform group-hover:scale-110" style="background:${cat.tint};color:${cat.color}">
          <i data-lucide="${cat.icon}" class="w-5 h-5 md:w-6 md:h-6"></i>
        </span>
        <span class="block text-[11.5px] font-bold text-ink mt-2.5">${cat.name}</span>
        <span class="block text-[10px] text-muted mt-1">${nxFa(count)} محصول</span>
      </a>`;
    }).join('');
  }

  nxRenderDeals();

  nxProductGrid(
    nxPickByTag('bestseller', 8, (all) => all.slice().sort((a, b) => b.reviews - a.reviews)),
    document.getElementById('bestsellers-grid')
  );
  nxProductGrid(
    nxPickByTag('new', 8, (all) => all.slice().reverse()),
    document.getElementById('newest-grid')
  );
  nxProductGrid(
    getProducts().filter((p) => p.cat === 'gaming').slice(0, 4),
    document.getElementById('gaming-grid')
  );
  nxProductGrid(
    nxPickByTag('recommended', 8, (all) => all.slice().sort((a, b) => b.rating - a.rating)),
    document.getElementById('recommended-grid')
  );

  /* promo banner artwork */
  document.querySelectorAll('[data-banner-art]').forEach((img) => {
    const product = findProduct(img.dataset.bannerArt);
    if (product) {
      img.src = NXArt.product(product, 1);
      img.alt = product.name;
    }
  });

  /* brands */
  const strip = document.getElementById('brands-strip');
  if (strip) {
    const brands = ['Apple', 'Samsung', 'Xiaomi', 'Asus', 'Lenovo', 'HP', 'Sony', 'Logitech', 'JBL', 'Anker'];
    const item = (b) => `<a href="products.html?brand=${encodeURIComponent(b)}" class="brand-card shrink-0 flex items-center justify-center px-5">
      <span class="brand-logo text-lg md:text-xl font-black tracking-tight" style="color:${(BRANDS.find((x) => x.name === b) || {}).color || '#15172B'}">${b}</span>
    </a>`;
    strip.innerHTML = brands.map(item).join('') + brands.map(item).join('');
  }

  /* testimonials */
  const reviewsWrap = document.getElementById('testimonials');
  if (reviewsWrap) {
    reviewsWrap.innerHTML = NX_TESTIMONIALS.map(
      (t) => `<div class="card p-4 md:p-5 relative">
        <i data-lucide="quote" class="absolute top-4 left-4 w-7 h-7 text-primary-100"></i>
        <div class="flex items-center gap-3">
          <span class="w-10 h-10 rounded-full bg-primary-50 text-primary-700 grid place-items-center text-xs font-extrabold">${t.name.charAt(0)}</span>
          <div>
            <div class="text-[12px] font-bold text-ink">${t.name}</div>
            <div class="text-[10px] text-muted mt-0.5">${t.role}</div>
          </div>
        </div>
        <div class="mt-3">${nxStars(t.rating)}</div>
        <p class="text-[11.5px] leading-7 text-ink/70 mt-2">${t.text}</p>
        <div class="flex items-center gap-1 text-[10px] text-emerald-600 mt-3 font-semibold">
          <i data-lucide="badge-check" class="w-3.5 h-3.5"></i> خرید تأییدشده در NEXORA
        </div>
      </div>`
    ).join('');
  }

  /* benefits */
  const benefitsWrap = document.getElementById('benefits-grid');
  if (benefitsWrap) {
    benefitsWrap.innerHTML = NX_BENEFITS.map(
      (b) => `<div class="flex items-start gap-3">
        <span class="w-10 h-10 rounded-xl bg-primary-50 text-primary grid place-items-center shrink-0">
          <i data-lucide="${b.icon}" class="w-5 h-5"></i>
        </span>
        <div>
          <div class="text-[12px] font-bold text-ink">${b.title}</div>
          <p class="text-[11px] leading-6 text-muted mt-1">${b.text}</p>
        </div>
      </div>`
    ).join('');
  }

  nxIcons();
}

nxRenderHome();
