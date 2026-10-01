// An offer is visible only while its configured deadline is in the future
// and the selected variant has a genuine compare-at discount.
const two = value => String(value).padStart(2, '0');

export function updatePromotionTimers(scope = document) {
  scope.querySelectorAll('[data-promotion-timer]').forEach(timer => {
    const deadline = Date.parse(timer.dataset.promotionEnd || '');
    const remaining = deadline - Date.now();
    const active = timer.dataset.promotionSale === 'true' && Number.isFinite(deadline) && remaining > 0;
    timer.hidden = !active;
    if (!active) return;
    const seconds = Math.floor(remaining / 1000);
    timer.querySelector('[data-days]').textContent = two(Math.floor(seconds / 86400));
    timer.querySelector('[data-hours]').textContent = two(Math.floor(seconds / 3600) % 24);
    timer.querySelector('[data-minutes]').textContent = two(Math.floor(seconds / 60) % 60);
    timer.querySelector('[data-seconds]').textContent = two(seconds % 60);
  });
}

updatePromotionTimers();
setInterval(updatePromotionTimers, 1000);
document.addEventListener('shopify:section:load', event => updatePromotionTimers(event.target));
