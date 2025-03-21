import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { remixVite } from '@remix-run/dev/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    remixVite()
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
    strictPort: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app')
    }
  }
});
