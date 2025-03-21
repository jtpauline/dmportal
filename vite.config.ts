import { defineConfig } from 'vite';
import remix from '@remix-run/dev/vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix(),
    react(),
    tsconfigPaths()
  ],
  server: {
    port: 3000,
    strictPort: true
  }
});
