/* IsBlue hover Add-to-Cart & Buy-Now buttons on product cards (all surfaces) */
(() => {
  const root = () => {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : base + '/';
  };

  function renderCartCount(itemCount) {
    if (!Number.isFinite(Number(itemCount))) return false;
    document.querySelectorAll('.ib-cart-count').forEach(n => n.textContent = itemCount);
    document.querySelectorAll('.ib-cart-link').forEach(n => n.setAttribute('aria-label', `Cart, ${itemCount} items`));
    document.querySelectorAll('[data-cart-count]').forEach(n => n.textContent = itemCount);
    return true;
  }

  function renderCartCountFromSections(sections, sectionId) {
    const html = sectionId && sections?.[sectionId];
    if (!html) return false;
    const document = new DOMParser().parseFromString(html, 'text/html');
    return renderCartCount(document.querySelector('.ib-cart-count')?.textContent);
  }

  function updateCartCount() {
    fetch(`${root()}cart.js`, { headers: { Accept: 'application/json' } })
      .then(r => r.ok ? r.json() : null)
      .then(cart => {
        if (!cart) return;
        renderCartCount(cart.item_count);
      })
      .catch(() => {});
  }

  function showCartError(message) {
    const toast = document.querySelector('[data-toast]');
    if (!toast) return;
    toast.textContent = message || 'Could not add this item. Please try again.';
    toast.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { toast.hidden = true; }, 4500);
  }

  async function addToCart(variantId, redirect) {
    const headerSectionId = document.querySelector('.ib-header[data-section-id]')?.dataset.sectionId;
    const payload = { items: [{ id: Number(variantId), quantity: 1 }] };
    payload.sections = [headerSectionId].filter(Boolean);
    const body = JSON.stringify(payload);
    try {
      const res = await fetch(`${root()}cart/add.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body,
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('The cart returned an invalid response. Please try again.');
      }
      if (!res.ok) throw new Error(data?.description || data?.message || 'Could not add to cart');
      if (!renderCartCountFromSections(data.sections, headerSectionId)) updateCartCount();
      if (redirect) window.location.assign(`${root()}checkout`);
      return true;
    } catch (err) {
      console.error('[isblue-hover-cart]', err.message);
      showCartError(err.message);
      return false;
    }
  }

  // Product forms dispatch this after Shopify confirms the add. Their bundled
  // section response supplies an exact total, so the custom header stays in sync
  // without another blocking cart request.
  document.addEventListener('shopify:cart:lines-update', event => {
    event.promise
      ?.then(({ cart, detail }) => renderCartCount(cart?.totalQuantity ?? detail?.itemCount))
      .catch(() => {});
  });

  document.addEventListener('click', async (e) => {
    const addBtn = e.target.closest('[data-hover-add]');
    const buyBtn = e.target.closest('[data-hover-buy]');
    const btn = addBtn || buyBtn;
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    const container = btn.closest('.ib-hover-buttons');
    const buttons = container ? container.querySelectorAll('button') : [btn];
    const originalHTML = btn.innerHTML;
    buttons.forEach(b => b.disabled = true);
    btn.textContent = 'Adding...';

    const ok = await addToCart(variantId, !!buyBtn);
    if (ok && addBtn) {
      document.dispatchEvent(new CustomEvent('isblue:cart-added', { detail: { button: btn, variantId } }));
      btn.textContent = 'Added';
      btn.classList.add('ib-hover-added');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('ib-hover-added');
        buttons.forEach(b => b.disabled = false);
      }, 1500);
    } else {
      btn.innerHTML = originalHTML;
      buttons.forEach(b => b.disabled = false);
    }
  });
})();
