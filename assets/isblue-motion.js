/* IsBlue motion: progressive enhancement; commerce works without these libraries. */
(() => {
  if (window.__isblueMotion || !window.gsap || !window.ScrollTrigger) return;
  window.__isblueMotion = true;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  let media;
  let rebuildTimer;
  function mount() {
    media?.revert();
    media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      // Native scrolling is intentional. The previous global Lenis instance intercepted
      // every wheel/trackpad event on fine-pointer devices and was the root cause of
      // unreliable desktop scrolling. ScrollTrigger observes native scroll directly.
      const animate = nodes => gsap.fromTo(nodes, { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.82, stagger: 0.065, ease: 'power3.out', force3D: true,
        clearProps: 'transform,opacity', overwrite: 'auto',
      });
      // Keep the conversion-critical hero readable immediately. GSAP is reserved for
      // below-the-fold hierarchy and cart feedback, where motion never delays the CTA.
      const triggers = [];
      const tweens = [];
      document.querySelectorAll('.ib-home-trust__grid, .ib-home-product-grid, .ib-home-banner, .ib-home-values-grid, .ib-home-testimonials-grid, .ib-home-newsletter, .ib-category-row, .ib-promos, .ib-product-grid:not(.ib-home-product-grid), .ib-benefits, .ib-product-features, .ib-product-story, .ib-story, .ib-bundle, .ib-login-card').forEach(group => {
        triggers.push(ScrollTrigger.create({ trigger: group, start: 'top 88%', once: true,
          onEnter: () => {
            const items = group.matches('.ib-product-story, .ib-bundle, .ib-login-card') ? [group] : [...group.children];
            tweens.push(animate(items));
          },
        }));
      });
      if (matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
        const photo = document.querySelector('.ib-hero-image');
        if (photo) gsap.fromTo(photo, { scale: 1.035, yPercent: -1 }, {
          scale: 1.075, yPercent: 2, ease: 'none',
          scrollTrigger: { trigger: '.ib-hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
        });
      }
      const revealFocused = event => {
        // Keyboard navigation must never wait for a decorative reveal.
        const tween = tweens.find(t => t.targets().some(node => node === event.target || node.contains(event.target)));
        tween?.progress(1);
      };
      document.addEventListener('focusin', revealFocused);
      const cartAdded = event => {
        const button = event.detail?.button || event.target;
        animateCartFlight(button);
        animateCartSuccess(button);
      };
      let pendingCartButton;
      const rememberCartButton = event => {
        const button = event.target.closest?.('[name="add"], [data-add-to-cart], add-to-cart-component button, product-form button[type="submit"]');
        if (button) {
          pendingCartButton = button;
          const nativeFlyer = button.closest('add-to-cart-component');
          const nativeFlyerEnabled = nativeFlyer?.dataset.addToCartAnimation === 'true' && Boolean(nativeFlyer.dataset.productVariantMedia);
          if (!nativeFlyerEnabled) animateCartFlight(button);
        }
      };
      const shopifyCartAdded = event => {
        if (event.action !== 'add' || !pendingCartButton) return;
        const button = pendingCartButton;
        pendingCartButton = null;
        event.promise?.then(result => { if (!result?.detail?.didError) animateCartSuccess(button); }).catch(() => {});
      };
      document.addEventListener('click', rememberCartButton, true);
      document.addEventListener('isblue:cart-added', cartAdded);
      document.addEventListener('shopify:cart:lines-update', shopifyCartAdded);
      ScrollTrigger.refresh();
      return () => {
        document.removeEventListener('focusin', revealFocused);
        document.removeEventListener('click', rememberCartButton, true);
        document.removeEventListener('isblue:cart-added', cartAdded);
        document.removeEventListener('shopify:cart:lines-update', shopifyCartAdded);
        triggers.forEach(trigger => trigger.kill());
        tweens.forEach(tween => tween.revert());
      };
    });
  }

  function animateCartFlight(source) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const button = source instanceof Element ? source.closest('button, [role="button"]') : null;
    const cart = document.querySelector('.ib-cart-link, .header-actions__cart-icon, [data-testid="cart-drawer-trigger"], a[href$="/cart"]');
    if (!button || !cart) return;
    const from = button.getBoundingClientRect(), to = cart.getBoundingClientRect();
    if (!from.width || !to.width) return;
    const product = button.closest('.ib-product-card, .ib-product-layout, isblue-product');
    const image = product?.querySelector('[data-media-id]:not([hidden]) img, .ib-product-image img, img');
    const flyer = image?.cloneNode() || document.createElement('span');
    flyer.className = 'ib-cart-flyer';
    Object.assign(flyer.style, {
      left: `${from.left + from.width / 2 - 24}px`, top: `${from.top + from.height / 2 - 24}px`,
      width: '48px', height: '48px',
    });
    document.body.append(flyer);
    gsap.fromTo(flyer, { x: 0, y: 0, scale: 0.65, opacity: 0.95 }, {
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
      scale: 0.12, rotation: 7, opacity: 0.3, duration: 0.68, ease: 'power3.inOut',
      onComplete: () => flyer.remove(),
    });
  }

  function animateCartSuccess(source) {
    const button = source instanceof Element ? source.closest('button, [role="button"]') : null;
    const cart = document.querySelector('.ib-cart-link, [data-testid="cart-drawer-trigger"], a[href$="/cart"]');
    if (button) {
      button.classList.add('ib-cart-success');
      gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(button, { scale: 0.96, duration: 0.1, ease: 'power2.in' })
        .to(button, { scale: 1.035, duration: 0.22, ease: 'back.out(2.4)' })
        .to(button, { scale: 1, duration: 0.2, ease: 'power2.out', clearProps: 'scale', onComplete: () => button.classList.remove('ib-cart-success') });
    }
    if (!cart) return;
    gsap.timeline({ defaults: { overwrite: 'auto' } })
      .to(cart, { scale: 1.2, duration: 0.18, ease: 'back.out(3)' })
      .to(cart, { scale: 1, duration: 0.24, ease: 'power2.out', clearProps: 'scale' });
  }
  mount();
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const rebuild = () => { clearTimeout(rebuildTimer); rebuildTimer = setTimeout(mount, 100); };
  document.addEventListener('shopify:section:load', rebuild);
  document.addEventListener('shopify:section:unload', rebuild);
  document.addEventListener('shopify:section:reorder', rebuild);
  window.addEventListener('pagehide', () => { clearTimeout(rebuildTimer); media?.revert(); });
  window.addEventListener('pageshow', event => { if (event.persisted) mount(); });
})();
