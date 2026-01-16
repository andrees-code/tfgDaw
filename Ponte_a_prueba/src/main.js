import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from '@/stores/userStores'
import { inject } from '@vercel/analytics'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

// 🔹 Activar Vercel Analytics
inject()

// 🔹 Cargar sesión antes de montar la app
userStore.loadSession()

app.mount('#app')
