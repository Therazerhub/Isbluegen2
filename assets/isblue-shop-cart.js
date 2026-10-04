(() => {
  const root = () => {
    const base = window.Shopify?.routes?.root || '/';
    return base.endsWith('/') ? base : `${base}/`;
  };

  const cartPage = document.querySelector('[data-cart-page]');
  if (!cartPage) return;

  const setBusy = (busy) => {
    cartPage.setAttribute('aria-busy', String(busy));
    cartPage.querySelectorAll('[data-cart-quantity]').forEach((button) => {
      button.disabled = busy;
    });
  };

  const changeQuantity = async (line, quantity) => {
    setBusy(true);
    try {
      const response = await fetch(`${root()}cart/change.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ line, quantity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.description || data.message || 'Could not update cart');
      window.location.reload();
    } catch (error) {
      setBusy(false);
      const toast = document.querySelector('[data-toast]');
      if (toast) {
        toast.textContent = error.message;
        toast.hidden = false;
      }
    }
  };

  cartPage.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-quantity]');
    if (!button) return;
    const line = Number(button.dataset.line);
    const input = button.parentElement.querySelector('input');
    const current = Number(input?.value || 1);
    const next = button.dataset.cartQuantity === 'increase' ? current + 1 : current - 1;
    changeQuantity(line, Math.max(0, next));
  });

  const note = cartPage.querySelector('#CartNote');
  const count = cartPage.querySelector('[data-note-count]');
  if (note && count) {
    const updateCount = () => { count.textContent = `${note.value.length}/200`; };
    note.addEventListener('input', updateCount);
    updateCount();
  }
})();
