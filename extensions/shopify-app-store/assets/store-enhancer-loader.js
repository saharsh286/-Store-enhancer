(function () {

  function loadScript(file) {
    const script = document.createElement("script");
    script.src = `/cdn/shop/t/0/assets/${file}`;
    script.defer = true;
    document.head.appendChild(script);
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* BACK TO TOP */

    const backToTopElement = document.getElementById("back-to-top-settings");

    if (backToTopElement) {
      try {
        const settings = JSON.parse(backToTopElement.dataset.settings || "{}");

        if (settings.enabled) {
          loadScript("back-to-top.js");
        }
      } catch (e) {
        console.error("Back To Top settings error", e);
      }
    }

    /* COOKIE CONSENT */

    const cookieElement = document.getElementById("cookie-consent-settings");

    if (cookieElement) {
      try {
        const settings = JSON.parse(cookieElement.dataset.settings || "{}");

        if (settings.enabled) {
          loadScript("cookie-consent.js");
        }
      } catch (e) {
        console.error("Cookie settings error", e);
      }
    }

  });

})();