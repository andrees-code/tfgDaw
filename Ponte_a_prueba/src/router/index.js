import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import Contacto from '@/views/ContactoView.vue'
import Perfil from '@/views/PerfilView.vue'
import Ajustes from '@/views/AjustesView.vue'
import LoginRegister from '@/views/LoginRegister.vue'
import BibliotecaView from '@/views/BibliotecaView.vue'
import ExamenView from '@/views/ExamenView.vue'
import Estudio from '@/views/ZonaEstudioView.vue'
import PaypalView from '@/views/PaypalView.vue'
import ErrorView from '@/views/ErrorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🔓 PÚBLICAS
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/contacto',
      component: Contacto,
    },
    {
      path: '/login',
      component: LoginRegister,
    },

    // 🔒 PRIVADAS
    {
      path: '/perfil',
      component: Perfil,
      meta: { requiresAuth: true },
    },
    {
      path: '/ajustes',
      component: Ajustes,
      meta: { requiresAuth: true },
    },
    {
      path: '/biblioteca',
      component: BibliotecaView,
      meta: { requiresAuth: true },
    },
    {
      path: '/examen/:id',
      component: ExamenView,
      meta: { requiresAuth: true },
    },
    {
      path: '/estudio',
      component: Estudio,
      meta: { requiresAuth: true },
    },
    {
      path: '/paypal',
      component: PaypalView,
      meta: { requiresAuth: true },
    },

    // ❌ ERRORES
    {
      path: '/404',
      component: ErrorView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: ErrorView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') // 🔁 redirige al login
  } else {
    next() // ✅ permite acceso
  }
})

export default router
