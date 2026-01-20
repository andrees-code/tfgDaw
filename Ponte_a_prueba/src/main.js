import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import router from './router'
import { userStore } from '@/stores/userStores'

import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
// ✅ Importar CSS al final puede ayudar ligeramente en algunos bundlers
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Activar Analytics
inject()

// 🚀 OPTIMIZACIÓN CRÍTICA:
// Montamos la app PRIMERO para que el usuario vea la interfaz inmediatamente.
// La sesión se carga después/paralelamente.
app.mount('#app')

// ✅ Cargar sesión después de montar
// Si loadSession es muy lenta, no bloqueará la aparición inicial de la web.
try {
    userStore.loadSession()
} catch (e) {
    console.error("Error cargando sesión:", e)
}