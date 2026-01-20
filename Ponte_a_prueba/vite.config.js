import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ✅ OPTIMIZACIÓN DE BUILD
  build: {
    // Aumentamos el límite de aviso para que no moleste por librerías grandes
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Estrategia de división de código (Code Splitting)
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. Separar PDF.js (es muy pesado y no se usa en la home)
            if (id.includes('pdfjs-dist')) {
              return 'pdfjs-worker';
            }
            // 2. Separar el núcleo de Vue (se cachea mejor porque cambia poco)
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vue-vendor';
            }
            // 3. El resto de librerías van a un archivo vendor general
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      host: '', 
      protocol: 'ws',
      port: 5173,
    },
    proxy: {
      '/api-brave': {
        target: 'https://api.search.brave.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-brave/, ''),
        secure: true,
      },
      '/api': {
        target: 'https://bakend-murex.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})