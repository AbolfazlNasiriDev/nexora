/* ==========================================================================
   NEXORA — Shared UI shell
   Renders the header, mega menu, cart drawer, mobile navigation, footer,
   toasts and the reusable product card on every page.
   ========================================================================== */

/* --------------------------------- icons ---------------------------------- */
function nxIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.9 } });
  }
}

function nxStars(rating, reviews) {
  const value = Number(rating) || 0;
  const full = Math.round(value);
  let html = '<span class="stars" aria-label="امتیاز ' + nxFa(value) + ' از ۵">';
  for (let i = 1; i <= 5; i++) {
    html += `<svg viewBox="0 0 20 20" class="${i <= full ? '' : 'empty'}" aria-hidden="true"><path d="M10 1.4l2.65 5.37 5.93.86-4.29 4.18 1.01 5.9L10 14.92l-5.3 2.79 1.01-5.9L1.42 7.63l5.93-.86z"/></svg>`;
  }
  html += '</span>';
  if (reviews !== undefined) {
    html += `<span class="text-[11px] text-muted">${nxFa(value)} (${nxFa(reviews)})</span>`;
  }
  return html;
}

/* --------------------------------- toasts --------------------------------- */
const NX_TOAST_ICON = {
  success: 'check-circle-2',
  error: 'alert-circle',
  info: 'info',
  cart: 'shopping-bag'
};

function nxToast(message, type = 'info', options = {}) {
  let wrap = document.getElementById('nx-toasts');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'nx-toasts';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type === 'cart' ? 'info' : type}`;
  toast.innerHTML = `
    <span class="mt-0.5 text-primary">
      <i data-lucide="${NX_TOAST_ICON[type] || 'info'}" class="w-[18px] h-[18px]"></i>
    </span>
    <div class="flex-1 leading-6">${nxEscape(message)}
      ${options.action ? `<a href="${options.action.href}" class="block mt-1 text-[11px] font-bold text-primary">${nxEscape(options.action.label)} ←</a>` : ''}
    </div>
    <button class="text-muted hover:text-ink" aria-label="بستن اعلان"><i data-lucide="x" class="w-4 h-4"></i></button>
  `;
  wrap.appendChild(toast);
  nxIcons();
  const close = () => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 260);
  };
  toast.querySelector('button').addEventListener('click', close);
  setTimeout(close, options.duration || 3400);
}

/* ------------------------------- search box ------------------------------- */
function nxSearchHTML(suffix) {
  return `
    <form class="relative w-full" data-nx-search="${suffix}" autocomplete="off" role="search">
      <div class="flex items-center gap-2 bg-white border border-line rounded-2xl px-3 py-2 transition focus-within:border-primary-400 focus-within:shadow-soft">
        <i data-lucide="search" class="w-[18px] h-[18px] text-muted"></i>
        <input id="nx-search-input-${suffix}" type="search" name="q" class="flex-1 min-w-0 bg-transparent outline-none text-[13px] placeholder:text-muted/80" placeholder="جستجو در محصولات، برندها و دسته‌بندی‌ها…" aria-label="جستجو در NEXORA">
        <button type="button" class="hidden text-muted hover:text-ink" data-search-clear="${suffix}" aria-label="پاک کردن جستجو">
          <i data-lucide="x" class="w-4 h-4"></i>
        </button>
        <span class="hidden xl:flex items-center gap-1 text-[10px] text-muted border border-line rounded-lg px-1.5 py-0.5">Enter</span>
      </div>
      <div id="nx-search-panel-${suffix}" class="hidden absolute top-[calc(100%+10px)] inset-x-0 bg-white border border-line rounded-2xl shadow-card p-2 z-[70] max-h-[70vh] overflow-y-auto scroll-thin"></div>
    </form>`;
}

/* --------------------------------- header --------------------------------- */
function nxMegaMenu(cat) {
  const products = getProducts().filter((p) => p.cat === cat.id);
  const featured = products.slice().sort((a, b) => b.rating - a.rating).slice(0, 2);
  const countFor = (subId) => products.filter((p) => p.sub === subId).length;

  return `
    <div class="mega">
      <div class="shell py-6 grid grid-cols-12 gap-7">
        <div class="col-span-3">
          <div class="text-[11px] font-bold mb-1.5" style="color:${cat.color}">${cat.tagline}</div>
          <a href="${categoryUrl(cat.id)}" class="text-lg font-extrabold text-ink hover:text-primary transition">${cat.name}</a>
          <p class="text-[11px] leading-6 text-muted mt-2">${cat.desc}</p>
          <div class="mt-4 flex items-center gap-2">
            <a href="${categoryUrl(cat.id)}" class="btn btn-soft btn-sm">مشاهده همه</a>
            <span class="text-[11px] text-muted">${nxFa(products.length)} محصول</span>
          </div>
          <div class="mt-4 rounded-2xl p-3 flex items-center gap-3" style="background:${cat.tint}">
            <span class="w-10 h-10 rounded-xl grid place-items-center text-white shrink-0" style="background:${cat.color}">
              <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
            </span>
            <div class="text-[11px] leading-5 text-ink/70">ضمانت اصالت کالا و هفت روز مهلت بازگشت برای خریدهای این دسته.</div>
          </div>
        </div>
        <div class="col-span-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-extrabold text-ink">زیردسته‌ها</span>
            <span class="text-[10px] text-muted">${nxFa(cat.subs.length)} زیردسته</span>
          </div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-0.5">
            ${cat.subs
              .map(
                (s) => `<a class="mega-link" href="${categoryUrl(cat.id, s.id)}">
                  <span>${s.name}</span>
                  <span class="text-[10px] text-muted/80">${nxFa(countFor(s.id))}</span>
                </a>`
              )
              .join('')}
          </div>
        </div>
        <div class="col-span-3">
          <div class="text-xs font-extrabold text-ink mb-3">پیشنهاد NEXORA</div>
          <div class="space-y-2">
            ${featured
              .map(
                (p) => `<a href="product-details.html?id=${p.id}" class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-page transition">
                  <img src="${NXArt.product(p, 1)}" alt="${nxEscape(p.name)}" class="w-14 h-14 rounded-lg object-contain bg-page">
                  <span class="min-w-0">
                    <span class="block text-[11px] font-semibold text-ink truncate">${p.name}</span>
                    <span class="block text-[11px] text-muted mt-1">${nxNumber(p.price)} تومان</span>
                  </span>
                </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function nxNavHTML() {
  const page = document.body.dataset.page;
  const activeCat = document.body.dataset.cat || '';
  const items = [
    `<li><a class="nav-link ${page === 'home' ? 'is-active' : ''}" href="index.html">صفحه اصلی</a></li>`
  ];
  CATEGORIES.forEach((cat) => {
    items.push(`<li>
      <a class="nav-link ${activeCat === cat.id ? 'is-active' : ''}" href="${categoryUrl(cat.id)}">${cat.name}</a>
      ${nxMegaMenu(cat)}
    </li>`);
  });
  items.push(`<li>
    <a class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-rose-500 to-primary-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-glow" href="products.html?deals=1">
      <i data-lucide="flame" class="w-3.5 h-3.5"></i> پیشنهاد شگفت‌انگیز
    </a>
  </li>`);

  return `<nav class="hidden lg:block bg-white border-t border-line">
    <div class="shell relative">
      <ul class="flex items-center justify-between gap-2 py-1.5">${items.join('')}</ul>
    </div>
  </nav>`;
}

function nxAccountSlot() {
  const user = nxAuth.current();
  if (!user) {
    return `<div class="flex items-center gap-1.5">
      <a href="login.html" class="btn btn-outline btn-sm gap-1.5"><i data-lucide="user" class="w-4 h-4"></i><span class="hidden xl:inline">ورود</span></a>
      <a href="register.html" class="btn btn-soft btn-sm hidden sm:inline-flex">ثبت‌نام</a>
    </div>`;
  }
  return `<div class="relative" data-account>
    <button class="btn btn-outline btn-sm gap-1.5" data-account-toggle aria-haspopup="true">
      <i data-lucide="user-circle" class="w-4 h-4"></i>
      <span class="max-w-[6rem] truncate">${nxEscape(user.firstName)}</span>
      <i data-lucide="chevron-down" class="w-3.5 h-3.5"></i>
    </button>
    <div class="hidden absolute left-0 top-[calc(100%+10px)] w-56 bg-white border border-line rounded-2xl shadow-card p-2 z-[70]" data-account-menu>
      <div class="px-2 py-1.5 mb-1 border-b border-line">
        <div class="text-xs font-bold text-ink truncate">${nxEscape(user.firstName + ' ' + user.lastName)}</div>
        <div class="text-[10px] text-muted truncate mt-0.5">${nxEscape(user.email)}</div>
      </div>
      <a href="profile.html" class="dash-link"><i data-lucide="layout-dashboard" class="w-4 h-4"></i> پنل کاربری</a>
      <a href="orders.html" class="dash-link"><i data-lucide="package" class="w-4 h-4"></i> سفارش‌های من</a>
      <a href="wishlist.html" class="dash-link"><i data-lucide="heart" class="w-4 h-4"></i> علاقه‌مندی‌ها</a>
      ${user.isAdmin ? `<a href="admin.html" class="dash-link"><i data-lucide="shield" class="w-4 h-4"></i> پنل مدیریت</a>` : ''}
      <button class="dash-link w-full text-rose-600 hover:bg-rose-50" data-logout><i data-lucide="log-out" class="w-4 h-4"></i> خروج از حساب</button>
    </div>
  </div>`;
}

function nxHeaderHTML() {
  return `
    <div class="nx-top bg-white/95 backdrop-blur-xl">
      <div class="shell">
        <div class="flex items-center gap-2.5 py-3">
          <button class="icon-btn lg:hidden !w-10 !h-10" data-open-menu aria-label="منوی دسته‌بندی">
            <i data-lucide="menu" class="w-5 h-5"></i>
          </button>
          <a href="index.html" class="flex items-center gap-2.5 shrink-0" aria-label="NEXORA">
            <span class="relative grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow">
              <svg viewBox="0 0 24 24" class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 19V5l14 14V5"/>
              </svg>
              <span class="absolute -bottom-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-premium ring-2 ring-white"></span>
            </span>
            <span class="leading-none">
              <span class="block text-lg md:text-xl font-black tracking-tight text-ink">NEXORA</span>
              <span class="hidden sm:block text-[10px] text-muted mt-1">تکنولوژی، یک قدم جلوتر</span>
            </span>
          </a>
          <div class="hidden md:block flex-1 mx-1 lg:mx-3">${nxSearchHTML('d')}</div>
          <div class="flex items-center gap-1.5 md:gap-2 ms-auto">
            <div class="hidden sm:block" id="nx-account-slot">${nxAccountSlot()}</div>
            <a href="wishlist.html" class="icon-btn relative" aria-label="علاقه‌مندی‌ها">
              <i data-lucide="heart" class="w-[18px] h-[18px]"></i>
              <span class="hidden absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold grid place-items-center" data-wish-badge></span>
            </a>
            <button class="icon-btn relative !w-11 !h-11 !bg-primary !text-white !border-primary hover:!bg-primary-600" data-open-cart aria-label="سبد خرید">
              <i data-lucide="shopping-bag" class="w-[19px] h-[19px]"></i>
              <span class="hidden absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 rounded-full bg-ink ring-2 ring-white text-white text-[10px] font-bold grid place-items-center" data-cart-badge></span>
            </button>
          </div>
        </div>
        <div class="md:hidden pb-3">${nxSearchHTML('m')}</div>
      </div>
    </div>
    ${nxNavHTML()}
    <div class="nx-trust hidden md:block bg-gradient-to-l from-primary-50 via-white to-white border-t border-line">
      <div class="shell flex items-center justify-between gap-3 py-2 text-[11px] text-ink/70">
        ${[
          ['truck', 'ارسال سریع به سراسر کشور'],
          ['shield-check', 'ضمانت اصالت کالا'],
          ['headphones', 'پشتیبانی آنلاین ۹ تا ۲۱'],
          ['credit-card', 'پرداخت امن آنلاین'],
          ['rotate-ccw', '۷ روز ضمانت بازگشت']
        ]
          .map(
            ([icon, label]) => `<span class="inline-flex items-center gap-1.5 whitespace-nowrap">
              <i data-lucide="${icon}" class="w-4 h-4 text-primary"></i>${label}
            </span>`
          )
          .join('')}
      </div>
    </div>`;
}

/* -------------------------------- footer ---------------------------------- */
function nxFooterHTML() {
  const topCats = CATEGORIES.slice(0, 6);
  return `
  <footer class="mt-14 bg-ink text-white/70 relative overflow-hidden">
    <div class="absolute inset-0 opacity-60 pointer-events-none" style="background:radial-gradient(60% 60% at 85% 0%, rgba(91,69,232,.35), transparent 65%)"></div>
    <div class="shell relative pt-10 md:pt-14">
      <div class="grid lg:grid-cols-12 gap-6 rounded-3xl bg-white/[.04] border border-white/10 p-5 md:p-7 mb-10">
        <div class="lg:col-span-5">
          <h3 class="text-white text-lg font-extrabold mb-1.5">عضویت در خبرنامه NEXORA</h3>
          <p class="text-[12px] leading-6 text-white/55">از تخفیف‌های ویژه، محصولات تازه و پیشنهادهای شگفت‌انگیز زودتر از همه باخبر شوید.</p>
        </div>
        <div class="lg:col-span-7">
          <form id="nx-newsletter-form" class="flex flex-col sm:flex-row gap-2">
            <div class="flex-1">
              <input type="email" name="email" required class="field newsletter-input" placeholder="ایمیل خود را وارد کنید" aria-label="ایمیل خبرنامه">
            </div>
            <button class="btn btn-primary btn-lg shrink-0" type="submit">
              <i data-lucide="send" class="w-4 h-4"></i> عضویت
            </button>
          </form>
          <p class="text-[10px] text-white/35 mt-2">با عضویت، با سیاست حریم خصوصی NEXORA موافقت می‌کنید. هر زمان بخواهید می‌توانید لغو کنید.</p>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
        <div class="col-span-2 lg:col-span-4">
          <div class="flex items-center gap-2.5 mb-4">
            <span class="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19V5l14 14V5"/></svg>
            </span>
            <span class="leading-none">
              <span class="block text-lg font-black text-white">NEXORA</span>
              <span class="block text-[10px] text-white/45 mt-1">تکنولوژی، یک قدم جلوتر</span>
            </span>
          </div>
          <p class="text-[12px] leading-7 text-white/50 max-w-sm">NEXORA فروشگاه تخصصی محصولات دیجیتال، الکترونیکی و لوازم جانبی است؛ با تمرکز بر اصالت کالا، قیمت منصفانه و تجربه خرید سریع.</p>
          <div class="flex items-center gap-2 mt-5">
            ${[
              ['camera', 'https://instagram.com', 'اینستاگرام'],
              ['send', 'https://telegram.org', 'تلگرام'],
              ['at-sign', 'https://x.com', 'ایکس'],
              ['play', 'https://youtube.com', 'یوتیوب']
            ]
              .map(
                ([icon, href, label]) => `<a href="${href}" target="_blank" rel="noopener" class="w-9 h-9 rounded-xl bg-white/[.06] border border-white/10 grid place-items-center hover:bg-primary hover:border-primary transition" aria-label="${label}" title="${label}">
                  <i data-lucide="${icon}" class="w-4 h-4"></i>
                </a>`
              )
              .join('')}
          </div>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-white text-[13px] font-bold mb-4">راهنمای خرید</h4>
          <ul class="space-y-2.5 text-[12px]">
            <li><a class="link-muted" href="products.html">همه محصولات</a></li>
            <li><a class="link-muted" href="checkout.html">ثبت سفارش</a></li>
            <li><a class="link-muted" href="checkout.html#payment">روش‌های پرداخت</a></li>
            <li><a class="link-muted" href="cart.html">سبد خرید و ارسال</a></li>
            <li><a class="link-muted" href="orders.html">پیگیری سفارش</a></li>
          </ul>
        </div>

        <div class="lg:col-span-2">
          <h4 class="text-white text-[13px] font-bold mb-4">خدمات مشتریان</h4>
          <ul class="space-y-2.5 text-[12px]">
            <li><a class="link-muted" href="mailto:support@nexora.example">تماس با ما</a></li>
            <li><a class="link-muted" href="mailto:support@nexora.example?subject=سوال متداول">سوالات متداول</a></li>
            <li><a class="link-muted" href="profile.html">پنل کاربری</a></li>
            <li><a class="link-muted" href="compare.html">مقایسه محصولات</a></li>
            <li><a class="link-muted" href="wishlist.html">علاقه‌مندی‌ها</a></li>
          </ul>
        </div>

        <div class="lg:col-span-4">
          <h4 class="text-white text-[13px] font-bold mb-4">دسته‌بندی محصولات</h4>
          <ul class="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
            ${topCats
              .map((c) => `<li><a class="link-muted" href="${categoryUrl(c.id)}">${c.name}</a></li>`)
              .join('')}
            <li><a class="link-muted" href="products.html">همه دسته‌بندی‌ها</a></li>
          </ul>
          <div class="mt-5 flex flex-wrap items-center gap-2">
            ${['پرداخت امن', 'درگاه بانکی', 'ارسال پیگیری‌شده']
              .map((t) => `<span class="text-[10px] px-2.5 py-1.5 rounded-lg bg-white/[.06] border border-white/10 text-white/60">${t}</span>`)
              .join('')}
          </div>
        </div>
      </div>

      <div class="border-t border-white/10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
        <p class="text-white/45 text-center md:text-right">© ۱۴۰۴ NEXORA — تمام حقوق محفوظ است. این پروژه یک نسخه نمایشی است و پرداخت واقعی انجام نمی‌شود.</p>
        <div class="flex items-center gap-4">
          <a class="link-muted" href="admin.html">پنل مدیریت</a>
          <a class="link-muted" href="compare.html">مقایسه</a>
          <a class="link-muted" href="index.html">صفحه اصلی</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ------------------------------ mobile drawer ------------------------------ */
function nxMobileMenuHTML() {
  const user = nxAuth.current();
  return `
  <div class="nx-overlay" data-overlay></div>
  <aside class="nx-drawer nx-drawer--right" id="nx-mobile-menu" aria-label="منوی موبایل">
    <div class="drawer-head">
      <div class="flex items-center gap-2">
        <span class="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M5 19V5l14 14V5"/></svg>
        </span>
        <div>
          <div class="text-sm font-black text-ink">NEXORA</div>
          <div class="text-[10px] text-muted">منوی خرید</div>
        </div>
      </div>
      <button class="icon-btn !w-9 !h-9" data-close-menu aria-label="بستن منو"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="drawer-body">
      <div class="rounded-2xl bg-page border border-line p-3 mb-4">
        ${user
          ? `<div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-primary-100 text-primary-700 grid place-items-center font-bold">${nxEscape(user.firstName.charAt(0))}</span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-ink truncate">${nxEscape(user.firstName + ' ' + user.lastName)}</div>
                <div class="text-[10px] text-muted truncate">${nxEscape(user.phone)}</div>
              </div>
            </div>
            <a href="profile.html" class="btn btn-outline btn-sm btn-block mt-3">پنل کاربری</a>`
          : `<div class="text-xs font-semibold text-ink">به NEXORA خوش آمدید</div>
            <p class="text-[11px] text-muted mt-1">برای پیگیری سفارش‌ها وارد حساب خود شوید.</p>
            <div class="flex gap-2 mt-3">
              <a href="login.html" class="btn btn-primary btn-sm flex-1">ورود</a>
              <a href="register.html" class="btn btn-outline btn-sm flex-1">ثبت‌نام</a>
            </div>`}
      </div>

      <a href="index.html" class="dash-link"><i data-lucide="home" class="w-4 h-4"></i> صفحه اصلی</a>
      <a href="products.html?deals=1" class="dash-link !text-rose-600"><i data-lucide="flame" class="w-4 h-4"></i> پیشنهاد شگفت‌انگیز</a>

      <div class="text-[11px] font-bold text-muted mt-4 mb-2 px-1">دسته‌بندی‌ها</div>
      <div class="space-y-1">
        ${CATEGORIES.map(
          (cat) => `<details class="rounded-xl border border-line bg-white overflow-hidden">
            <summary class="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer list-none">
              <span class="w-7 h-7 rounded-lg grid place-items-center text-white" style="background:${cat.color}">
                <i data-lucide="${cat.icon}" class="w-3.5 h-3.5"></i>
              </span>
              <span class="text-[12px] font-semibold text-ink flex-1">${cat.name}</span>
              <i data-lucide="chevron-down" class="w-4 h-4 text-muted"></i>
            </summary>
            <div class="px-2 pb-2 pt-1 bg-page/60">
              <a href="${categoryUrl(cat.id)}" class="block text-[11px] font-semibold text-primary px-2 py-1.5">مشاهده همه محصولات</a>
              ${cat.subs
                .map((s) => `<a href="${categoryUrl(cat.id, s.id)}" class="block text-[11px] text-ink/70 px-2 py-1.5 rounded-lg hover:bg-white">${s.name}</a>`)
                .join('')}
            </div>
          </details>`
        ).join('')}
      </div>

      <div class="text-[11px] font-bold text-muted mt-4 mb-2 px-1">حساب و علاقه‌مندی</div>
      <a href="wishlist.html" class="dash-link"><i data-lucide="heart" class="w-4 h-4"></i> علاقه‌مندی‌ها</a>
      <a href="compare.html" class="dash-link"><i data-lucide="git-compare" class="w-4 h-4"></i> مقایسه محصولات</a>
      <a href="orders.html" class="dash-link"><i data-lucide="package" class="w-4 h-4"></i> سفارش‌های من</a>
      ${user && user.isAdmin ? `<a href="admin.html" class="dash-link"><i data-lucide="shield" class="w-4 h-4"></i> پنل مدیریت</a>` : ''}
      ${user ? `<button class="dash-link w-full text-rose-600" data-logout><i data-lucide="log-out" class="w-4 h-4"></i> خروج از حساب</button>` : ''}
    </div>
  </aside>`;
}

/* ------------------------------- cart drawer ------------------------------- */
function nxCartDrawerHTML() {
  return `
  <aside class="nx-drawer nx-drawer--right" id="nx-cart-drawer" aria-label="سبد خرید">
    <div class="drawer-head">
      <div>
        <div class="text-sm font-extrabold text-ink flex items-center gap-2">
          <i data-lucide="shopping-bag" class="w-4 h-4 text-primary"></i> سبد خرید
          <span class="text-[10px] font-semibold bg-primary-50 text-primary-700 rounded-full px-2 py-0.5" data-drawer-count>۰</span>
        </div>
        <div class="text-[10px] text-muted mt-1">محصولات انتخابی شما</div>
      </div>
      <button class="icon-btn !w-9 !h-9" data-close-cart aria-label="بستن سبد"><i data-lucide="x" class="w-4 h-4"></i></button>
    </div>
    <div class="drawer-body space-y-3" data-drawer-body></div>
    <div class="drawer-foot" data-drawer-foot></div>
  </aside>`;
}

function nxCartDrawerItem(item) {
  const p = item.product;
  return `<div class="flex gap-3 pb-3 border-b border-line last:border-0 last:pb-0">
    <a href="product-details.html?id=${p.id}" class="w-16 h-16 rounded-xl bg-page border border-line shrink-0 grid place-items-center overflow-hidden">
      <img src="${NXArt.product(p, 1)}" alt="${nxEscape(p.name)}" class="w-full h-full object-contain">
    </a>
    <div class="flex-1 min-w-0">
      <a href="product-details.html?id=${p.id}" class="block text-[11.5px] font-semibold text-ink leading-5 line-clamp-2 hover:text-primary">${nxEscape(p.name)}</a>
      <div class="text-[10px] text-muted mt-1">${nxEscape(item.color || '')}${item.color ? ' · ' : ''}${nxEscape((item.warranty || '').split(' ')[0])}</div>
      <div class="flex items-center justify-between mt-2 gap-2">
        <div class="flex items-center border border-line rounded-lg overflow-hidden">
          <button class="w-6 h-6 grid place-items-center text-muted hover:bg-page" data-cart-inc="${nxEscape(item.key)}" aria-label="افزایش"><i data-lucide="plus" class="w-3 h-3"></i></button>
          <span class="w-7 text-center text-[11px] font-bold">${nxFa(item.qty)}</span>
          <button class="w-6 h-6 grid place-items-center text-muted hover:bg-page" data-cart-dec="${nxEscape(item.key)}" aria-label="کاهش"><i data-lucide="minus" class="w-3 h-3"></i></button>
        </div>
        <span class="text-[11px] font-extrabold text-ink">${nxNumber(p.price * item.qty)} <span class="text-[9px] font-medium text-muted">تومان</span></span>
      </div>
    </div>
    <button class="self-start text-muted hover:text-rose-500" data-cart-remove="${nxEscape(item.key)}" aria-label="حذف از سبد">
      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
    </button>
  </div>`;
}

function nxRenderCartDrawer() {
  const body = document.querySelector('[data-drawer-body]');
  const foot = document.querySelector('[data-drawer-foot]');
  const countEl = document.querySelector('[data-drawer-count]');
  if (!body || !foot) return;
  const totals = nxCartTotals();

  if (!totals.items.length) {
    if (countEl) countEl.textContent = '۰';
    body.innerHTML = `<div class="empty-state !py-10">
      <div class="empty-illu"><i data-lucide="shopping-bag" class="w-8 h-8"></i></div>
      <h3 class="text-sm font-bold text-ink">سبد خرید شما خالی است</h3>
      <p class="text-[11px] text-muted mt-1.5 leading-6">از میان محصولات منتخب NEXORA انتخاب کنید و خرید خود را شروع کنید.</p>
      <a href="products.html" class="btn btn-primary btn-sm mt-4">مشاهده محصولات</a>
    </div>`;
    foot.innerHTML = `<p class="text-[10px] text-center text-muted">ارسال رایگان برای خریدهای بالای ${nxNumber(NX_FREE_SHIPPING_MIN)} تومان</p>`;
    nxIcons();
    return;
  }

  if (countEl) countEl.textContent = nxFa(totals.count);
  body.innerHTML = totals.items.map(nxCartDrawerItem).join('');
  foot.innerHTML = `
    <div class="space-y-1.5 text-[11px]">
      <div class="flex items-center justify-between"><span class="text-muted">جمع سبد</span><span class="font-semibold">${nxNumber(totals.subtotal)} تومان</span></div>
      ${totals.productDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>سود شما</span><span class="font-semibold">${nxNumber(totals.productDiscount)} تومان</span></div>` : ''}
      ${totals.couponDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>کد تخفیف</span><span class="font-semibold">${nxNumber(totals.couponDiscount)} تومان</span></div>` : ''}
      <div class="flex items-center justify-between pt-1.5 border-t border-line mt-2">
        <span class="font-bold text-ink">مبلغ قابل پرداخت</span>
        <span class="font-extrabold text-ink">${nxNumber(totals.total)} <span class="text-[9px] font-medium text-muted">تومان</span></span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-3">
      <a href="cart.html" class="btn btn-outline btn-sm">مشاهده سبد</a>
      <a href="checkout.html" class="btn btn-primary btn-sm">تکمیل خرید</a>
    </div>`;
  nxIcons();
}

function nxOpenCart() {
  const drawer = document.getElementById('nx-cart-drawer');
  const overlay = document.querySelector('[data-overlay]');
  if (!drawer) return;
  nxRenderCartDrawer();
  drawer.classList.add('is-open');
  if (overlay) overlay.classList.add('is-open');
  document.body.classList.add('no-scroll');
}

function nxCloseDrawers() {
  document.querySelectorAll('.nx-drawer.is-open').forEach((d) => d.classList.remove('is-open'));
  document.querySelectorAll('.nx-overlay.is-open').forEach((o) => o.classList.remove('is-open'));
  document.body.classList.remove('no-scroll');
}

/* ------------------------------- product card ----------------------------- */
function nxProductCard(p, options = {}) {
  if (!p) return '';
  const discount = p.discount || discountPercent(p);
  const out = p.stock <= 0;
  const inWish = nxWishlist.has(p.id);
  const inCompare = nxCompare.has(p.id);
  const stockBadge = out
    ? '<span class="badge-stock out">ناموجود</span>'
    : p.stock <= 5
      ? `<span class="badge-stock low">تنها ${nxFa(p.stock)} عدد</span>`
      : '<span class="badge-stock in">موجود در انبار</span>';

  return `<article class="card card-hover p-card group ${options.dark ? '!bg-white/[.04] !border-white/10' : ''}">
    <div class="p-2.5 md:p-3">
      <div class="p-media aspect-square">
        <a href="product-details.html?id=${p.id}" class="absolute inset-0 z-10" aria-label="${nxEscape(p.name)}"></a>
        <img src="${NXArt.product(p, 0)}" alt="${nxEscape(p.name)}" loading="lazy" class="w-full h-full object-contain p-2">
        <div class="absolute top-2 right-2 flex flex-col items-start gap-1 z-20">
          ${discount ? `<span class="badge-sale">${nxFa(discount)}٪ تخفیف</span>` : ''}
          ${p.tags.includes('new') ? '<span class="badge-new">جدید</span>' : ''}
        </div>
        <div class="absolute top-2 left-2 flex flex-col gap-1.5 p-actions z-20">
          <button class="icon-fav ${inWish ? 'is-active' : ''}" data-wishlist="${p.id}" title="افزودن به علاقه‌مندی‌ها" aria-label="افزودن به علاقه‌مندی‌ها">
            <i data-lucide="heart" class="w-4 h-4"></i>
          </button>
          <button class="icon-fav ${inCompare ? '!text-primary !bg-primary-50 !border-primary-200' : ''}" data-compare="${p.id}" title="افزودن به مقایسه" aria-label="افزودن به مقایسه">
            <i data-lucide="git-compare" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="absolute bottom-2 right-2 z-20">${stockBadge}</div>
      </div>
      <div class="pt-3">
        <div class="flex items-center justify-between gap-2 text-[11px] text-muted">
          <span class="font-semibold">${nxEscape(p.brand)}</span>
          <div class="flex items-center gap-1">${nxStars(p.rating, p.reviews)}</div>
        </div>
        <a href="product-details.html?id=${p.id}" class="p-name mt-1.5 block text-[12.5px] font-bold leading-6 text-ink ${options.dark ? '!text-white' : ''} hover:text-primary transition">${nxEscape(p.name)}</a>
        <div class="mt-2 flex items-end justify-between gap-2">
          <div>
            ${p.oldPrice ? `<div class="p-old">${nxNumber(p.oldPrice)}</div>` : '<div class="h-3"></div>'}
            <div class="p-price ${options.dark ? '!text-white' : ''}">${nxNumber(p.price)} <span class="p-unit">تومان</span></div>
          </div>
          ${discount ? `<span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-lg px-1.5 py-1">${nxFa(discount)}٪</span>` : ''}
        </div>
        <button class="btn ${out ? 'btn-outline !text-muted' : 'btn-primary'} btn-sm btn-block mt-2.5" data-add-to-cart="${p.id}" ${out ? 'disabled' : ''}>
          <i data-lucide="${out ? 'bell-off' : 'shopping-cart'}" class="w-4 h-4"></i>
          ${out ? 'ناموجود' : 'افزودن به سبد'}
        </button>
      </div>
    </div>
  </article>`;
}

function nxAddToCart(button) {
  const id = button.dataset.addToCart;
  const result = nxCart.add(id, {
    color: button.dataset.color || undefined,
    warranty: button.dataset.warranty || undefined,
    qty: button.dataset.qty || 1
  });
  if (!result.ok) {
    nxToast(result.message, 'error');
    return result;
  }
  nxToast('محصول به سبد خرید اضافه شد.', 'cart', { action: { label: 'مشاهده سبد خرید', href: 'cart.html' } });
  const original = button.innerHTML;
  button.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> به سبد اضافه شد';
  nxIcons();
  setTimeout(() => {
    button.innerHTML = original;
    nxIcons();
  }, 1500);
  return result;
}

/* --------------------------------- badges --------------------------------- */
function nxRefreshBadges() {
  const cartCount = nxCart.count();
  document.querySelectorAll('[data-cart-badge]').forEach((el) => {
    el.textContent = nxFa(cartCount);
    el.classList.toggle('hidden', cartCount === 0);
  });
  const wishCount = nxWishlist.count();
  document.querySelectorAll('[data-wish-badge]').forEach((el) => {
    el.textContent = nxFa(wishCount);
    el.classList.toggle('hidden', wishCount === 0);
  });
  document.querySelectorAll('[data-wishlist]').forEach((el) => {
    el.classList.toggle('is-active', nxWishlist.has(el.dataset.wishlist));
  });
  document.querySelectorAll('[data-compare]').forEach((el) => {
    el.classList.toggle('!text-primary', nxCompare.has(el.dataset.compare));
    el.classList.toggle('!bg-primary-50', nxCompare.has(el.dataset.compare));
    el.classList.toggle('!border-primary-200', nxCompare.has(el.dataset.compare));
  });
}

/* ---------------------------------- shell --------------------------------- */
function nxMountShell() {
  const header = document.getElementById('site-header');
  if (header) header.innerHTML = nxHeaderHTML();
  if (header) header.classList.add('nx-header');

  const footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = nxFooterHTML();

  document.body.insertAdjacentHTML('beforeend', nxMobileMenuHTML());
  document.body.insertAdjacentHTML('beforeend', nxCartDrawerHTML());
  document.body.insertAdjacentHTML('beforeend', `
    <div class="toast-wrap" id="nx-toasts"></div>
    <div class="mobile-bar">
      <a href="index.html" class="flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] ${document.body.dataset.page === 'home' ? 'text-primary' : 'text-muted'}">
        <i data-lucide="home" class="w-[18px] h-[18px]"></i> خانه
      </a>
      <button data-open-menu class="flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] text-muted">
        <i data-lucide="layout-grid" class="w-[18px] h-[18px]"></i> دسته‌بندی
      </button>
      <button data-open-cart class="relative flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] text-muted">
        <i data-lucide="shopping-bag" class="w-[18px] h-[18px]"></i> سبد
        <span class="hidden absolute top-0 left-1/2 translate-x-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-primary text-white text-[9px] grid place-items-center" data-cart-badge></span>
      </button>
      <a href="wishlist.html" class="flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] text-muted">
        <i data-lucide="heart" class="w-[18px] h-[18px]"></i> علاقه
      </a>
      <a href="profile.html" class="flex flex-col items-center gap-0.5 py-1.5 text-[9.5px] text-muted">
        <i data-lucide="user" class="w-[18px] h-[18px]"></i> حساب
      </a>
    </div>`);

  nxIcons();
  nxRefreshBadges();
  nxRenderCartDrawer();
}

function nxBindShell() {
  /* sticky header */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* global click delegation */
  document.addEventListener('click', (event) => {
    const target = event.target;

    const openMenu = target.closest('[data-open-menu]');
    if (openMenu) {
      document.getElementById('nx-mobile-menu')?.classList.add('is-open');
      document.querySelector('[data-overlay]')?.classList.add('is-open');
      document.body.classList.add('no-scroll');
      return;
    }
    if (target.closest('[data-close-menu]')) {
      nxCloseDrawers();
      return;
    }
    if (target.closest('[data-close-cart]')) {
      nxCloseDrawers();
      return;
    }
    if (target.closest('[data-open-cart]')) {
      nxOpenCart();
      return;
    }
    if (target.matches('[data-overlay]')) {
      nxCloseDrawers();
      return;
    }

    const addButton = target.closest('[data-add-to-cart]');
    if (addButton && !addButton.disabled) {
      event.preventDefault();
      nxAddToCart(addButton);
      return;
    }

    const wishButton = target.closest('[data-wishlist]');
    if (wishButton) {
      event.preventDefault();
      const result = nxWishlist.toggle(wishButton.dataset.wishlist);
      nxToast(
        result.added ? 'محصول به علاقه‌مندی‌ها اضافه شد.' : 'محصول از علاقه‌مندی‌ها حذف شد.',
        result.added ? 'success' : 'info',
        result.added ? { action: { label: 'مشاهده علاقه‌مندی‌ها', href: 'wishlist.html' } } : {}
      );
      return;
    }

    const compareButton = target.closest('[data-compare]');
    if (compareButton) {
      event.preventDefault();
      const result = nxCompare.toggle(compareButton.dataset.compare);
      if (result.error) nxToast(result.error, 'error');
      else
        nxToast(
          result.added ? 'محصول به لیست مقایسه اضافه شد.' : 'محصول از لیست مقایسه حذف شد.',
          result.added ? 'success' : 'info',
          result.added ? { action: { label: 'مقایسه محصولات', href: 'compare.html' } } : {}
        );
      return;
    }

    const inc = target.closest('[data-cart-inc]');
    if (inc) {
      nxCart.inc(inc.dataset.cartInc);
      return;
    }
    const dec = target.closest('[data-cart-dec]');
    if (dec) {
      nxCart.dec(dec.dataset.cartDec);
      return;
    }
    const remove = target.closest('[data-cart-remove]');
    if (remove) {
      nxCart.remove(remove.dataset.cartRemove);
      nxToast('محصول از سبد خرید حذف شد.', 'info');
      return;
    }

    const accountToggle = target.closest('[data-account-toggle]');
    if (accountToggle) {
      event.preventDefault();
      document.querySelector('[data-account-menu]')?.classList.toggle('hidden');
      return;
    }
    if (!target.closest('[data-account]')) {
      document.querySelector('[data-account-menu]')?.classList.add('hidden');
    }

    const logout = target.closest('[data-logout]');
    if (logout) {
      nxAuth.logout();
      nxToast('از حساب کاربری خارج شدید.', 'success');
      setTimeout(() => (location.href = 'index.html'), 500);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') nxCloseDrawers();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      const input = document.getElementById('nx-search-input-d') || document.getElementById('nx-search-input-m');
      if (input) {
        event.preventDefault();
        input.focus();
      }
    }
  });

  /* newsletter */
  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'nx-newsletter-form') return;
    event.preventDefault();
    const input = event.target.querySelector('input[name="email"]');
    const result = nxSubscribe(input.value);
    nxToast(result.message, result.ok ? 'success' : 'error');
    if (result.ok) input.value = '';
  });

  /* reactive updates */
  document.addEventListener('nx:cart', () => {
    nxRefreshBadges();
    nxRenderCartDrawer();
  });
  document.addEventListener('nx:wishlist', nxRefreshBadges);
  document.addEventListener('nx:compare', nxRefreshBadges);
  document.addEventListener('nx:auth', () => {
    const slot = document.getElementById('nx-account-slot');
    if (slot) slot.innerHTML = nxAccountSlot();
    nxIcons();
  });
}

/* -------------------------------- boot ----------------------------------- */
(function nxBoot() {
  nxMountShell();
  nxBindShell();
  document.dispatchEvent(new CustomEvent('nx:ready'));
})();
