/* ===========================
   Cookie Consent + Google Analytics (GA4)
   =========================== */

const GA_MEASUREMENT_ID = 'G-H70S4NSV2Y';

(function () {
  const STORAGE_KEY = 'cookie_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // Google Consent Mode v2: denegado por defecto hasta que el usuario decida.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function readConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage no disponible (modo privado, etc.) — el banner volverá a aparecer */
    }
  }

  function loadAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf('XXXX') !== -1) {
      console.warn('Google Analytics: configura GA_MEASUREMENT_ID en js/cookie-consent.js antes de usar en producción.');
      return;
    }
    gtag('consent', 'update', { analytics_storage: 'granted' });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const settingsTriggers = document.querySelectorAll('[data-cookie-settings]');

    function showBanner() {
      if (banner) banner.hidden = false;
    }

    function hideBanner() {
      if (banner) banner.hidden = true;
    }

    const stored = readConsent();
    if (stored === 'granted') {
      loadAnalytics();
    } else if (stored !== 'denied') {
      showBanner();
    }

    acceptBtn?.addEventListener('click', () => {
      writeConsent('granted');
      hideBanner();
      loadAnalytics();
    });

    rejectBtn?.addEventListener('click', () => {
      writeConsent('denied');
      gtag('consent', 'update', { analytics_storage: 'denied' });
      hideBanner();
    });

    settingsTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        showBanner();
      });
    });
  });
})();
