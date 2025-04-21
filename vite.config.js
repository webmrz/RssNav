import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api/baidu': {
        target: 'https://suggestion.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/baidu/, ''),
        headers: {
          Referer: 'https://www.baidu.com/'
        }
      },
      '/api/bing': {
        target: 'https://api.bing.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bing/, ''),
        headers: {
          Referer: 'https://www.bing.com/',
          Origin: 'https://www.bing.com'
        }
      },
      '/api/google': {
        target: 'https://suggestqueries.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google/, ''),
        headers: {
          Referer: 'https://www.google.com/',
          Origin: 'https://www.google.com'
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'public/background.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        format: 'es'
      },
    }
  }
}); 