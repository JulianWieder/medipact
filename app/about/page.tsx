import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/app/components/templates/MarketingPageTemplate";
import { aboutPageContent } from "@/app/content/aboutPage";

export const metadata: Metadata = {
  title: "Über medipact – KI-Mediation mit klarem Ergebnisfokus",
  description:
    "Medipact steht für strukturierte Mediation bei privaten Konflikten. Wir helfen Menschen, festgefahrene Situationen zu klären – vertraulich und lösungsorientiert.",
  alternates: { canonical: "https://medipact.de/about" },
};

const videoAside = (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      aspectRatio: "1920/1080",
    }}
    className="overflow-hidden rounded-[2rem] border border-slate-200 app-surface"
  >
    <iframe
      src="https://share.synthesia.io/embeds/videos/ecc6e794-b1df-4c8e-85ca-f137b90c3f2f"
      loading="lazy"
      title="Synthesia video player - Frieden durch Mediation: Der Weg zur Einigung"
      allowFullScreen
      allow="encrypted-media; fullscreen; microphone; screen-wake-lock;"
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        border: "none",
        padding: 0,
        margin: 0,
        overflow: "hidden",
      }}
    />
  </div>
);

export default function AboutPage() {
  return <MarketingPageTemplate {...aboutPageContent} heroAside={videoAside} />;
}
