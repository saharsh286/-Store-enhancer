import "./CookiePreview.css";
import type { CookieBoxSettingsProps } from "../types/widgetTypes";

type Props = {
  settings: CookieBoxSettingsProps;
};

export default function CookiePreview({ settings }: Props) {
  const positionClass =
    settings.position === "top"
      ? "cookie-top"
      : "cookie-bottom";

  return (
    <div
      className={`cookie-preview-wrapper ${
        settings?.enabled ? "" : "cookie-disabled"
      }`}
    >
      <div className="cookie-fake-content">
        <p>Store page preview...</p>
        <p>Store page preview...</p>
        <p>Store page preview...</p>
      </div>

      {!settings?.enabled && (
        <div className="cookie-disabled-overlay">
          Preview (Disabled)
        </div>
      )}

      <div
        className={`cookie-banner ${positionClass}`}
        style={{ backgroundColor: settings.color || "#000" }}
      >
        <span className="cookie-message">
          {settings.message || "We use cookies to improve your experience."}
        </span>

        <div className="cookie-buttons">
          <button
            className="cookie-accept"
            style={{ backgroundColor: settings.acceptColor || "#150F1A" }}
          >
            {settings.acceptText || "Accept"}
          </button>

          <button className="cookie-customize">
            Customize
          </button>

          <button className="cookie-reject">
            {settings.rejectText || "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}