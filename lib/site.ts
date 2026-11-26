const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

const rawUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? fromVercel ?? "http://localhost:3000";

export const siteConfig = {
  url: rawUrl.replace(/\/+$/, ""),
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Mitsitsy",
  googleVerification: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  tutorialVideoUrl:
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+(\?.*)?$/.test(
      process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_URL?.trim() ?? "",
    )
      ? process.env.NEXT_PUBLIC_TUTORIAL_VIDEO_URL!.trim()
      : undefined,
};
