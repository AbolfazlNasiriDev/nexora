/* ==========================================================================
   NEXORA — Demo authentication pages (login / register)
   ========================================================================== */

(function nxAuthPage() {
  const page = document.body.dataset.page;
  const next = nxQ('next');
  const existing = nxAuth.current();

  if (existing) {
    const target = next || (existing.isAdmin ? 'admin.html' : 'profile.html');
    if (!location.pathname.endsWith(target)) {
      const link = document.querySelector('#login-form, #register-form');
      if (link) {
        const note = document.createElement('div');
        note.className = 'rounded-xl border border-emerald-200 bg-emerald-50 p-3 mt-4 text-[11px] text-emerald-700 flex items-center justify-between gap-2';
        note.innerHTML = `<span>شما با نام ${nxEscape(existing.firstName)} وارد شده‌اید.</span>
          <a href="${target}" class="btn btn-soft btn-sm !bg-white">ادامه</a>`;
        link.parentElement.insertBefore(note, link);
      }
    }
  }

  const showError = (field, message) => {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('show', !!message);
  };

  const clearErrors = (form) => {
    form.querySelectorAll('[data-error-for]').forEach((el) => {
      el.textContent = '';
      el.classList.remove('show');
    });
    form.querySelectorAll('.field').forEach((el) => el.classList.remove('is-error'));
  };

  const fail = (form, field, message) => {
    showError(field, message);
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      input.classList.add('is-error');
      input.focus();
    }
    return false;
  };

  /* password visibility toggles */
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-toggle-password]');
    if (!toggle) return;
    const input = toggle.parentElement.querySelector('input');
    if (!input) return;
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    toggle.innerHTML = `<i data-lucide="${show ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
    nxIcons();
  });

  /* demo account autofill */
  document.querySelectorAll('[data-fill]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isAdmin = btn.dataset.fill === 'admin';
      const identifier = document.getElementById('login-identifier');
      const password = document.getElementById('login-password');
      if (!identifier || !password) return;
      identifier.value = isAdmin ? 'admin@nexora.ir' : 'demo@nexora.ir';
      password.value = isAdmin ? 'Admin@1234' : 'Demo@1234';
      nxToast(isAdmin ? 'اطلاعات حساب مدیر پر شد.' : 'اطلاعات حساب نمونه پر شد.', 'info');
    });
  });

  /* login */
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors(loginForm);
      const identifier = loginForm.identifier.value.trim();
      const password = loginForm.password.value;

      if (!identifier) return fail(loginForm, 'identifier', 'ایمیل یا شماره موبایل را وارد کنید.');
      if (/^09\d{9}$/.test(identifier) === false && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(identifier)) {
        return fail(loginForm, 'identifier', 'ایمیل یا شماره موبایل معتبر وارد کنید.');
      }
      if (password.length < 6) return fail(loginForm, 'password', 'رمز عبور باید حداقل ۶ کاراکتر باشد.');

      const result = nxAuth.login(identifier, password);
      if (!result.ok) {
        nxToast(result.message, 'error');
        return fail(loginForm, 'password', result.message);
      }

      nxToast(result.message, 'success');
      const user = result.user;
      setTimeout(() => {
        location.href = next || (user.isAdmin ? 'admin.html' : 'profile.html');
      }, 500);
    });
  }

  /* register */
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    const passwordInput = registerForm.querySelector('[name="password"]');
    const bar = document.querySelector('[data-strength-bar]');
    const label = document.querySelector('[data-strength-label]');

    const strength = (value) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return Math.min(4, score);
    };

    passwordInput.addEventListener('input', () => {
      const score = strength(passwordInput.value);
      const config = [
        { w: '10%', c: 'bg-rose-400', t: 'ضعیف' },
        { w: '35%', c: 'bg-amber-400', t: 'متوسط' },
        { w: '65%', c: 'bg-sky-400', t: 'خوب' },
        { w: '100%', c: 'bg-emerald-500', t: 'قوی' }
      ][Math.max(0, score - 1)];
      if (bar) {
        bar.style.width = passwordInput.value ? config.w : '0%';
        bar.className = `block h-full transition-all ${config.c}`;
      }
      if (label) label.textContent = passwordInput.value ? config.t : 'ضعیف';
    });

    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearErrors(registerForm);
      const data = {
        firstName: registerForm.firstName.value.trim(),
        lastName: registerForm.lastName.value.trim(),
        phone: registerForm.phone.value.trim(),
        email: registerForm.email.value.trim(),
        password: registerForm.password.value
      };
      const confirm = registerForm.confirm.value;

      if (data.firstName.length < 2) return fail(registerForm, 'firstName', 'نام باید حداقل ۲ حرف باشد.');
      if (data.lastName.length < 2) return fail(registerForm, 'lastName', 'نام خانوادگی باید حداقل ۲ حرف باشد.');
      if (!/^09\d{9}$/.test(data.phone)) return fail(registerForm, 'phone', 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.');
      if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(data.email)) return fail(registerForm, 'email', 'ایمیل معتبر وارد کنید.');
      if (data.password.length < 8 || !/[0-9]/.test(data.password) || !/[A-Za-z]/.test(data.password)) {
        return fail(registerForm, 'password', 'رمز باید حداقل ۸ کاراکتر و شامل حرف و عدد باشد.');
      }
      if (confirm !== data.password) return fail(registerForm, 'confirm', 'تکرار رمز عبور مطابقت ندارد.');
      if (!registerForm.terms.checked) return fail(registerForm, 'terms', 'برای ادامه باید قوانین را بپذیرید.');

      const result = nxAuth.register(data);
      if (!result.ok) {
        nxToast(result.message, 'error');
        return fail(registerForm, 'email', result.message);
      }
      nxToast(result.message, 'success');
      setTimeout(() => (location.href = next || 'profile.html'), 600);
    });
  }

  if (!loginForm && !registerForm && page === 'login') {
    nxToast('فرم ورود بارگذاری نشد.', 'error');
  }
})();
