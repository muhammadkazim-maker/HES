/**
 * ==========================================================================
 * SHARED PAGE GATEWAY INTRO SYSTEM
 * Hadi Education System (HES)
 * ==========================================================================
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var variant = (root.getAttribute('data-gateway') || 'home').toLowerCase();
  var isHome = variant === 'home';

  var isGatewayDone = false;

  // Snappy timing configuration (total sequence: 900-1100ms on first visit)
  var GATEWAY_CONFIG = {
    home: {
      label: 'HADI EDUCATION SYSTEM',
      isHome: true,
      exitStart: 720
    },
    about: {
      label: 'ABOUT US',
      exitStart: 620,
      innerSvg: '<path class="gw-draw-item" style="--gw-stagger:0ms" pathLength="1" d="M120 176 C102 162 76 160 56 168 V226 C76 218 102 220 120 234 Z" /><path class="gw-draw-item" style="--gw-stagger:40ms" pathLength="1" d="M120 176 C138 162 164 160 184 168 V226 C164 218 138 220 120 234 Z" />'
    },
    admission: {
      label: 'ADMISSION',
      exitStart: 620,
      innerSvg: '<path class="gw-draw-item" style="--gw-stagger:0ms" pathLength="1" d="M90 280 V192 A30 30 0 0 1 150 192 V280" /><path class="gw-draw-item" style="--gw-stagger:40ms" pathLength="1" d="M150 280 L128 272 V198 L150 192" /><path class="gw-draw-item" style="--gw-stagger:80ms" pathLength="1" d="M76 280 H164" /><path class="gw-draw-item" style="--gw-stagger:120ms" pathLength="1" d="M66 292 H174" />'
    },
    academics: {
      label: 'ACADEMICS',
      exitStart: 620,
      innerSvg: '<path class="gw-draw-item" style="--gw-stagger:0ms" pathLength="1" d="M 120 110 C 114 132, 94 158, 88 180 C 82 198, 96 210, 102 220 C 107 228, 98 238, 94 246 H 146 C 142 238, 133 228, 138 220 C 144 210, 158 198, 152 180 C 146 158, 126 132, 120 110 Z" /><path class="gw-draw-item" style="--gw-stagger:40ms" pathLength="1" d="M 120 110 V 182" /><path class="gw-draw-item" style="--gw-stagger:80ms" pathLength="1" d="M 120 182 A 5.5 5.5 0 1 1 119.99 182 Z" /><path class="gw-draw-item" style="--gw-stagger:120ms; stroke-opacity: 0.50;" pathLength="1" d="M 115 142 C 106 160, 97 174, 97 186 C 97 198, 107 208, 107 224" /><path class="gw-draw-item" style="--gw-stagger:120ms; stroke-opacity: 0.50;" pathLength="1" d="M 125 142 C 134 160, 143 174, 143 186 C 143 198, 133 208, 133 224" /><path class="gw-draw-item" style="--gw-stagger:160ms" pathLength="1" d="M 82 254 H 158" /><path class="gw-draw-item" style="--gw-stagger:160ms; stroke-opacity: 0.50;" pathLength="1" d="M 88 262 H 152" />'
    },
    contact: {
      label: 'CONTACT',
      exitStart: 620,
      innerSvg: '<path class="gw-draw-item" style="--gw-stagger:0ms" pathLength="1" d="M 154.4 205.1 v 12.6 a 8.4 8.4 0 0 1 -9.2 8.4 83.1 83.1 0 0 1 -36.2 -12.9 81.9 81.9 0 0 1 -25.2 -25.2 83.1 83.1 0 0 1 -12.9 -36.4 A 8.4 8.4 0 0 1 79.3 142.4 h 12.6 a 8.4 8.4 0 0 1 8.4 7.2 53.9 53.9 0 0 0 2.9 11.8 8.4 8.4 0 0 1 -1.9 8.9 L 96.0 175.6 a 67.2 67.2 0 0 0 25.2 25.2 l 5.3 -5.3 a 8.4 8.4 0 0 1 8.9 -1.9 53.9 53.9 0 0 0 11.8 2.9 A 8.4 8.4 0 0 1 154.4 205.1 z" /><path class="gw-draw-item" style="--gw-stagger:40ms; stroke-opacity: 0.85;" pathLength="1" d="M 120.8 159.2 a 23.1 23.1 0 0 1 21.0 21.0" /><path class="gw-draw-item" style="--gw-stagger:80ms; stroke-opacity: 0.55;" pathLength="1" d="M 120.8 142.4 a 39.9 39.9 0 0 1 37.8 37.8" /><path class="gw-draw-item" style="--gw-stagger:120ms; stroke-opacity: 0.25;" pathLength="1" d="M 120.8 125.6 a 56.7 56.7 0 0 1 54.6 54.6" />'
    },
    campus: {
      label: 'CAMPUS LIFE',
      exitStart: 620,
      innerSvg: '<path class="gw-draw-item" style="--gw-stagger:0ms; stroke-opacity: 0.60;" pathLength="1" d="M 60 280 V 150 A 60 60 0 0 1 180 150 V 280" /><path class="gw-draw-item" style="--gw-stagger:40ms; stroke-opacity: 0.85;" pathLength="1" d="M 85 280 V 185 A 35 35 0 0 1 155 185 V 280" /><path class="gw-draw-item" style="--gw-stagger:80ms; stroke-opacity: 0.45;" pathLength="1" d="M 102 280 V 215 A 18 18 0 0 1 138 215 V 280" /><path class="gw-draw-item" style="--gw-stagger:120ms; stroke-opacity: 0.85;" pathLength="1" d="M 98 280 L 111 220 M 142 280 L 129 220" /><path class="gw-draw-item" style="--gw-stagger:160ms; stroke-opacity: 0.40;" pathLength="1" d="M 101 268 H 139 M 105 252 H 135 M 108 238 H 132" /><path class="gw-draw-item" style="--gw-stagger:200ms; stroke-opacity: 0.75;" pathLength="1" d="M 112 220 A 8 8 0 0 1 128 220" />'
    }
  };

  function dispatchGatewayEvent(name) {
    if (name === 'gateway:done') {
      isGatewayDone = true;
      window.isGatewayDone = true;
    }
    try {
      var event = new CustomEvent(name, { bubbles: true, cancelable: true });
      document.dispatchEvent(event);
      window.dispatchEvent(event);
    } catch (e) {
      var evt = document.createEvent('Event');
      evt.initEvent(name, true, true);
      document.dispatchEvent(evt);
    }
  }

  // --------------------------------------------------------------------------
  // HERO ENTRANCE ON EVERY PAGE (Starts on "gateway:done")
  // --------------------------------------------------------------------------
  function setupHeroEntrance() {
    var heroElem = document.querySelector('.hero-content, .cl-hero-text');
    if (!heroElem) return;

    // Direct hero elements to stagger
    var items = heroElem.querySelectorAll(
      '.section-tag, .cl-hero-tag, .hero-badge, .hero-logo-wrapper, .hero-logo-wrap, .hero-title, .cl-hero-title, .hero-subtitle, .cl-hero-desc, .hero-actions, .cl-hero-actions'
    );

    if (items.length > 0) {
      items.forEach(function (item) {
        item.classList.add('hero-stagger-item');
      });
    }

    function triggerHero() {
      heroElem.classList.add('hero-stagger-active');
      var visual = document.querySelector('.cl-hero-visual');
      if (visual) visual.classList.add('is-visible');
      var fadeElems = heroElem.querySelectorAll('.cl-fade-elem');
      fadeElems.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    if (isGatewayDone) {
      triggerHero();
    } else {
      document.addEventListener('gateway:done', triggerHero, { once: true });
    }
  }

  // --------------------------------------------------------------------------
  // SHARED SCROLL REVEAL UTILITY (IntersectionObserver)
  // --------------------------------------------------------------------------
  function setupScrollReveal() {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');

    if (reduced) {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed', 'is-visible');
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed', 'is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('is-revealed', 'is-visible');
      });
    }
  }

  // Bind hero and reveal on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setupHeroEntrance();
      setupScrollReveal();
    });
  } else {
    setupHeroEntrance();
    setupScrollReveal();
  }

  // --------------------------------------------------------------------------
  // GATEWAY PLAYBACK CONTROLLER
  // --------------------------------------------------------------------------
  var isActive = root.classList.contains('gw-active');

  // If gateway is NOT active, dispatch "gateway:done" so hero entrance immediately starts
  if (!isActive) {
    var fireDone = function () {
      dispatchGatewayEvent('gateway:done');
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fireDone);
    } else {
      setTimeout(fireDone, 0);
    }
    return;
  }

  // If gateway IS active, run the intro sequence
  function runGateway() {
    var overlay = document.getElementById('gwOverlay');
    if (!overlay) {
      root.classList.remove('gw-active');
      dispatchGatewayEvent('gateway:done');
      return;
    }

    // Instant dismiss for users preferring reduced motion (WCAG 2.2 AA)
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
      root.classList.remove('gw-active');
      try { sessionStorage.setItem('hes-gateway-seen', 'true'); } catch (e) {}
      dispatchGatewayEvent('gateway:done');
      return;
    }

    // Lite performance mode: fast 200ms fade
    if (root.getAttribute('data-perf') === 'lite' || root.classList.contains('gw-subsequent')) {
      overlay.classList.add('gw-exit', 'gw-skip-exit');
      setTimeout(function () {
        finishGateway(false);
      }, 200);
      return;
    }

    var config = GATEWAY_CONFIG[variant] || GATEWAY_CONFIG.home;

    // Populate inner SVG and label if not already present
    var innerGroup = overlay.querySelector('.gw-inner-drawing');
    if (innerGroup && config.innerSvg && !innerGroup.innerHTML.trim()) {
      innerGroup.innerHTML = config.innerSvg;
    }
    var labelEl = overlay.querySelector('.gw-label');
    if (labelEl && config.label && !labelEl.textContent.trim()) {
      labelEl.textContent = config.label;
    }

    var isDone = false;
    var exitStarted = false;
    var exitTimer = null;
    var doneTimer = null;

    // Hard safety net cap: end by 1.8s so page is never blocked
    var safetyTimer = setTimeout(function () {
      finishGateway(true);
    }, 1800);

    function startExit(isFast) {
      if (exitStarted) return;
      exitStarted = true;
      dispatchGatewayEvent('gateway:exit');

      if (isFast) {
        overlay.classList.add('gw-exit', 'gw-skip-exit');
        doneTimer = setTimeout(function () {
          finishGateway(false);
        }, 140);
      } else {
        overlay.classList.add('gw-exit');
        doneTimer = setTimeout(function () {
          finishGateway(false);
        }, 250);
      }
    }

    function finishGateway(immediate) {
      if (isDone) return;
      isDone = true;

      try {
        sessionStorage.setItem('hes-gateway-seen', 'true');
      } catch (e) {}

      clearTimeout(safetyTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);

      cleanupListeners();

      if (overlay && overlay.parentNode) {
        overlay.remove();
      }
      root.classList.remove('gw-active');
      dispatchGatewayEvent('gateway:done');
    }

    function onSkip(e) {
      if (e) {
        if (e.target && e.target.closest && e.target.closest('a')) return;
        e.preventDefault();
        e.stopPropagation();
      }
      startExit(true);
    }

    // Scheduled natural exit
    exitTimer = setTimeout(function () {
      startExit(false);
    }, config.exitStart);

    // Skip bindings: button click, overlay tap, keypress (Esc/Space/Enter), wheel, or touchmove
    var skipBtn = overlay.querySelector('.gw-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', onSkip);
    }
    overlay.addEventListener('click', onSkip);

    var scrollActive = false;
    var scrollGraceTimer = setTimeout(function () {
      scrollActive = true;
    }, 400);

    function onKey(e) {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
        e.preventDefault();
        startExit(true);
      }
    }

    function onWheel(e) {
      if (!scrollActive) return;
      if (Math.abs(e.deltaY || 0) > 15) {
        startExit(true);
      }
    }

    function onTouchMove() {
      if (!scrollActive) return;
      startExit(true);
    }

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    function cleanupListeners() {
      clearTimeout(scrollGraceTimer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
    }

    // bfcache restore handler
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        finishGateway(true);
      }
    }, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGateway);
  } else {
    runGateway();
  }
})();
