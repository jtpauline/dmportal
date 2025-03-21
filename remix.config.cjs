/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_throwDevErrors: true
  },
  routes(defineRoutes) {
    return defineRoutes(route => {
      route("/", "routes/_index.tsx");
      route("campaigns", "routes/campaigns.tsx", () => {
        route("index", "routes/campaigns/index.tsx");
        route(":campaignId", "routes/campaigns/$campaignId.tsx", () => {
          route("overview", "routes/campaigns/$campaignId/overview.tsx");
          route("characters", "routes/campaigns/$campaignId/characters.tsx");
          route("encounters", "routes/campaigns/$campaignId/encounters.tsx");
        });
      });
    });
  },
};
