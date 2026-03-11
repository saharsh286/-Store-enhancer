import "./BackToTopPreview.css";
import type { BackToTopSettingsData } from "../types/widgetTypes";
export default function BackToTopPreview({
  settings,
}: {
  settings: BackToTopSettingsData;
}) {
  const positionClass =
    settings.position === "bottom-left"
      ? "btt-left"
      : "btt-right";

  return (
    <div
      className={`btt-preview-wrapper ${
        settings?.enabled ? "" : "btt-disabled"
      }`}
    >
      <div className="btt-fake-content">
        <p>Store page preview...</p>
        <p>Store page preview...</p>
        <p>Store page preview...</p>
      </div>

      {!settings?.enabled && (
        <div className="btt-disabled-overlay">
          Preview (Disabled)
        </div>
      )}

      <div
        className={`btt-button ${positionClass}`}
        style={{ backgroundColor: settings.color || "#000" }}
      >
        ↑
      </div>
    </div>
  );
}