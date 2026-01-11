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
      host: '192.168.0.14', // 👈 IP desde el navegador
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
        target: 'http://192.168.0.14:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
