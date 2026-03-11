import "./CountryBlockerPreview.css";
import type { CountryBlockerSettingsData } from "../types/widgetTypes";

type Props = {
  settings: CountryBlockerSettingsData;
};

export default function CountryBlockerPreview({ settings }: Props) {
  const isEnabled = settings.enabled;

  return (
    <div className={`srt-country-preview-wrapper ${isEnabled ? "enabled" : "disabled"}`}>
      {isEnabled ? (
        <div className="srt-country-preview-card">
          <h2>Access Restricted</h2>
          <p>
            {settings.message || "Sorry, your country is restricted."}
          </p>
          <button>Close</button>
        </div>
      ) : (
        <div className="srt-country-disabled">
          Country Blocker is Disabled
        </div>
      )}
    </div>
  );
}