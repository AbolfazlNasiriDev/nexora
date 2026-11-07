/* ==========================================================================
   NEXORA — Multi-step checkout (demo payment only)
   ========================================================================== */

(function nxCheckout() {
  const root = document.getElementById('checkout-root');
  if (!root) return;

  const PROVINCES = ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'البرز', 'آذربایجان شرقی', 'خوزستان', 'گیلان', 'مازندران', 'یزد', 'کرمان', 'قم'];
  const user = nxAuth.current();
  const defaultAddress = (nxAddresses.mine().find((a) => a.isDefault) || nxAddresses.mine()[0]) || null;

  const state = {
    step: 1,
    payment: 'online',
    shipping: nxShippingMethod(),
    form: {
      firstName: user ? user.firstName : defaultAddress ? defaultAddress.receiver.split(' ')[0] : '',
      lastName: user ? user.lastName : defaultAddress ? defaultAddress.receiver.split(' ').slice(1).join(' ') : '',
      phone: user ? user.phone : defaultAddress ? defaultAddress.phone : '',
      email: user ? user.email : '',
      province: defaultAddress ? defaultAddress.province : 'تهران',
      city: defaultAddress ? defaultAddress.city : '',
      line: defaultAddress ? defaultAddress.line : '',
      postalCode: defaultAddress ? defaultAddress.postalCode : ''
    },
    errors: {}
  };

  const STEPS = [
    { n: 1, label: 'اطلاعات خریدار', icon: 'user-round' },
    { n: 2, label: 'روش ارسال', icon: 'truck' },
    { n: 3, label: 'روش پرداخت', icon: 'credit-card' },
    { n: 4, label: 'تأیید سفارش', icon: 'clipboard-check' }
  ];

  const PAYMENTS = [
    { id: 'online', title: 'پرداخت آنلاین (نمایشی)', desc: 'اتصال به درگاه بانکی شبیه‌سازی می‌شود؛ هیچ مبلغی کسر نمی‌شود.', icon: 'globe', badge: 'نمایشی' },
    { id: 'cod', title: 'پرداخت در محل (نمایشی)', desc: 'پرداخت هنگام تحویل کالا؛ این روش نیز صرفاً برای نمایش فرایند است.', icon: 'hand-coins', badge: 'نمایشی' }
  ];

  function stepper() {
    return `<div class="card p-3 md:p-4 mb-3">
      <div class="flex items-center justify-between gap-1">
        ${STEPS.map((s, i) => {
          const done = state.step > s.n;
          const active = state.step === s.n;
          return `<div class="flex items-center gap-1.5 md:gap-2 flex-1 ${i < STEPS.length - 1 ? '' : 'flex-none'}">
            <button class="flex items-center gap-1.5 md:gap-2 text-right ${done ? 'cursor-pointer' : 'cursor-default'}" ${done ? `data-goto-step="${s.n}"` : ''}>
              <span class="step-dot ${active ? 'is-active' : ''} ${done ? 'is-done' : ''}">${done ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : nxFa(s.n)}</span>
              <span class="hidden sm:block text-[10.5px] font-semibold ${active ? 'text-primary' : done ? 'text-emerald-600' : 'text-muted'} whitespace-nowrap">${s.label}</span>
            </button>
            ${i < STEPS.length - 1 ? `<span class="flex-1 h-px ${done ? 'bg-emerald-300' : 'bg-line'} min-w-3"></span>` : ''}
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  function summary(totals) {
    return `<div class="card p-4 sticky top-28">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-[12.5px] font-extrabold text-ink flex items-center gap-2"><i data-lucide="receipt-text" class="w-4 h-4 text-primary"></i> خلاصه سفارش</h2>
        <a href="cart.html" class="text-[10px] font-bold text-primary">ویرایش سبد</a>
      </div>
      <div class="space-y-2 max-h-56 overflow-y-auto scroll-thin pe-1">
        ${totals.items
          .map(
            (i) => `<div class="flex items-center gap-2">
              <span class="w-10 h-10 rounded-lg bg-page border border-line grid place-items-center overflow-hidden shrink-0">
                <img src="${NXArt.product(i.product, 1)}" alt="" class="w-full h-full object-contain">
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-[10.5px] font-semibold text-ink truncate">${nxEscape(i.product.name)}</div>
                <div class="text-[9.5px] text-muted mt-0.5">${nxFa(i.qty)} عدد · ${nxEscape(i.color || '')}</div>
              </div>
              <span class="text-[10px] font-bold text-ink whitespace-nowrap">${nxNumber(i.product.price * i.qty)}</span>
            </div>`
          )
          .join('')}
      </div>
      <div class="space-y-1.5 text-[11px] border-t border-line pt-3 mt-3">
        <div class="flex items-center justify-between"><span class="text-muted">جمع کل</span><span>${nxNumber(totals.subtotal)} تومان</span></div>
        ${totals.productDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>تخفیف محصولات</span><span>${nxNumber(totals.productDiscount)} تومان</span></div>` : ''}
        ${totals.couponDiscount ? `<div class="flex items-center justify-between text-emerald-600"><span>کد تخفیف</span><span>${nxNumber(totals.couponDiscount)} تومان</span></div>` : ''}
        <div class="flex items-center justify-between"><span class="text-muted">ارسال (${NX_SHIPPING[totals.shippingMethod].label})</span><span>${totals.shipping ? `${nxNumber(totals.shipping)} تومان` : 'رایگان'}</span></div>
        <div class="flex items-center justify-between pt-2 border-t border-line mt-1 font-extrabold text-ink text-[12.5px]">
          <span>مبلغ نهایی</span><span>${nxNumber(totals.total)} <span class="text-[9px] text-muted font-medium">تومان</span></span>
        </div>
      </div>
      <div class="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-2.5">
        <div class="flex items-start gap-1.5 text-[9.5px] leading-5 text-amber-700">
          <i data-lucide="triangle-alert" class="w-3.5 h-3.5 shrink-0 mt-0.5"></i>
          این محیط نمایشی است؛ پرداخت واقعی انجام نمی‌شود و سفارش فقط در مرورگر شما ذخیره می‌گردد.
        </div>
      </div>
    </div>`;
  }

  function err(field) {
    return state.errors[field] ? `<p class="error-text show">${state.errors[field]}</p>` : '';
  }

  function fieldClass(field) {
    return `field !text-[11.5px] ${state.errors[field] ? 'is-error' : ''}`;
  }

  function step1() {
    return `<div class="card p-4 md:p-5">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2 mb-1"><i data-lucide="user-round" class="w-4 h-4 text-primary"></i> اطلاعات خریدار</h2>
      <p class="text-[10.5px] text-muted mb-4">اطلاعات تحویل‌گیرنده را کامل وارد کنید. فیلدهای ستاره‌دار الزامی هستند.</p>

      ${!user ? `<div class="rounded-xl border border-primary-100 bg-primary-50 p-2.5 mb-4 flex flex-wrap items-center justify-between gap-2">
        <span class="text-[10.5px] text-primary-700">حساب کاربری دارید؟ ورود اطلاعات را سریع‌تر می‌کند.</span>
        <a href="login.html?next=checkout.html" class="btn btn-soft btn-sm !bg-white">ورود به حساب</a>
      </div>` : ''}

      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <label class="lbl">نام *</label>
          <input class="${fieldClass('firstName')}" name="firstName" value="${nxEscape(state.form.firstName)}" placeholder="مثلاً سارا">
          ${err('firstName')}
        </div>
        <div>
          <label class="lbl">نام خانوادگی *</label>
          <input class="${fieldClass('lastName')}" name="lastName" value="${nxEscape(state.form.lastName)}" placeholder="مثلاً محمدی">
          ${err('lastName')}
        </div>
        <div>
          <label class="lbl">شماره موبایل *</label>
          <input class="${fieldClass('phone')}" name="phone" inputmode="numeric" maxlength="11" value="${nxEscape(state.form.phone)}" placeholder="09121234567">
          ${err('phone')}
        </div>
        <div>
          <label class="lbl">ایمیل (اختیاری)</label>
          <input class="field !text-[11.5px]" name="email" type="email" value="${nxEscape(state.form.email)}" placeholder="you@example.com">
        </div>
        <div>
          <label class="lbl">استان *</label>
          <select class="${fieldClass('province')}" name="province">
            ${PROVINCES.map((p) => `<option value="${p}" ${state.form.province === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
          ${err('province')}
        </div>
        <div>
          <label class="lbl">شهر *</label>
          <input class="${fieldClass('city')}" name="city" value="${nxEscape(state.form.city)}" placeholder="مثلاً تهران">
          ${err('city')}
        </div>
        <div class="sm:col-span-2">
          <label class="lbl">آدرس کامل *</label>
          <textarea class="${fieldClass('line')} !min-h-[80px]" name="line" placeholder="خیابان، کوچه، پلاک، واحد">${nxEscape(state.form.line)}</textarea>
          ${err('line')}
        </div>
        <div>
          <label class="lbl">کد پستی *</label>
          <input class="${fieldClass('postalCode')}" name="postalCode" inputmode="numeric" maxlength="10" value="${nxEscape(state.form.postalCode)}" placeholder="۱۰ رقم بدون خط تیره">
          ${err('postalCode')}
        </div>
      </div>

      <div class="flex items-center justify-between gap-2 mt-5">
        <a href="cart.html" class="btn btn-ghost btn-sm">بازگشت به سبد</a>
        <button class="btn btn-primary" data-next-step>ادامه: روش ارسال <i data-lucide="arrow-left" class="w-4 h-4"></i></button>
      </div>
    </div>`;
  }

  function step2() {
    return `<div class="card p-4 md:p-5">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2 mb-1"><i data-lucide="truck" class="w-4 h-4 text-primary"></i> روش ارسال</h2>
      <p class="text-[10.5px] text-muted mb-4">زمان و هزینه ارسال را انتخاب کنید.</p>
      <div class="space-y-2.5">
        ${Object.entries(NX_SHIPPING)
          .map(([key, option]) => {
            const active = state.shipping === key;
            const free = key === 'normal' && nxCartTotals().subtotal >= NX_FREE_SHIPPING_MIN;
            return `<label class="flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${active ? 'border-primary bg-primary-50/40' : 'border-line hover:border-primary-200'}">
              <input type="radio" name="ship" value="${key}" ${active ? 'checked' : ''} class="accent-primary mt-1">
              <span class="w-9 h-9 rounded-xl bg-primary-50 text-primary grid place-items-center shrink-0"><i data-lucide="${key === 'express' ? 'zap' : 'truck'}" class="w-4 h-4"></i></span>
              <span class="flex-1">
                <span class="block text-[12px] font-bold text-ink">${option.label}</span>
                <span class="block text-[10.5px] text-muted mt-1">${option.time}</span>
              </span>
              <span class="text-[11px] font-bold ${free ? 'text-emerald-600' : 'text-ink'}">${free ? 'رایگان' : `${nxNumber(option.price)} تومان`}</span>
            </label>`;
          })
          .join('')}
      </div>
      <div class="flex items-center justify-between gap-2 mt-5">
        <button class="btn btn-ghost btn-sm" data-prev-step><i data-lucide="arrow-right" class="w-4 h-4"></i> مرحله قبل</button>
        <button class="btn btn-primary" data-next-step>ادامه: روش پرداخت <i data-lucide="arrow-left" class="w-4 h-4"></i></button>
      </div>
    </div>`;
  }

  function step3() {
    return `<div class="card p-4 md:p-5" id="payment">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2 mb-1"><i data-lucide="credit-card" class="w-4 h-4 text-primary"></i> روش پرداخت</h2>
      <p class="text-[10.5px] text-muted mb-4">در این نسخه نمایشی هیچ تراکنش واقعی انجام نمی‌شود.</p>
      <div class="space-y-2.5">
        ${PAYMENTS.map(
          (p) => `<label class="flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition ${state.payment === p.id ? 'border-primary bg-primary-50/40' : 'border-line hover:border-primary-200'}">
            <input type="radio" name="payment" value="${p.id}" ${state.payment === p.id ? 'checked' : ''} class="accent-primary mt-1">
            <span class="w-9 h-9 rounded-xl bg-primary-50 text-primary grid place-items-center shrink-0"><i data-lucide="${p.icon}" class="w-4 h-4"></i></span>
            <span class="flex-1">
              <span class="block text-[12px] font-bold text-ink flex items-center gap-1.5">${p.title}
                <span class="text-[9px] font-semibold bg-amber-100 text-amber-700 rounded-md px-1.5 py-0.5">${p.badge}</span>
              </span>
              <span class="block text-[10.5px] text-muted mt-1 leading-5">${p.desc}</span>
            </span>
          </label>`
        ).join('')}
      </div>
      <div class="rounded-xl border border-line bg-page p-3 mt-4 flex items-start gap-2">
        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
        <p class="text-[10px] leading-5 text-muted">برای پرداخت واقعی، اتصال به درگاه بانکی و بک‌اند امن لازم است. سفارش شما فقط در LocalStorage همین مرورگر ذخیره می‌شود.</p>
      </div>
      <div class="flex items-center justify-between gap-2 mt-5">
        <button class="btn btn-ghost btn-sm" data-prev-step><i data-lucide="arrow-right" class="w-4 h-4"></i> مرحله قبل</button>
        <button class="btn btn-primary" data-next-step>ادامه: تأیید سفارش <i data-lucide="arrow-left" class="w-4 h-4"></i></button>
      </div>
    </div>`;
  }

  function step4(totals) {
    const f = state.form;
    const payment = PAYMENTS.find((p) => p.id === state.payment);
    return `<div class="card p-4 md:p-5">
      <h2 class="text-sm font-extrabold text-ink flex items-center gap-2 mb-1"><i data-lucide="clipboard-check" class="w-4 h-4 text-primary"></i> تأیید نهایی سفارش</h2>
      <p class="text-[10.5px] text-muted mb-4">اطلاعات را یک بار دیگر بررسی کنید و سفارش را ثبت کنید.</p>

      <div class="grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl border border-line p-3">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[11px] font-bold text-ink flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-primary"></i> تحویل‌گیرنده</div>
            <button class="text-[10px] font-bold text-primary" data-goto-step="1">ویرایش</button>
          </div>
          <div class="text-[11px] text-ink/80 leading-6">${nxEscape(f.firstName + ' ' + f.lastName)}</div>
          <div class="text-[10.5px] text-muted leading-6">${nxEscape(f.phone)}</div>
          <div class="text-[10.5px] text-muted leading-6 mt-1">${nxEscape(f.province)}، ${nxEscape(f.city)}، ${nxEscape(f.line)} — کد پستی ${nxFa(f.postalCode)}</div>
        </div>
        <div class="space-y-3">
          <div class="rounded-xl border border-line p-3">
            <div class="flex items-center justify-between mb-1.5">
              <div class="text-[11px] font-bold text-ink flex items-center gap-1.5"><i data-lucide="truck" class="w-3.5 h-3.5 text-primary"></i> روش ارسال</div>
              <button class="text-[10px] font-bold text-primary" data-goto-step="2">ویرایش</button>
            </div>
            <div class="text-[10.5px] text-muted">${NX_SHIPPING[state.shipping].label} — ${NX_SHIPPING[state.shipping].time}</div>
          </div>
          <div class="rounded-xl border border-line p-3">
            <div class="flex items-center justify-between mb-1.5">
              <div class="text-[11px] font-bold text-ink flex items-center gap-1.5"><i data-lucide="credit-card" class="w-3.5 h-3.5 text-primary"></i> روش پرداخت</div>
              <button class="text-[10px] font-bold text-primary" data-goto-step="3">ویرایش</button>
            </div>
            <div class="text-[10.5px] text-muted">${payment ? payment.title : ''}</div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-line mt-3 overflow-hidden">
        <div class="bg-page px-3 py-2 text-[11px] font-bold text-ink">اقلام سفارش (${nxFa(totals.count)} کالا)</div>
        ${totals.items
          .map(
            (i) => `<div class="flex items-center gap-2.5 p-3 border-t border-line">
              <span class="w-11 h-11 rounded-lg bg-page border border-line grid place-items-center overflow-hidden shrink-0">
                <img src="${NXArt.product(i.product, 1)}" alt="" class="w-full h-full object-contain">
              </span>
              <div class="flex-1 min-w-0">
                <div class="text-[11px] font-semibold text-ink truncate">${nxEscape(i.product.name)}</div>
                <div class="text-[9.5px] text-muted mt-0.5">${nxFa(i.qty)} عدد · ${nxEscape(i.color || '')} · ${nxEscape(i.warranty || '')}</div>
              </div>
              <span class="text-[11px] font-bold text-ink whitespace-nowrap">${nxNumber(i.product.price * i.qty)} تومان</span>
            </div>`
          )
          .join('')}
      </div>

      <div class="rounded-xl bg-page border border-line p-3 mt-3 text-[11px] space-y-1.5">
        <div class="flex justify-between"><span class="text-muted">جمع کل</span><span>${nxNumber(totals.subtotal)} تومان</span></div>
        ${totals.productDiscount ? `<div class="flex justify-between text-emerald-600"><span>تخفیف محصولات</span><span>− ${nxNumber(totals.productDiscount)} تومان</span></div>` : ''}
        ${totals.couponDiscount ? `<div class="flex justify-between text-emerald-600"><span>کد تخفیف</span><span>− ${nxNumber(totals.couponDiscount)} تومان</span></div>` : ''}
        <div class="flex justify-between"><span class="text-muted">هزینه ارسال</span><span>${totals.shipping ? `${nxNumber(totals.shipping)} تومان` : 'رایگان'}</span></div>
        <div class="flex justify-between font-extrabold text-ink text-[12.5px] pt-2 border-t border-line"><span>مبلغ قابل پرداخت</span><span>${nxNumber(totals.total)} تومان</span></div>
      </div>

      <div class="flex items-center justify-between gap-2 mt-5">
        <button class="btn btn-ghost btn-sm" data-prev-step><i data-lucide="arrow-right" class="w-4 h-4"></i> مرحله قبل</button>
        <button class="btn btn-primary btn-lg" data-place-order>
          <i data-lucide="check-circle-2" class="w-4 h-4"></i> ثبت نهایی سفارش (نمایشی)
        </button>
      </div>
    </div>`;
  }

  function success(order) {
    return `<div class="max-w-2xl mx-auto">
      <div class="card p-6 md:p-8 text-center">
        <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mx-auto">
          <i data-lucide="check-circle-2" class="w-9 h-9"></i>
        </div>
        <h1 class="text-lg md:text-xl font-black text-ink mt-4">سفارش نمایشی شما ثبت شد</h1>
        <p class="text-[11.5px] text-muted leading-6 mt-2 max-w-md mx-auto">این سفارش فقط در مرورگر شما ذخیره شده است؛ هیچ پرداخت واقعی انجام نشده و کالایی ارسال نمی‌شود.</p>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5">
          <div class="rounded-xl bg-page border border-line p-2.5">
            <div class="text-[9.5px] text-muted">شماره سفارش</div>
            <div class="text-[11.5px] font-extrabold text-ink mt-1">${order.code}</div>
          </div>
          <div class="rounded-xl bg-page border border-line p-2.5">
            <div class="text-[9.5px] text-muted">وضعیت</div>
            <div class="text-[11.5px] font-extrabold text-amber-600 mt-1">در حال پردازش</div>
          </div>
          <div class="rounded-xl bg-page border border-line p-2.5">
            <div class="text-[9.5px] text-muted">مبلغ</div>
            <div class="text-[11.5px] font-extrabold text-ink mt-1">${nxNumber(order.totals.total)}</div>
          </div>
          <div class="rounded-xl bg-page border border-line p-2.5">
            <div class="text-[9.5px] text-muted">تاریخ</div>
            <div class="text-[11.5px] font-extrabold text-ink mt-1">${nxDate(order.createdAt)}</div>
          </div>
        </div>

        <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-700 mt-4 flex items-start gap-2 text-right">
          <i data-lucide="info" class="w-4 h-4 shrink-0 mt-0.5"></i>
          برای پرداخت واقعی و ارسال کالا، اتصال به درگاه بانکی و بک‌اند لازم است. در نسخه نمایشی هیچ پرداخت موفقی جعل نمی‌شود.
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2 mt-5">
          <a href="orders.html" class="btn btn-primary">پیگیری سفارش‌ها</a>
          <a href="products.html" class="btn btn-outline">ادامه خرید</a>
          <a href="index.html" class="btn btn-ghost">صفحه اصلی</a>
        </div>
      </div>
    </div>`;
  }

  function validateStep1() {
    const f = state.form;
    const errors = {};
    if (f.firstName.trim().length < 2) errors.firstName = 'نام را وارد کنید (حداقل ۲ حرف).';
    if (f.lastName.trim().length < 2) errors.lastName = 'نام خانوادگی را وارد کنید.';
    if (!/^09\d{9}$/.test(f.phone.trim())) errors.phone = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.';
    if (!f.province.trim()) errors.province = 'استان را انتخاب کنید.';
    if (f.city.trim().length < 2) errors.city = 'شهر را وارد کنید.';
    if (f.line.trim().length < 10) errors.line = 'آدرس کامل را وارد کنید (حداقل ۱۰ کاراکتر).';
    if (!/^\d{10}$/.test(f.postalCode.trim())) errors.postalCode = 'کد پستی باید ۱۰ رقم باشد.';
    state.errors = errors;
    return Object.keys(errors).length === 0;
  }

  function render() {
    const totals = nxCartTotals();
    if (!totals.items.length) {
      root.innerHTML = `<div class="card p-8 md:p-12 text-center">
        <div class="empty-illu"><i data-lucide="shopping-bag" class="w-9 h-9"></i></div>
        <h1 class="text-base font-extrabold text-ink">برای تکمیل خرید، سبد شما نباید خالی باشد</h1>
        <p class="text-[11.5px] text-muted mt-2">محصولات مورد نظر خود را انتخاب کنید و دوباره به این صفحه برگردید.</p>
        <a href="products.html" class="btn btn-primary mt-4">مشاهده محصولات</a>
      </div>`;
      nxIcons();
      return;
    }

    let content = '';
    if (state.step === 1) content = step1();
    else if (state.step === 2) content = step2();
    else if (state.step === 3) content = step3();
    else content = step4(totals);

    root.innerHTML = `<h1 class="sr-only">تکمیل خرید</h1>
      <div class="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 class="text-lg md:text-xl font-black text-ink">تکمیل خرید</h2>
          <p class="text-[10.5px] text-muted mt-1">مرحله ${nxFa(state.step)} از ${nxFa(4)} — ${STEPS[state.step - 1].label}</p>
        </div>
        <span class="chip !text-[10px] !cursor-default !bg-amber-50 !border-amber-200 !text-amber-700"><i data-lucide="flask-conical" class="w-3.5 h-3.5"></i> محیط نمایشی</span>
      </div>
      ${stepper()}
      <div class="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-3 items-start">
        <div>${content}</div>
        ${summary(totals)}
      </div>`;
    nxIcons();
  }

  root.addEventListener('click', (event) => {
    if (event.target.closest('[data-next-step]')) {
      if (state.step === 1 && !validateStep1()) {
        render();
        nxToast('لطفاً خطاهای فرم را برطرف کنید.', 'error');
        return;
      }
      state.errors = {};
      state.step = Math.min(4, state.step + 1);
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (event.target.closest('[data-prev-step]')) {
      state.step = Math.max(1, state.step - 1);
      render();
      return;
    }
    const goto = event.target.closest('[data-goto-step]');
    if (goto) {
      state.step = Number(goto.dataset.gotoStep);
      render();
      return;
    }
    if (event.target.closest('[data-place-order]')) {
      const totals = nxCartTotals();
      if (!validateStep1()) {
        state.step = 1;
        render();
        nxToast('اطلاعات خریدار کامل نیست.', 'error');
        return;
      }
      const order = nxOrders.add({
        customer: {
          firstName: state.form.firstName.trim(),
          lastName: state.form.lastName.trim(),
          phone: state.form.phone.trim(),
          email: state.form.email.trim()
        },
        address: {
          province: state.form.province,
          city: state.form.city,
          line: state.form.line,
          postalCode: state.form.postalCode
        },
        shipping: totals.shippingMethod,
        payment: state.payment,
        items: totals.items.map((i) => ({
          id: i.product.id,
          qty: i.qty,
          color: i.color,
          warranty: i.warranty,
          price: i.product.price,
          name: i.product.name,
          art: i.product.art,
          accent: i.product.accent
        })),
        totals: {
          subtotal: totals.subtotal,
          discount: totals.productDiscount,
          couponDiscount: totals.couponDiscount,
          shipping: totals.shipping,
          total: totals.total
        }
      });
      nxCart.clear();
      nxSetCoupon(null);
      nxToast('سفارش نمایشی با موفقیت ثبت شد.', 'success');
      root.innerHTML = success(order);
      nxIcons();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  root.addEventListener('input', (event) => {
    const input = event.target;
    if (!input.name || !(input.name in state.form)) return;
    state.form[input.name] = input.value;
    if (state.errors[input.name]) {
      state.errors[input.name] = null;
      input.classList.remove('is-error');
    }
  });

  root.addEventListener('change', (event) => {
    if (event.target.name === 'ship') {
      state.shipping = event.target.value;
      nxSetShipping(state.shipping);
      render();
      return;
    }
    if (event.target.name === 'payment') {
      state.payment = event.target.value;
      render();
    }
  });

  render();
})();
