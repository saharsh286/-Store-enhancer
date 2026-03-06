import "./StickyAddToCartPreview.css";

export default function StickyAddToCartPreview({
  settings,
}: {
  settings: any;
}) {
  const positionClass =
    settings.position === "top"
      ? "sticky-top"
      : "sticky-bottom";

  return (
    <div
      className={`sticky-preview-wrapper ${
        settings?.enabled ? "" : "sticky-disabled"
      }`}
    >
      <div className="sticky-fake-content">
        <p>Product page preview...</p>
        <p>Product page preview...</p>
        <p>Product page preview...</p>
      </div>

      {!settings?.enabled && (
        <div className="sticky-disabled-overlay">
          Preview (Disabled)
        </div>
      )}

      <div
        className={`sticky-bar ${positionClass}`}
        style={{ backgroundColor: settings.backgroundColor || "#111" }}
      >
        <div className="sticky-product-info">
          <div className="sticky-product-img" />
          <div>
            <div className="sticky-title">Sample Product</div>
            <div className="sticky-price">$49.00</div>
          </div>
        </div>

        <button
          className="sticky-button"
          style={{ backgroundColor: settings.buttonColor || "#ff6600" }}
        >
          {settings.buttonText || "Add to Cart"}
        </button>
      </div>
    </div>
  );
}