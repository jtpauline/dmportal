import { defineConfig } from 'vite';
import { remixVite } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  resolve: {
    alias: {
      '~/': '/app/',
      '~/components/': '/app/components/',
      '~/modules/': '/app/modules/'
    }
  },
  plugins: [
    remixVite(),
    tsconfigPaths()
  ]
})
