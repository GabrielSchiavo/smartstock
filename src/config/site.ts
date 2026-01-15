import { BASE_URL, METADATA_ROUTES } from "@/config/routes";

export const META_THEME_COLORS = {
  light: "#fafafa",
  dark: "#18181b",
};

export const siteConfig = {
  color: "#ffffff",
  name: "SmartStock: Gestão de Estoque",
  shortName: "SmartStock",
  shortNamePwa: "SmartStock",
  url: BASE_URL,
  ogImage: METADATA_ROUTES.OG_IMAGE,
  description:
    "SmartStock, o melhor sistema de gestão de estoque.",
  links: {
    facebook: "",
    instagram: "",
  },
  manifest: METADATA_ROUTES.MANIFEST,
  sitemap: METADATA_ROUTES.SITEMAP,
};

export type SiteConfig = typeof siteConfig;
