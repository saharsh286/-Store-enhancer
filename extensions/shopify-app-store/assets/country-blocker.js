document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("srt-country-blocker");
  if (!container) return;

  try {
    const rawSettings = container.dataset.settings;
    if (!rawSettings) return;

    const settings = JSON.parse(rawSettings);

    const visitorCountryRaw = container.dataset.country;
    if (!visitorCountryRaw) return;

    const visitorCountry = String(visitorCountryRaw)
      .trim()
      .toUpperCase();

    // Ensure countryCodes is always an array
    let countryList = [];

    if (Array.isArray(settings.countryCodes)) {
      countryList = settings.countryCodes;
    } else if (typeof settings.countryCodes === "string") {
      countryList = settings.countryCodes.split(",");
    }

    // Normalize country list
    const normalizedList = countryList
      .map(code => String(code).trim().toUpperCase())
      .filter(code => code.length === 2);

    const isListed = normalizedList.includes(visitorCountry);

    const shouldBlock =
      (settings.mode === "block" && isListed) ||
      (settings.mode === "whitelist" && !isListed);

    if (!shouldBlock) return;

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "srt-country-overlay";

    const messageBox = document.createElement("div");
    messageBox.className = "srt-country-message";
    messageBox.style.textAlign = settings.alignment || "center";

    messageBox.innerHTML =
      settings.message || "This store is not available in your country.";

    overlay.appendChild(messageBox);

    // Replace entire page safely
    document.body.innerHTML = "";
    document.body.appendChild(overlay);

  } catch (error) {
    console.error("Country Blocker Error:", error);
  }
});