/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  serverModuleFormat: "esm",
  ignoredRouteFiles: [".*"],
  postcss: true,
  
  // Ensure dynamic routes are properly configured
  routes(defineRoutes) {
    return defineRoutes(route => {
      route("campaigns", "routes/campaigns/index.tsx", { index: true });
      route("campaigns/new", "routes/campaigns/new.tsx");
      route("campaigns/:campaignId", "routes/campaigns/$campaignId/index.tsx");
      route("campaigns/:campaignId/characters", "routes/campaigns/$campaignId/characters/index.tsx", { index: true });
      route("campaigns/:campaignId/encounters", "routes/campaigns/$campaignId/encounters/index.tsx", { index: true });
      route("campaigns/:campaignId/spells", "routes/campaigns/$campaignId/spells/index.tsx", { index: true });
      route("campaigns/:campaignId/analytics", "routes/campaigns/$campaignId/analytics/index.tsx", { index: true });
    });
  },
  
  // Future flags configuration
  future: {
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true
  },
  
  // Ensure clean build
  clean: true
};
