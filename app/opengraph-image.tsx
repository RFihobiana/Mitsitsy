import { ImageResponse } from "next/og";

export const alt = "Mitsitsy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0a0a0a", color: "#f5f5f5" }}>
        <div style={{ fontSize: 96, fontWeight: 700 }}>Mitsitsy</div>
        <div style={{ fontSize: 40, color: "#34d399", marginTop: 16 }}>Épargnez votre salaire d’abord.</div>
      </div>
    ),
    size
  );
}
