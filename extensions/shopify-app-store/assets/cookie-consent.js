document.addEventListener("DOMContentLoaded", function () {
  if (window.__SRT_COOKIE_INITIALIZED__) return;
  window.__SRT_COOKIE_INITIALIZED__ = true;

  console.log("🍪 COOKIE JS STARTED");

  const settingsElement = document.getElementById("cookie-consent-settings");

  if (!settingsElement) {
    console.log("Settings element not found");
    return;
  }

  const settings = JSON.parse(settingsElement.dataset.settings || "{}");

  if (!settings.enabled) {
    console.log("Banner disabled");
    return;
  }
  // ✅ CHECK IF USER ALREADY GAVE CONSENT
  const existingChoice = localStorage.getItem("srt_cookie_choice");

  if (
    existingChoice === "accepted" ||
    existingChoice === "rejected" ||
    existingChoice === "customized"
  ) {
    console.log("Consent already given:", existingChoice);
    return; // 🚀 STOP banner from showing again
  }

  /* Dynamic Style Injection */
  const style = document.createElement("style");
  style.innerHTML = `
    .srt-cookie-banner {
      background: ${settings.color};
    }
  `;
  document.head.appendChild(style);

  /* Create Banner */
  const banner = document.createElement("div");
  banner.className = `srt-cookie-banner ${settings.position === "top" ? "top" : "bottom"}`;
  // color change //
  banner.style.background = settings.color || "#111";

  banner.innerHTML = `
    <div class="srt-cookie-container">
      <div class="srt-cookie-text">
        ${settings.message}
      </div>

      <div class="srt-cookie-actions">
        <button class="srt-cookie-accept">
          ${settings.acceptText}
        </button>

        <button class="srt-cookie-reject">
          ${settings.rejectText}
        </button>

        <button class="srt-cookie-customize">
          Customize
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  banner.querySelector(".srt-cookie-accept").addEventListener("click", () => {
    localStorage.setItem("srt_cookie_choice", "accepted");
    banner.remove();
  });

  banner.querySelector(".srt-cookie-reject").addEventListener("click", () => {
    localStorage.setItem("srt_cookie_choice", "rejected");
    banner.remove();
  });
  banner
    .querySelector(".srt-cookie-customize")
    .addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.className = "srt-cookie-overlay";

      overlay.innerHTML = `
      <div class="srt-cookie-modal">
        <h3>Cookie Preferences</h3>
  
        <div class="srt-cookie-option">
          <span>Necessary Cookies</span>
          <input type="checkbox" checked disabled />
        </div>
  
        <div class="srt-cookie-option">
          <span>Analytics Cookies</span>
          <input type="checkbox" id="analytics-toggle" />
        </div>
  
        <div class="srt-cookie-option">
          <span>Marketing Cookies</span>
          <input type="checkbox" id="marketing-toggle" />
        </div>
  
        <button class="srt-cookie-save">Save Preferences</button>
      </div>
    `;

      document.body.appendChild(overlay);

      overlay
        .querySelector(".srt-cookie-save")
        .addEventListener("click", () => {
          const analytics = overlay.querySelector("#analytics-toggle").checked;
          const marketing = overlay.querySelector("#marketing-toggle").checked;

          const preferences = {
            necessary: true,
            analytics,
            marketing,
          };

          localStorage.setItem(
            "srt_cookie_preferences",
            JSON.stringify(preferences),
          );
          localStorage.setItem("srt_cookie_choice", "customized");

          overlay.remove();
          banner.remove();
        });

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    });
});
