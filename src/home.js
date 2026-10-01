// A short entrance establishes hierarchy without delaying shopping controls.
const homeMotion = new Map();
const reducedHomeMotion = matchMedia('(prefers-reduced-motion: reduce)');
function mountHome(scope = document) {
  scope.querySelectorAll('[data-home-reveal]').forEach(section => {
    if (homeMotion.has(section) || reducedHomeMotion.matches) return;
    const animations = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!reducedHomeMotion.matches) animations.push(entry.target.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'cubic-bezier(.32,.72,0,1)' }
        ));
      });
    }, { threshold: .08 });
    const targets = section.querySelectorAll('.solutions-hero-copy,.solutions-hero-board,.home-section-heading,.home-problem-card,.home-guide-copy,.home-faq-list');
    targets.forEach(target => observer.observe(target));
    homeMotion.set(section, () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); });
  });
}
mountHome();
document.addEventListener('shopify:section:load', event => mountHome(event.target));
document.addEventListener('shopify:section:unload', event => homeMotion.forEach((cleanup, section) => {
  if (event.target.contains(section)) { cleanup(); homeMotion.delete(section); }
}));
reducedHomeMotion.addEventListener('change', () => {
  homeMotion.forEach(cleanup => cleanup());
  homeMotion.clear();
  mountHome();
});
