(function () {
  console.log("🍪 Advanced Cookie Consent loaded");

  const DEFAULT_CONSENT = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  };

  function getSavedConsent() {
    try {
      return JSON.parse(localStorage.getItem("cookie_consent"));
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    localStorage.setItem("cookie_consent", JSON.stringify(consent));
  }

  function applyConsent(consent) {
    console.log("🍪 Applying consent:", consent);

    if (consent.analytics) loadGoogleAnalytics();
    if (consent.marketing) loadFacebookPixel();
  }

  // ================= SCRIPT LOADERS =================

  function loadGoogleAnalytics() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;

    const s = document.createElement("script");
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXX";
    s.async = true;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-XXXX");

    console.log("✅ Google Analytics loaded");
  }

  function loadFacebookPixel() {
    if (window.__fbLoaded) return;
    window.__fbLoaded = true;

    const s = document.createElement("script");
    s.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'XXXX');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(s);

    console.log("Facebook Pixel loaded");
  }

  // ================= INIT =================

  const settings = window.__COOKIE_CONSENT_SETTINGS__ || { enabled: true };

  if (!settings.enabled) return;

  const savedConsent = getSavedConsent();
  if (savedConsent) {
    applyConsent(savedConsent);
    return;
  }

  // ================= UI =================

  const banner = document.createElement("div");
  banner.id = "cookie-consent-banner";
  banner.style = `
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    max-width: 1100px;
    width: calc(100% - 40px);
    background: ${settings.color || "#111"};
    color: #fff;
    padding: 16px 20px;
    border-radius: 12px;
    z-index: 999999;
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 10px 30px rgba(0,0,0,0.25);
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;
  `;

  const text = document.createElement("div");
  text.innerText =
    settings.message ||
    "We use cookies to improve your experience and analyze traffic.";
  text.style.fontSize = "14px";
  text.style.flex = "1";

  const buttons = document.createElement("div");
  buttons.style.display = "flex";
  buttons.style.gap = "10px";

  const rejectBtn = document.createElement("button");
  rejectBtn.innerText = "Reject all";
  styleSecondaryButton(rejectBtn);

  const acceptBtn = document.createElement("button");
  acceptBtn.innerText = "Accept all";
  stylePrimaryButton(acceptBtn);

  const customizeBtn = document.createElement("button");
  customizeBtn.innerText = "Customize";
  styleSecondaryButton(customizeBtn);

  buttons.append(rejectBtn, customizeBtn, acceptBtn);
  banner.append(text, buttons);
  document.body.appendChild(banner);

  // ================= MODAL =================

  const modal = document.createElement("div");
  modal.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000000;
    display: none;
    align-items: center;
    justify-content: center;
  `;

  const modalBox = document.createElement("div");
  modalBox.style = `
    background: #fff;
    color: #000;
    width: 100%;
    max-width: 500px;
    border-radius: 14px;
    padding: 20px;
    font-family: inherit;
  `;

  modalBox.innerHTML = `
    <h3 style="margin-top:0">Cookie Preferences</h3>
    <label><input type="checkbox" disabled checked> Necessary (always on)</label><br><br>
    <label><input id="cc-analytics" type="checkbox"> Analytics</label><br><br>
    <label><input id="cc-marketing" type="checkbox"> Marketing</label><br><br>
    <label><input id="cc-preferences" type="checkbox"> Preferences</label><br><br>
    <button id="cc-save">Save preferences</button>
  `;

  modal.appendChild(modalBox);
  document.body.appendChild(modal);

  // ================= BUTTON LOGIC =================

  acceptBtn.onclick = function () {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(consent);
    applyConsent(consent);
    banner.remove();
  };

  rejectBtn.onclick = function () {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveConsent(consent);
    applyConsent(consent);
    banner.remove();
  };

  customizeBtn.onclick = function () {
    modal.style.display = "flex";
  };

  document.getElementById("cc-save").onclick = function () {
    const consent = {
      necessary: true,
      analytics: document.getElementById("cc-analytics").checked,
      marketing: document.getElementById("cc-marketing").checked,
      preferences: document.getElementById("cc-preferences").checked,
    };

    saveConsent(consent);
    applyConsent(consent);
    modal.style.display = "none";
    banner.remove();
  };

  // ================= STYLES =================

  function stylePrimaryButton(btn) {
    btn.style = `
      background:#fff;
      color:#000;
      border:none;
      padding:9px 16px;
      border-radius:8px;
      cursor:pointer;
      font-weight:600;
    `;
  }

  function styleSecondaryButton(btn) {
    btn.style = `
      background:transparent;
      color:#fff;
      border:1px solid rgba(255,255,255,0.5);
      padding:8px 14px;
      border-radius:8px;
      cursor:pointer;
    `;
  }
})();
