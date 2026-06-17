import type { MetadataRoute } from "next";

// Web App Manifest (PWA). Next menyajikan di /manifest.webmanifest.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Albirru Online — Academic Intelligence",
    short_name: "Albirru",
    description: "Persiapan UTBK/SNBT & CPNS berbasis AI: pahami kelemahanmu, raih kampus impian.",
    start_url: "/app",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2F5BFF",
    lang: "id",
    orientation: "portrait",
    categories: ["education"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
