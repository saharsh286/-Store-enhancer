import "./WhatsAppPreview.css";
import type { WhatsappChatSettingsData } from "../types/widgetTypes";

type Props = {
  settings: WhatsappChatSettingsData;
};

export default function WhatsAppPreview({ settings }: Props) {
  const isEnabled = settings.enabled;

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

          <div className="wa-send">➤</div>
        </div>
      </div>

      {/* Floating Buttons */}
      <div className="wa-floating-group">
        <div className="wa-floating-label">
          {settings.buttonLabel || "Chat with us"}
        </div>

        <div className="wa-floating-close">×</div>
      </div>

      {!isEnabled && (
        <div className="wa-disabled-overlay">Preview Disabled</div>
      )}
    </div>
  );
}