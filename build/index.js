var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { jsxDEV } from "react/jsx-dev-runtime";
var ABORT_DELAY = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let callbackName = request.headers.get("X-Callback") ?? void 0;
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 21,
          columnNumber: 7
        },
        this
      ),
      {
        callbackName,
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  Layout: () => Layout,
  default: () => App,
  links: () => links
});
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/tailwind.css?url
var tailwind_default = "/build/_assets/tailwind-CLHEKIYJ.css?url";

// app/root.tsx
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var links = () => [
  { rel: "stylesheet", href: tailwind_default },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  // Add explicit preload configuration
  {
    rel: "preload",
    href: "/fetch.worker.5a421e5b.js",
    as: "script"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2("meta", { charSet: "utf-8" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 36,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 35,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { children: [
      children,
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 43,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 41,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 34,
    columnNumber: 5
  }, this);
}
function App() {
  return /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
    fileName: "app/root.tsx",
    lineNumber: 51,
    columnNumber: 10
  }, this);
}

// app/routes/campaigns/index.tsx
var campaigns_exports = {};
__export(campaigns_exports, {
  default: () => CampaignsIndex,
  meta: () => meta
});
import { Link } from "@remix-run/react";

// app/modules/campaigns.ts
var CampaignManager = class {
  // Removed user-specific filtering
  static getAllCampaigns() {
    return [
      {
        id: "1",
        name: "Sample Campaign",
        description: "An example campaign for demonstration",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
  }
  // Simplified campaign creation
  static createCampaign(campaignData) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...campaignData,
      createdAt: /* @__PURE__ */ new Date()
    };
  }
};

// app/components/CampaignList.tsx
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function CampaignList() {
  let campaigns = CampaignManager.getAllCampaigns();
  return /* @__PURE__ */ jsxDEV3("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: campaigns.map((campaign) => /* @__PURE__ */ jsxDEV3(
    "div",
    {
      className: "bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition",
      children: [
        /* @__PURE__ */ jsxDEV3("h2", { className: "text-xl font-bold mb-2", children: campaign.name }, void 0, !1, {
          fileName: "app/components/CampaignList.tsx",
          lineNumber: 13,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV3("p", { className: "text-gray-600", children: campaign.description }, void 0, !1, {
          fileName: "app/components/CampaignList.tsx",
          lineNumber: 14,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4 flex justify-between items-center", children: /* @__PURE__ */ jsxDEV3("span", { className: "text-sm text-gray-500", children: [
          "Created: ",
          campaign.createdAt.toLocaleDateString()
        ] }, void 0, !0, {
          fileName: "app/components/CampaignList.tsx",
          lineNumber: 16,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/components/CampaignList.tsx",
          lineNumber: 15,
          columnNumber: 11
        }, this)
      ]
    },
    campaign.id,
    !0,
    {
      fileName: "app/components/CampaignList.tsx",
      lineNumber: 9,
      columnNumber: 9
    },
    this
  )) }, void 0, !1, {
    fileName: "app/components/CampaignList.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}

// app/routes/campaigns/index.tsx
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
var meta = () => [
  { title: "Campaigns - DM Platform" },
  { name: "description", content: "Browse and manage your campaigns" }
];
function CampaignsIndex() {
  return /* @__PURE__ */ jsxDEV4("div", { className: "container mx-auto p-4", children: [
    /* @__PURE__ */ jsxDEV4("h1", { className: "text-2xl font-bold mb-4", children: "Your Campaigns" }, void 0, !1, {
      fileName: "app/routes/campaigns/index.tsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4(CampaignList, {}, void 0, !1, {
      fileName: "app/routes/campaigns/index.tsx",
      lineNumber: 16,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("div", { className: "mt-4", children: /* @__PURE__ */ jsxDEV4(
      Link,
      {
        to: "/campaigns/new",
        className: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
        children: "Create New Campaign"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/campaigns/index.tsx",
        lineNumber: 18,
        columnNumber: 9
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/campaigns/index.tsx",
      lineNumber: 17,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/campaigns/index.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta2
});
import { Link as Link2 } from "@remix-run/react";
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
var meta2 = () => [
  { title: "DM Platform - Home" },
  { name: "description", content: "Welcome to the DM Platform" }
];
function Index() {
  return /* @__PURE__ */ jsxDEV5("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: /* @__PURE__ */ jsxDEV5("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxDEV5("h1", { className: "text-4xl font-bold text-gray-800 mb-4", children: "Welcome to DM Platform" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 15,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV5("p", { className: "text-xl text-gray-600", children: "Your Adventure Management Tool" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 18,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV5("div", { className: "mt-6", children: /* @__PURE__ */ jsxDEV5(
      Link2,
      {
        to: "/campaigns",
        className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition",
        children: "View Campaigns"
      },
      void 0,
      !1,
      {
        fileName: "app/routes/_index.tsx",
        lineNumber: 22,
        columnNumber: 11
      },
      this
    ) }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 21,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 14,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 13,
    columnNumber: 5
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-KJS44F2K.js", imports: ["/build/_shared/chunk-O4BRYNJ4.js", "/build/_shared/chunk-GIDTMSWD.js", "/build/_shared/chunk-U4FRFQSK.js", "/build/_shared/chunk-XGOTYLZ5.js", "/build/_shared/chunk-U5E2PCIK.js", "/build/_shared/chunk-UWV35TSL.js", "/build/_shared/chunk-7M6SC7J5.js", "/build/_shared/chunk-PNG5AS42.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-FHSLZHXQ.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-Q35PQ4L7.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/campaigns": { id: "routes/campaigns", parentId: "root", path: "campaigns", index: void 0, caseSensitive: void 0, module: "/build/routes/campaigns-4NW2QQT7.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "191b1bde", hmr: { runtime: "/build/_shared/chunk-U5E2PCIK.js", timestamp: 1742573641805 }, url: "/build/manifest-191B1BDE.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !1, v3_relativeSplatPath: !1, v3_throwAbortReason: !1, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/campaigns": {
    id: "routes/campaigns",
    parentId: "root",
    path: "campaigns",
    index: void 0,
    caseSensitive: void 0,
    module: campaigns_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
