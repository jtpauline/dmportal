import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    remix({
      // Add any Remix-specific configuration here if needed
      // For example:
      // appDirectory: "app",
      // assetsBuildDirectory: "public/build",
      // serverBuildPath: "build/index.js",
      // publicPath: "/build/",
    }),
    react()
  ]
})
