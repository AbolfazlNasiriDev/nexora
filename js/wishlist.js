/* ==========================================================================
   NEXORA — Wishlist page
   ========================================================================== */

(function nxWishlistPage() {
  const root = document.getElementById('wishlist-root');
  const actions = document.getElementById('wishlist-actions');
  if (!root) return;

  function render() {
    const items = nxWishlist.products();

    if (actions) {
      actions.innerHTML = items.length
        ? `<button class="btn btn-outline btn-sm" id="wishlist-add-all"><i data-lucide="shopping-cart" class="w-4 h-4"></i> افزودن همه به سبد</button>
           <a href="compare.html" class="btn btn-soft btn-sm"><i data-lucide="git-compare" class="w-4 h-4"></i> مقایسه</a>`
        : '';
    }

    if (!items.length) {
      root.innerHTML = `<div class="card p-8 md:p-12 text-center">
        <div class="empty-illu !bg-rose-50 !text-rose-500"><i data-lucide="heart" class="w-9 h-9"></i></div>
        <h2 class="text-base font-extrabold text-ink">لیست علاقه‌مندی‌ها خالی است</h2>
        <p class="text-[11.5px] text-muted mt-2 leading-6 max-w-md mx-auto">با زدن آیکون قلب روی هر محصول، آن را برای بررسی بعدی در این صفحه ذخیره می‌کنید.</p>
        <a href="products.html" class="btn btn-primary mt-5">مشاهده محصولات</a>
      </div>`;
      nxIcons();
      return;
    }

    root.innerHTML = `<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 md:gap-4">
      ${items.map((p) => nxProductCard(p)).join('')}
    </div>
    <p class="text-[10px] text-muted text-center mt-5">برای حذف هر محصول از این لیست، روی آیکون قلب آن بزنید.</p>`;
    nxIcons();
    nxRefreshBadges();
  }

  document.addEventListener('nx:wishlist', render);

  if (actions) {
    actions.addEventListener('click', (event) => {
      if (!event.target.closest('#wishlist-add-all')) return;
      const available = nxWishlist.products().filter((p) => p.stock > 0);
      if (!available.length) {
        nxToast('همه محصولات این لیست ناموجود هستند.', 'error');
        return;
      }
      let added = 0;
      available.forEach((p) => {
        const result = nxCart.add(p.id, { qty: 1 });
        if (result.ok) added += 1;
      });
      nxToast(`${nxFa(added)} محصول به سبد خرید اضافه شد.`, 'success', { action: { label: 'مشاهده سبد خرید', href: 'cart.html' } });
    });
  }

  render();
})();
