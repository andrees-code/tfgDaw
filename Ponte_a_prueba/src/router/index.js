import HomeView from '@/views/HomeView.vue'
import Contacto from '@/views/ContactoView.vue'
import Perfil from '@/views/PerfilView.vue'
import Ajustes from '@/views/AjustesView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '@/views/LoginRegister.vue'
import BibliotecaView from '@/views/BibliotecaView.vue'
import ExamenView from '@/views/ExamenView.vue'
import Estudio from '@/views/ZonaEstudioView.vue'
import BuscadorView from '@/views/BuscadorView.vue'
import PaypalView from '@/views/PaypalView.vue'

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
    },
    {
      path: '/biblioteca',
      component: BibliotecaView
    },
    {
      path: '/examen/:id',
      component: ExamenView
    },
    {
      path: '/estudio',
      component: Estudio
    },
    {
      path: '/buscador',
      component: BuscadorView
    },
    {
      path: '/paypal',
      component: PaypalView
    }
  ],
})

export default router
