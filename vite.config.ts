import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['app/**/*.test.{ts,tsx}']
  },
  ssr: {
    noExternal: ['isbot', 'zod', 'superjson']
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
    include: [
      'uuid', 
      'lz-string', 
      'zod', 
      'superjson', 
      'framer-motion'
    ],
    esbuildOptions: {
      define: {
        'globalThis.__REACT_COMPILER_RUNTIME__': 'false'
      }
    }
  },
  resolve: {
    alias: {
      '~': '/app',
      'react-compiler-runtime': false
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
    react()
  ],
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
