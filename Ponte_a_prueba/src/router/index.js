import HomeView from '@/views/HomeView.vue'
import Contacto from '@/views/ContactoView.vue'
import Perfil from '@/views/PerfilView.vue'
import Ajustes from '@/views/AjustesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '@/views/LoginRegister.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/**',
      component: HomeView,
    },
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/contacto',
      component: Contacto
    },
    {
      path: '/perfil',
      component: Perfil
    },
    {
      path: '/ajustes',
      component: Ajustes
    },
    {
      path: '/login',
      component: LoginRegister
    }
  ],
})

export default router
