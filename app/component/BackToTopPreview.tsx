export default function BackToTopPreview({ settings }: { settings: any }) {
    const positionStyle =
      settings.position === "bottom-left"
        ? { left: 20, bottom: 20 }
        : { right: 20, bottom: 20 };
  
    return (
      <div
        style={{
          position: "relative",
          height: "250px",
          border: "1px dashed #ccc",
          borderRadius: 8,
          background: "#fafafa",
          overflow: "hidden",
          opacity: settings?.enabled ? 1 : 0.4, // fade if disabled
        }}
      >
          <div style={{ padding: 16, color: "#999" }}>
          <p>Store page preview...</p>
          <p>Store page preview...</p>
          <p>Store page preview...</p>
        </div>
  
        {!settings?.enabled && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              fontSize: 14,
              zIndex: 1,
            }}
          >
            Preview (Disabled)
          </div>
        )}
  
        <div
          style={{
            position: "absolute",
            ...positionStyle,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: settings.color || "#000",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            fontSize: 20,
          }}
        >
          ↑
        </div>
      </div>
    );
  }
  