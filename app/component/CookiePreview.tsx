export default function CookiePreview({ settings }: { settings: any }) {
    const positionStyle =
      settings.position === "top"
        ? { top: 0 }
        : { bottom: 0 };
  
    return (
      <div
        style={{
          position: "relative",
          height: 250,
          border: "1px dashed #ccc",
          borderRadius: 8,
          background: "#fafafa",
          overflow: "hidden",
        }}
      >
        {/* Fake page */}
        <div style={{ padding: 16, color: "#999" }}>
          <p>Store page preview...</p>
          <p>Store page preview...</p>
          <p>Store page preview...</p>
        </div>
  
        {/* Cookie banner */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            ...positionStyle,
            background: settings.bgColor || "#000",
            color: settings.textColor || "#fff",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13 }}>
            {settings.message || "We use cookies to improve your experience."}
          </span>
  
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "none",
                background: settings.acceptColor || "#150F1A",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {settings.acceptText || "Accept"}
            </button>
            <button
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              border: "1px solid #999",
              background: "#fff",
              color: "#000",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Customize
          </button>
  
            <button
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #999",
                background: "#fff",
                color: "#000",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {settings.rejectText || "Reject"}
            </button>
          </div>
        </div>
      </div>
    );
  }
  