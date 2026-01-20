import { createRouter, createWebHistory } from 'vue-router'

// ✅ ESTRATEGIA: HomeView se carga normal (Eager Loading)
// Queremos que la portada sea instantánea, así que la importamos arriba.
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🔓 PÚBLICAS
    {
      path: '/',
      name: 'home',
      component: HomeView, // Carga inmediata
    },
    {
      path: '/home',
      redirect: '/' // Mejor redireccionar para no duplicar contenido SEO
    },
    {
      path: '/contacto',
      name: 'contacto',
      // 🚀 LAZY LOADING: Solo se descarga si el usuario va a /contacto
      component: () => import('@/views/ContactoView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginRegister.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/ResetPasswordView.vue')
    },
    {
      path: '/modotinder',
      name: 'tinder',
      component: () => import('@/views/ModoTinderView.vue')
    },

    // 🔒 PRIVADAS
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/biblioteca',
      name: 'biblioteca',
      component: () => import('@/views/BibliotecaView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/examen/:id',
      name: 'examen',
      component: () => import('@/views/ExamenView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/estudio',
      name: 'estudio',
      component: () => import('@/views/ZonaEstudioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/paypal',
      name: 'paypal',
      component: () => import('@/views/PaypalView.vue'),
      meta: { requiresAuth: true },
    },

    // ❌ ERRORES (También lazy, ¡esperamos que nadie entre aquí!)
    {
      path: '/404',
      name: 'error-404',
      component: () => import('@/views/ErrorView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/ErrorView.vue'),
    },
  ],
  // ✅ OPTIMIZACIÓN EXTRA: Scroll al inicio al cambiar de página
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') 
  } else {
    next()
  }
})

export default router