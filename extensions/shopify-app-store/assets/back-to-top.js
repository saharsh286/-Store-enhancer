(function () {

  function initBackToTop() {

    // Remove existing buttons (avoid duplicates)
    document.querySelectorAll(".srt-back-to-top").forEach(el => el.remove());

    const settingsElement = document.getElementById("back-to-top-settings");
    if (!settingsElement) return;

    let settings = {};

    try {
      settings = JSON.parse(settingsElement.dataset.settings || "{}");
    } catch (error) {
      console.error("Back To Top settings parse error:", error);
      return;
    }

    if (!settings.enabled) return;

    const visibility = (settings.visibility || "optional").toLowerCase();
    if (visibility === "hidden") return;

    // Create button
    const button = document.createElement("div");
    button.className = "srt-back-to-top";
    button.innerHTML = "↑";

    // Position
    const position = (settings.position || "bottom-right").toLowerCase();
    if (position.includes("left")) {
      button.classList.add("left");
    } else {
      button.classList.add("right");
    }

    // Color
    button.style.background = settings.color || "#000";
    button.style.color = "#fff";

    document.body.appendChild(button);

    // Scroll visibility handler
    function handleVisibility() {
      if (visibility === "required") {
        button.classList.add("show");
        return;
      }

      if (visibility === "optional") {
        if (window.scrollY > 200) {
          button.classList.add("show");
        } else {
          button.classList.remove("show");
        }
      }
    }

    // Run once initially
    handleVisibility();

    // Listen to scroll
    window.addEventListener("scroll", handleVisibility);

    // Click behavior
    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackToTop);
  } else {
    initBackToTop();
  }

})();