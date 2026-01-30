(function() {
  // Loading state: hide poster once video is ready for seeking
  function hidePoster() {
    const poster = document.querySelector('.hero-bg-poster');
    if (poster) {
      poster.style.display = 'none';
    }
  }

  // Set up poster hiding (runs for all users, including reduced-motion)
  const videoForPoster = document.getElementById('scroll-video');
  if (videoForPoster) {
    videoForPoster.addEventListener('canplaythrough', hidePoster, { once: true });

    // Fallback timeout for Safari iOS edge case
    setTimeout(function() {
      if (videoForPoster.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        hidePoster();
      }
    }, 3000);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    const vid = document.getElementById('scroll-video');
    if (vid) {
      vid.removeAttribute('src');
      vid.load();
    }
    return;
  }

  const video = document.getElementById('scroll-video');
  if (!video) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const scrollHint = document.querySelector('.scroll-hint');

  let ticking = false;

  function updateVideoTime() {
    const rect = hero.getBoundingClientRect();
    const scrollable = hero.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollable));

    if (video.duration && isFinite(video.duration)) {
      video.currentTime = progress * video.duration;
    }

    if (scrollHint) {
      if (progress > 0.2) {
        scrollHint.style.opacity = '0';
      } else {
        scrollHint.style.removeProperty('opacity');
      }
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      updateVideoTime();
      ticking = false;
    });
  }

  video.addEventListener('loadedmetadata', updateVideoTime);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function() {
        updateVideoTime();
        ticking = false;
      });
    }
  }, { passive: true });
})();
