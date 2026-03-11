(function () {

  function initWhatsAppWidget() {

    console.log("WhatsApp Widget Loaded");

    const container = document.getElementById("whatsapp-chat-settings");
    if (!container) {
      console.log("WhatsApp settings container not found");
      return;
    }

    const raw = container.dataset.settings;
    if (!raw) {
      console.log("WhatsApp settings empty");
      return;
    }

    let settings;

    try {
      settings = JSON.parse(raw);
    } catch (e) {
      console.error("Settings parse error", e);
      return;
    }

    console.log("Widget Settings:", settings);

    if (!settings.enabled) return;

    /* CLEAN SETTINGS */

    const phone = (settings.phone || "").replace(/[^0-9]/g, "");

    const profileName =
      settings.profileName && settings.profileName.trim()
        ? settings.profileName.trim()
        : "Customer Support";

    const profileSubtitle =
      settings.profileSubtitle && settings.profileSubtitle.trim()
        ? settings.profileSubtitle.trim()
        : "Typically replies within minutes.";

    const buttonLabel =
      settings.buttonLabel && settings.buttonLabel.trim()
        ? settings.buttonLabel.trim()
        : "Chat with us";

    const defaultMessage =
      settings.defaultMessage && settings.defaultMessage.trim()
        ? settings.defaultMessage.trim()
        : "Hi there 👋 How can I help you?";

    /* PREVENT DUPLICATE WIDGET */

    if (document.querySelector(".wa-widget")) {
      console.log("Widget already exists");
      return;
    }

    /* CREATE WIDGET */

    const widget = document.createElement("div");
    widget.className = "wa-widget";

    widget.innerHTML = `

    <div class="wa-chat-box">

      <div class="wa-header">

        <div class="wa-profile">

          <div class="wa-avatar">
            <span class="wa-online"></span>
          </div>

          <div class="wa-profile-text">
            <strong>${profileName}</strong>
            <span>${profileSubtitle}</span>
          </div>

        </div>

        <button class="wa-close-top">✕</button>

      </div>

      <div class="wa-body">

        <div class="wa-message">
          ${defaultMessage}
        </div>

      </div>

      <div class="wa-input-area">

        <input class="wa-input" placeholder="Type a message..." />

        <button class="wa-send">➤</button>

      </div>

    </div>


    <div class="wa-buttons">

      <button class="wa-label">
        ${buttonLabel}
      </button>

      <button class="wa-toggle">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png">
        <span class="wa-notification"></span>
      </button>

      <button class="wa-close-round">✕</button>

    </div>

    `;

    document.body.appendChild(widget);

    /* ELEMENTS */

    const chat = widget.querySelector(".wa-chat-box");
    const toggle = widget.querySelector(".wa-toggle");
    const closeRound = widget.querySelector(".wa-close-round");
    const closeTop = widget.querySelector(".wa-close-top");
    const send = widget.querySelector(".wa-send");
    const input = widget.querySelector(".wa-input");

    /* OPEN CHAT */

    function openChat() {
      chat.classList.add("wa-show");
      widget.classList.add("chat-open");
    }

    /* CLOSE CHAT */

    function closeChat() {
      chat.classList.remove("wa-show");
      widget.classList.remove("chat-open");
    }

    toggle.onclick = openChat;
    closeRound.onclick = closeChat;
    closeTop.onclick = closeChat;

    /* DEVICE DETECTION */

    function isMobile() {
      return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );
    }

    /* SEND MESSAGE */

    send.onclick = () => {

      const text = encodeURIComponent(input.value || defaultMessage);

      let url;

      if (isMobile()) {
        url = `https://wa.me/${phone}?text=${text}`;
      } else {
        url = `https://web.whatsapp.com/send?phone=${phone}&text=${text}`;
      }

      window.open(url, "_blank");

    };

  }

  /* WAIT FOR DOM */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWhatsAppWidget);
  } else {
    initWhatsAppWidget();
  }

})();