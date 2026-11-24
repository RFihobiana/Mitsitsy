import { ImageResponse } from "next/og";

export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ size: string }> },
) {
  const { size } = await ctx.params;
  const px = size === "512" ? 512 : 192;
  const s = px / 180;
  const bar = (h: number, o: number) => (
    <div
      style={{
        width: 26 * s,
        height: h * s,
        borderRadius: 6 * s,
        background: "#34d399",
        opacity: o,
      }}
    />
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 14 * s,
        paddingBottom: 38 * s,
        background: "#0a0a0a",
      }}
    >
      {bar(40, 0.5)}
      {bar(68, 0.75)}
      {bar(102, 1)}
    </div>,
    { width: px, height: px },
  );
}
