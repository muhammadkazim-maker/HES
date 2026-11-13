/**
 * ==========================================================================
 * SHARED SCROLL REVEAL & HERO UTILITIES
 * Hadi Education System (HES)
 * Page load/transition animations disabled for immediate static hero rendering.
 * Scroll-triggered reveal animations below the fold remain active.
 * ==========================================================================
 */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.remove('gw-active', 'gw-subsequent');

  var overlay = document.getElementById('gwOverlay');
  if (overlay && overlay.parentNode) {
    overlay.remove();
  }

  var isGatewayDone = true;
  window.isGatewayDone = true;

  function dispatchGatewayEvent(name) {
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
  // HERO RENDERING: IMMEDIATELY VISIBLE IN STATIC STATE
  // --------------------------------------------------------------------------
  function setupHeroEntrance() {
    var heroElem = document.querySelector('.hero-content, .cl-hero-text');
    if (heroElem) {
      heroElem.classList.add('hero-stagger-active');
    }
    var visual = document.querySelector('.cl-hero-visual');
    if (visual) visual.classList.add('is-visible');
    var fadeElems = document.querySelectorAll('.cl-fade-elem');
    fadeElems.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --------------------------------------------------------------------------
  // SHARED SCROLL REVEAL UTILITY (IntersectionObserver)
  // Preserves below-the-fold scroll animations
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
      dispatchGatewayEvent('gateway:done');
    });
  } else {
    setupHeroEntrance();
    setupScrollReveal();
    dispatchGatewayEvent('gateway:done');
  }
})();
