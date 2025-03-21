import { defineConfig } from 'vite';
import { remix } from '@remix-run/dev/vite';
import { installGlobals } from '@remix-run/node';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Install Remix globals
installGlobals();

export default defineConfig({
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  base: '/build/',
  
  plugins: [
    tsconfigPaths(),
    remix(),
    react()
  ],

  server: {
    port: 3001,  // Updated to match WebContainer's expected port
    strictPort: true,
    open: false,
    warmup: {
      clientFiles: ['./app/**/*.{ts,tsx}']
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', '@remix-run/react'],
    force: true
  }
});
