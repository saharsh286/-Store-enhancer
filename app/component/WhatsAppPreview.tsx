

import "./WhatsAppPreview.css";

export default function WhatsAppPreview({ settings }: { settings: any }) {
  const isEnabled = !!settings?.enabled;

  return (
    <div className={`wa-preview-wrapper ${isEnabled ? "" : "wa-disabled"}`}>

      {/* Chat Window */}
      <div className="wa-chat-container">

        {/* Header */}
        <div className="wa-header">
          <div className="wa-avatar">
            {settings.profileName?.charAt(0) || "C"}
            <span className="wa-online"></span>
          </div>

          <div className="wa-header-text">
            <div className="wa-name">
              {settings.profileName || "Customer Support"}
            </div>

            <div className="wa-subtitle">
              {settings.profileSubtitle || "Typically replies within minutes."}
            </div>
          </div>

          <div className="wa-close">×</div>
        </div>

        {/* Chat Body */}
        <div className="wa-body">
          <div className="wa-message">
            {settings.defaultMessage || "Hi there 👋 How can I help you?"}
          </div>
        </div>

        {/* Input */}
        <div className="wa-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value=""
            readOnly
          />

          <div className="wa-send">
            ➤
          </div>
        </div>

      </div>


      {/* Floating Buttons */}
      <div className="wa-floating-group">

        <div className="wa-floating-label">
          {settings.buttonLabel || "Chat with us"}
        </div>

        <div className="wa-floating-whatsapp">

          <span className="wa-red-dot"></span>

          <svg viewBox="0 0 32 32" width="22" height="22" fill="#fff">
            <path d="M19.11 17.24c-.27-.13-1.59-.78-1.83-.87-.25-.09-.43-.13-.61.13-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.34.98 2.64 1.11 2.82.14.18 1.92 2.93 4.65 4.1.65.28 1.16.44 1.56.56.66.21 1.26.18 1.73.11.53-.08 1.59-.65 1.81-1.28.22-.63.22-1.17.16-1.28-.07-.11-.25-.18-.52-.31z"/>
          </svg>

        </div>

        <div className="wa-floating-close">
          ×
        </div>

      </div>

      {!isEnabled && (
        <div className="wa-disabled-overlay">
          Preview Disabled
        </div>
      )}

    </div>
  );
}