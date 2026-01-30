// Scroll reveal for illustrations using IntersectionObserver
// Fades in illustrations as they enter the viewport
// Respects prefers-reduced-motion (consistent with Phase 20)
(function() {
  // Bail out for reduced-motion users — CSS handles visibility
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var illustrations = document.querySelectorAll('.illustration');
  if (!illustrations.length) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  illustrations.forEach(function(el) {
    observer.observe(el);
  });
})();
