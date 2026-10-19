/**
 * HES Accessible Toast Notification Component
 * WCAG 2.2 AA compliant, keyboard reachable, screen-reader friendly, reduced-motion safe.
 * Positioned on desktop & mobile to avoid overlapping the bottom Journey navigation pill.
 */
(function () {
  'use strict';

  var container = null;
  var AUTO_DISMISS_DELAY = 5000;

  function getOrCreateContainer() {
    if (!container || !document.body.contains(container)) {
      container = document.createElement('div');
      container.id = 'hes-toast-container';
      container.className = 'hes-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      container.setAttribute('aria-relevant', 'additions text');
      document.body.appendChild(container);
    }
    return container;
  }

  function show(type, message) {
    var host = getOrCreateContainer();
    var toast = document.createElement('div');
    var isError = type === 'error';

    toast.className = 'hes-toast hes-toast--' + (type || 'info');
    toast.setAttribute('role', isError ? 'alert' : 'status');
    toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
    toast.setAttribute('tabindex', '0');

    var iconMap = {
      success: '<svg class="hes-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
      error: '<svg class="hes-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      info: '<svg class="hes-toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    var iconSvg = iconMap[type] || iconMap.info;

    toast.innerHTML = [
      iconSvg,
      '<div class="hes-toast__body">',
      '  <span class="hes-toast__msg">' + escapeHtml(message) + '</span>',
      '</div>',
      '<button type="button" class="hes-toast__dismiss" aria-label="Dismiss notification">&times;</button>'
    ].join('');

    var closeBtn = toast.querySelector('.hes-toast__dismiss');
    var timer = null;

    function removeToast() {
      if (timer) clearTimeout(timer);
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      } else {
        toast.classList.add('hes-toast--exit');
        toast.addEventListener('animationend', function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, { once: true });
        // Fallback removal
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 350);
      }
    }

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      removeToast();
    });

    toast.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        removeToast();
      }
    });

    // Pause auto-dismiss on hover / focus
    toast.addEventListener('mouseenter', function () {
      if (timer) clearTimeout(timer);
    });
    toast.addEventListener('mouseleave', function () {
      timer = setTimeout(removeToast, AUTO_DISMISS_DELAY);
    });
    toast.addEventListener('focusin', function () {
      if (timer) clearTimeout(timer);
    });
    toast.addEventListener('focusout', function () {
      timer = setTimeout(removeToast, AUTO_DISMISS_DELAY);
    });

    host.appendChild(toast);
    timer = setTimeout(removeToast, AUTO_DISMISS_DELAY);

    return { dismiss: removeToast };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.HESToast = {
    show: show,
    success: function (msg) { return show('success', msg); },
    error: function (msg) { return show('error', msg); },
    info: function (msg) { return show('info', msg); }
  };
})();
