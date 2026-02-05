console.log("🚀 Store Enhancer Loader started");

(function () {
  const backToTop = window.__BACK_TO_TOP_SETTINGS__;
  const cookie = window.__COOKIE_CONSENT_SETTINGS__;

  console.log("📦 Loader got BackToTop:", backToTop);
  console.log("📦 Loader got Cookie:", cookie);

  function loadScript(file) {
    const script = document.createElement("script");
    script.src = `/cdn/shop/t/0/assets/${file}`;
    script.defer = true;
    document.head.appendChild(script);
    console.log("✅ Loaded:", file);
  }

  if (backToTop && backToTop.enabled) {
    loadScript("back-to-top.js");
  }

  if (cookie && cookie.enabled) {
    loadScript("cookie-consent.js");
  }
})();
