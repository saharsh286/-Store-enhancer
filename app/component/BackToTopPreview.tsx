import "./BackToTopPreview.css";

export default function BackToTopPreview({ settings }: { settings: any }) {
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
      {/* Fake content */}
      <div className="btt-fake-content">
        <p>Store page preview...</p>
        <p>Store page preview...</p>
        <p>Store page preview...</p>
      </div>

      {/* Disabled overlay */}
      {!settings?.enabled && (
        <div className="btt-disabled-overlay">
          Preview (Disabled)
        </div>
      )}

      {/* Back To Top Button */}
      <div
        className={`btt-button ${positionClass}`}
        style={{ backgroundColor: settings.color || "#000" }}
      >
        ↑
      </div>
    </div>
  );
}