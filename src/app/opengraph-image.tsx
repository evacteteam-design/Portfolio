import { ImageResponse } from "next/og";

export const alt = "Akhil Vanga - Enterprise UX and AI-first product design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 72,
        background: "linear-gradient(135deg, #0B1929, #0C3A5E)",
        color: "#F6FAFF",
      }}>
        <div style={{ display: "flex", fontSize: 32 }}>Akhil Vanga</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 76, fontWeight: 700 }}>Enterprise UX.</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: "#79c5ff" }}>Powered by AI.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}>
          <span>Senior UX &amp; Product Designer</span>
          <span>akhilvanga.com</span>
        </div>
      </div>
    ),
    size,
  );
}
