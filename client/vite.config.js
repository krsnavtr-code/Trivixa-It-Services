

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      // Only use the new JSX transform
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    splitVendorChunkPlugin(),
  ],

  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd'],
  },

  // 🔵 DEV ONLY
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4002',
        changeOrigin: true
      }
    }
  },

  // 🟢 BUILD (Production)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor modules into separate chunks
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
          form: ['react-hook-form', 'react-quill'],
          utils: ['lodash', 'date-fns', 'dayjs'],
          i18n: ['i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          // Keep other dependencies in separate chunks
          vendor: [
            'axios',
            'react-hot-toast',
            'react-slick',
            'slick-carousel',
            'react-player',
            'react-markdown',
            'react-beautiful-dnd',
            'framer-motion',
            '@ant-design/compatible'
          ],
        },
      },
    },
  },

  preview: {
    port: 4173
  }
}));
