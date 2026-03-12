import type { StickyAddToCartSettingsData } from "../types/widgetTypes";
import "./StickyAddToCartPreview.css";

type Props = {
  settings: StickyAddToCartSettingsData;
};

export default function StickyAddToCartPreview({ settings }: Props) {
  const positionClass =
    settings.position === "top" ? "sticky-top" : "sticky-bottom";

  if (!settings.enabled) {
    return (
      <div className="sticky-preview-wrapper sticky-disabled">
        <div className="sticky-fake-content">
          <p>Store page preview...</p>
        </div>

        <div className="sticky-disabled-overlay">
          Preview (Disabled)
        </div>
      </div>
    );
  }

  return (
    <div className="sticky-preview-wrapper">
      <div className="sticky-fake-content">
        <p>Store page preview...</p>
      </div>

      <div
        className={`sticky-bar ${positionClass}`}
        style={{ background: settings.backgroundColor }}
      >
        <div className="sticky-product-info">
          <div className="sticky-product-img"></div>

          <div>
            <div className="sticky-title">Sample Product</div>
            <div className="sticky-price">$29.99</div>
          </div>
        </div>

        <button
          className="sticky-button"
          style={{ background: settings.buttonColor }}
        >
          {settings.buttonText}
        </button>
      </div>
    </div>
  );
}