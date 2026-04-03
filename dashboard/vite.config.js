import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api/prometheus': {
        target: 'http://localhost:9090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prometheus/, ''),
      },
      '/api/zsa-rpc': {
        target: 'http://localhost:18232',
        changeOrigin: true,
        rewrite: () => '/',
      },
      '/api/crosslink-rpc': {
        target: 'http://localhost:18242',
        changeOrigin: true,
        rewrite: () => '/',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
