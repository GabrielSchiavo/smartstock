import { siteConfig } from "@/config/site";
import { BASE_URL, ROUTES } from "@/config/routes";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    lang: "pt-br",
    dir: "auto",
    name: siteConfig.name,
    short_name: siteConfig.shortNamePwa,
    description: siteConfig.description,
    background_color: siteConfig.color,
    theme_color: siteConfig.color,
    id: "smartstock-web-pwa",
    start_url: `${BASE_URL}${ROUTES.HOME}`,
    scope: `${BASE_URL}`,
    categories: ["business"],
    display: "standalone",
    orientation: "any",
    display_override: ["window-controls-overlay", "minimal-ui"],

    icons: [
      {
        src: "assets/images/favicons/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "assets/images/favicons/maskable-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/images/favicons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "assets/images/screenshots/doc/dashboard.png",
        sizes: "1907x907",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "assets/images/screenshots/doc/dashboard-mobile.png",
        sizes: "368x820",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    shortcuts: [
      {
        name: "Login",
        url: `${BASE_URL}${ROUTES.AUTH_LOGIN}`,
        icons: [
          {
            src: "assets/images/shortcuts/login.png",
            sizes: "96x96"
          },
        ],
      },
      {
        name: "Dashboard",
        url: `${BASE_URL}${ROUTES.PAGE_DASHBOARD}`,
        icons: [
          {
            src: "assets/images/shortcuts/dashboard.png",
            sizes: "96x96"
          },
        ],
      },
    ],
  };
}
