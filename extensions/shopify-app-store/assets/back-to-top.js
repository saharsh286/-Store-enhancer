(function () {

  if (window.__SRT_BACK_TO_TOP_INITIALIZED__) return;
  window.__SRT_BACK_TO_TOP_INITIALIZED__ = true;

  document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(
      ".srt-back-to-top"
    ).forEach(el => el.remove());

    const settingsElement = document.getElementById("back-to-top-settings");
    if (!settingsElement) return;

    const settings = JSON.parse(settingsElement.dataset.settings || "{}");
    console.log("SETTINGS:", settings);

    if (!settings.enabled) return;

    // 🔹 VISIBILITY VALUE
    const visibility = (settings.visibility || "")
      .toString()
      .toLowerCase()
      .trim();

    console.log("VISIBILITY:", visibility);

    // 🔴 If hidden → stop everything
    if (visibility.includes("hidden")) {
      return;
    }

    // 🔹 Create button
    const button = document.createElement("div");
    button.className = "srt-back-to-top";
    button.innerHTML = "↑";

    // 🔹 Position
    const pos = (settings.position || "")
      .toString()
      .toLowerCase()
      .trim();

    if (pos.includes("left")) {
      button.classList.add("left");
    } else {
      button.classList.add("right");
    }

    // 🔹 Color
    button.style.background = settings.color || "#000";
    button.style.color = "#fff";

    document.body.appendChild(button);

    // 🟢 REQUIRED → always visible
    if (visibility.includes("required")) {
      button.classList.add("show");
    }

    // 🟡 OPTIONAL → show on scroll
    if (visibility.includes("optional")) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
          button.classList.add("show");
        } else {
          button.classList.remove("show");
        }
      });
    }

    // 🔹 Click scroll
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  });

})();