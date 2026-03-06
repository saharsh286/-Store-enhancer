import "./WidgetCard.css";

export default function WidgetCard({
  title,
  description,
  enabled,
  link,
}: any) {
  return (
    <div className="srt-widget-card">
      <div className="srt-widget-header">
        <h3>{title}</h3>

        <span className={`srt-badge ${enabled ? "active" : "inactive"}`}>
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <p>{description}</p>

      <a href={link} className="srt-config-btn">
        Configure
      </a>
    </div>
  );
}