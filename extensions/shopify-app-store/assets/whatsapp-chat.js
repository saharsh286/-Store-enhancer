(function () {

  console.log("WhatsApp Widget Loaded");

  const container = document.getElementById("whatsapp-chat-settings");
  if (!container) return;

  const raw = container.getAttribute("data-settings");
  if (!raw) return;

  let settings;

  try {
    settings = JSON.parse(raw);
  } catch (e) {
    console.error("Settings parse error", e);
    return;
  }

  if (!settings.enabled) return;

  const phone = settings.phone.replace(/[^0-9]/g, "");
  const defaultMessage =
    settings.defaultMessage || "Hi there 👋 How can I help you?";

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
          <strong>${settings.profileName || "Customer Support"}</strong>
          <span>${settings.profileSubtitle || "Typically replies within minutes."}</span>
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
      ${settings.buttonLabel || "Chat with us"}
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

  /* SMART DEVICE DETECTION */

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

})();