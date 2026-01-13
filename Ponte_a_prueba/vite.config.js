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
  server: {
    host: true, // 👈 importante
    port: 5173,
    hmr: {
      host: 'https://bakend-murex.vercel.app', // 👈 IP desde el navegador
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
