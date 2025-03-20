import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  ssr: {
    noExternal: ['isbot']
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  optimizeDeps: {
    exclude: ['@remix-run/dev', 'react-compiler-runtime'],
    esbuildOptions: {
      define: {
        'globalThis.__REACT_COMPILER_RUNTIME__': 'true'
      }
    }
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true
      },
    }),
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            runtimeModule: 'react-compiler-runtime'
          }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '~': '/app',
      'react-compiler-runtime': 'react-compiler-runtime/dist/index.js'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
