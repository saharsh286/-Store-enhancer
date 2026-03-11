import type { StickyAddToCartSettingsData } from "../types/widgetTypes";

type Props = {
  settings: StickyAddToCartSettingsData;
};

export default function StickyAddToCartPreview({ settings }: Props) {
  if (!settings.enabled) {
    return (
      <div className="preview-disabled">
        Preview (Disabled)
      </div>
    );
  }

  return (
    <div
      className="sticky-preview"
      style={{
        background: settings.backgroundColor
      }}
    >
      <span>Sample Product</span>

      <button
        style={{
          background: settings.buttonColor
        }}
      >
        {settings.buttonText}
      </button>
    </div>
  );
}