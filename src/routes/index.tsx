import { createFileRoute } from "@tanstack/react-router";
import ScanVogueLanding from "../ScanVogueLanding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScanVogue — Mai multe recenzii Google, mai puține surprize proaste" },
      {
        name: "description",
        content:
          "Un QR pe masă: clienții mulțumiți ajung pe Google, cei nemulțumiți îți scriu ție. Panou de manager cu analiză AI, teme recurente și rapoarte lunare.",
      },
      { property: "og:title", content: "ScanVogue — Sistemul de recenzii pentru restaurante" },
      {
        property: "og:description",
        content:
          "Demo funcțional: pagina clientului și panoul de manager. Bazat pe studii reale despre impactul recenziilor asupra încasărilor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanVogueLanding,
});
