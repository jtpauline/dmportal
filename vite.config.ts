import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix(),
    react(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "~": "/app"
    }
  },
  build: {
    rollupOptions: {
      input: '/app/root.tsx' // Ensure this is the correct entry point
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@remix-run/react',
      '@remix-run/dev',
      '@vitejs/plugin-react',
      'vite-tsconfig-paths'
    ] // Add any other dependencies you want to pre-bundle
  }
});
