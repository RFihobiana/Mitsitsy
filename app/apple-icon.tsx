import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const bar = (height: number, opacity: number) => (
  <div style={{ width: 26, height, borderRadius: 6, background: "#34d399", opacity }} />
);

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 14,
          paddingBottom: 38,
          background: "#0a0a0a",
        }}
      >
        {bar(40, 0.5)}
        {bar(68, 0.75)}
        {bar(102, 1)}
      </div>
    ),
    size
  );
}
