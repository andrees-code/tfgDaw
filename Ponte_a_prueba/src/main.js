import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { userStore } from '@/stores/userStores'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

// 🔹 Cargar sesión antes de montar la app
userStore.loadSession()

app.mount('#app')
