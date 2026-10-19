/**
 * HES Analytics Wrapper
 * Cookieless, privacy-preserving event tracking.
 * Supported providers: 'plausible' | 'umami' | 'none'
 *
 * Why no cookie banner is needed:
 * Plausible and Umami are strictly cookieless, do not collect PII (Personally
 * Identifiable Information), do not track users across websites, and fully comply
 * with GDPR, PECR, and CCPA out of the box without requiring user consent banners.
 */
(function () {
  'use strict';

  var provider = (window.ANALYTICS_PROVIDER || 'none').toLowerCase();
  var siteId = window.ANALYTICS_SITE_ID || '';
  var customUrl = window.ANALYTICS_URL || '';

  // Initialize Provider Script
  if (provider === 'plausible' && siteId) {
    var pScript = document.createElement('script');
    pScript.defer = true;
    pScript.setAttribute('data-domain', siteId);
    pScript.src = customUrl || 'https://plausible.io/js/script.js';
    document.head.appendChild(pScript);
  } else if (provider === 'umami' && siteId) {
    var uScript = document.createElement('script');
    uScript.defer = true;
    uScript.setAttribute('data-website-id', siteId);
    uScript.src = customUrl || 'https://analytics.umami.is/script.js';
    document.head.appendChild(uScript);
  }

  /**
   * Universal Event Tracker
   * @param {string} eventName - e.g., 'inquiry_submit', 'admission_cta_click'
   * @param {Object} [props] - Optional safe metadata (no PII allowed)
   */
  function track(eventName, props) {
    try {
      if (!eventName) return;
      var safeProps = props || {};

      // Filter out any accidental PII keys
      delete safeProps.email;
      delete safeProps.phone;
      delete safeProps.name;
      delete safeProps.message;

      if (provider === 'plausible' && window.plausible) {
        window.plausible(eventName, { props: safeProps });
      } else if (provider === 'umami' && window.umami && typeof window.umami.track === 'function') {
        window.umami.track(eventName, safeProps);
      } else if (provider === 'console' || window.location.hostname === 'localhost') {
        // Safe development logger
        // console.log('[HES Analytics]', eventName, safeProps);
      }
    } catch (e) {
      // Analytics must never break frontend execution
    }
  }

  window.HESAnalytics = {
    track: track
  };

  // Automated DOM Event Delegation
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Data-attribute CTA and button clicks
    document.addEventListener('click', function (e) {
      var target = e.target.closest('[data-track-event]');
      if (!target) return;
      var ev = target.getAttribute('data-track-event');
      var label = target.getAttribute('data-track-label') || target.textContent.trim().slice(0, 40);
      track(ev, { label: label, page: window.location.pathname });
    });

    // 2. Direct Telephone Clicks
    document.addEventListener('click', function (e) {
      var telLink = e.target.closest('a[href^="tel:"]');
      if (telLink && !telLink.hasAttribute('data-track-event')) {
        track('phone_click', {
          destination: telLink.getAttribute('href'),
          page: window.location.pathname
        });
      }
    });

    // 3. Direct WhatsApp Clicks
    document.addEventListener('click', function (e) {
      var waLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"]');
      if (waLink && !waLink.hasAttribute('data-track-event')) {
        track('whatsapp_click', {
          destination: 'WhatsApp Admissions Desk',
          page: window.location.pathname
        });
      }
    });
  });
})();
