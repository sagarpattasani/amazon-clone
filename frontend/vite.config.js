import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    // ── Production Optimizations ──
    target: 'es2020',
    sourcemap: false,
    // ── Chunk Splitting for better caching ──
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/zustand') || id.includes('node_modules/axios')) {
            return 'vendor-state';
          }
          if (id.includes('node_modules/react-icons') || id.includes('node_modules/react-hot-toast')) {
            return 'vendor-ui';
          }
        },
      },
    },
    // ── Asset optimization ──
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  }
})
