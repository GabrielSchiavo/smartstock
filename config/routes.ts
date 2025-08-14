/**
* This file defines the routes used in the application.
* It includes constants for public routes, authentication routes,
* and other application-specific routes.
*/
export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const METADATA_ROUTES = {
  OG_IMAGE: `${BASE_URL}/assets/images/og/og.png`,
  MANIFEST: `${BASE_URL}/manifest.webmanifest`,
  SITEMAP: `${BASE_URL}/sitemap.xml`,
} as const;

export const ROUTES = {
  HOME: "/",

  // Auth Routes:
  AUTH_API: "/api/auth",
  AUTH_LOGIN: "/auth/login",
  AUTH_RESET_PASSWORD: "/auth/reset",
  AUTH_NEW_PASSWORD: "/auth/new-password",
  AUTH_NEW_VERIFICATION: "/auth/new-verification",
  AUTH_ERROR: "/auth/error",

  // Email Routes:
  EMAIL_NEW_VERIFICATION: "/auth/new-verification?token=",
  EMAIL_NEW_PASSWORD: "/auth/new-password?token=",

  // Pages Routes:
  PAGE_DASHBOARD: "/dashboard",
  PAGE_REPORTS: "/reports",
  PAGE_SETTINGS: "/settings",
  PAGE_STOCKS_FOOD: "/stocks/food",
  PAGE_USERS: "/users",
} as const;

/**
* An array of routes that are accessible to the public
* These routes do not require authentication
* @type {string[]}
*/
export const publicRoutes: string[] = [
    ROUTES.HOME,
    ROUTES.AUTH_NEW_VERIFICATION,
];

/**
* An array of routes that are used for authentication
* These routes will redirect logged in users to /dashboard
* @type {string[]}
*/
export const authRoutes: string[] = [
    ROUTES.AUTH_LOGIN,
    ROUTES.AUTH_ERROR,
    ROUTES.AUTH_RESET_PASSWORD,
    ROUTES.AUTH_NEW_PASSWORD,
];

/**
* The prefix for API authentication routes
* Routes that start with this prefix are used for API authentication purposes
* @type {string[]}
*/
export const apiAuthPrefix = ROUTES.AUTH_API;

/**
* The default redirect path after logging in 
* @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = ROUTES.PAGE_DASHBOARD;

/**
* An object mapping page paths to their titles
* @type {Record<string, string>}
*/
export const pageTitles: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.PAGE_DASHBOARD]: "Dashboard",
  [ROUTES.PAGE_REPORTS]: "Relatórios",
  [ROUTES.PAGE_SETTINGS]: "Configurações",
  [ROUTES.PAGE_STOCKS_FOOD]: "Estoque de Alimentos",
  [ROUTES.PAGE_USERS]: "Gerenciar Usuários",
};