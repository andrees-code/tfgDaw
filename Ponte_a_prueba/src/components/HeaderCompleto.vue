<template>
  <div>
    <header
      class="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      :class="scrolled 
        ? 'bg-[#020617]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl py-2 border-b border-white/5' 
        : 'bg-transparent py-4 border-b border-transparent'"
    >
      <nav class="max-w-6xl mx-auto px-4 flex items-center justify-between relative">

        <div class="flex items-center">
          <button
            v-if="route.path !== '/'"
            type="button"
            @click="router.back()"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 border border-white/10 transition-all duration-200 group backdrop-blur-sm shadow-lg shadow-black/20"
            aria-label="Volver a la página anterior"
          >
            <i class="fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform" aria-hidden="true"></i>
          </button>
        </div>

        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <router-link to="/" class="block pointer-events-auto hover:opacity-80 transition-opacity filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" aria-label="Ir al inicio">
            <img 
              class="h-9 w-auto object-contain" 
              src="../assets/logo/prueba2.webp" 
              alt="Logo PonteAprobados" 
              width="288" 
              height="63" 
              loading="eager"
            />
          </router-link>
        </div>

        <div class="flex items-center gap-3 md:gap-4 z-10">

          <div class="relative" ref="menuContainer">
               <button
                  type="button"
                  class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
                  @click="abrirMenu"
                  aria-label="Abrir menú de navegación"
                  :aria-expanded="menuAbierto"
              >
                  <i class="fa-solid fa-bars text-xl" aria-hidden="true"></i>
              </button>

              <Menu v-if="menuAbierto" @cerrar="menuAbierto = false" />
          </div>

          <template v-if="userStore.isAuthenticated">
            <div class="relative" ref="dropdownContainer">

              <button
                  type="button"
                  @click="abrirDropdown"
                  class="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-white/10 transition-all border border-transparent focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                  :class="dropdownAbierto ? 'bg-white/10 ring-1 ring-white/10' : ''"
                  aria-label="Menú de usuario"
                  :aria-expanded="dropdownAbierto"
              >
                  <img
                    :src="userStore.user?.avatar ?? '/img/perfil.jpg'"
                    alt="Avatar de usuario"
                    class="w-9 h-9 rounded-full object-cover border-2 border-[#020617] ring-1 ring-white/20 shadow-sm"
                    width="36"
                    height="36"
                  />
                  <i class="hidden md:block fa-solid fa-chevron-down text-[10px] text-slate-400 mr-1 transition-transform duration-200" :class="dropdownAbierto ? 'rotate-180' : ''" aria-hidden="true"></i>
              </button>

              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 opacity-0 translate-y-2"
                enter-to-class="transform scale-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform scale-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-95 opacity-0 translate-y-2"
              >
                  <div
                    v-if="dropdownAbierto && userStore.user"
                    class="absolute right-0 mt-3 w-60 bg-[#0f172a]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 origin-top-right ring-1 ring-white/5"
                  >
                    <div class="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                      <p class="text-[10px] font-bold uppercase text-indigo-400 tracking-widest mb-1">Conectado como</p>
                      <p class="text-sm font-bold text-white truncate">{{ userStore.user?.name || 'Usuario' }}</p>
                    </div>

                    <div class="p-2 space-y-1">
                        <router-link
                          to="/perfil"
                          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all group border border-transparent hover:border-white/5"
                          @click="dropdownAbierto = false"
                        >
                          <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-inner shadow-indigo-500/10">
                               <i class="fa-solid fa-user text-xs" aria-hidden="true"></i>
                          </span>
                          Mi Perfil
                        </router-link>

                        <button
                          type="button"
                          @click="logout"
                          class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all group mt-1 border border-transparent hover:border-red-500/20"
                        >
                          <span class="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                               <i class="fa-solid fa-right-from-bracket text-xs" aria-hidden="true"></i>
                          </span>
                          Cerrar sesión
                        </button>
                    </div>
                  </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <router-link
              to="/login"
              class="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] border border-indigo-400/50 hover:-translate-y-0.5"
            >
              <span class="hidden md:inline">Entrar</span>
              <i class="fa-solid fa-user md:hidden" aria-hidden="true"></i>
              <i class="hidden md:inline fa-solid fa-arrow-right text-xs text-indigo-200" aria-hidden="true"></i>
            </router-link>
          </template>

        </div>
      </nav>
    </header>

    <div class="h-24"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { userStore } from '@/stores/userStores'
import { useRouter, useRoute } from 'vue-router'
import Menu from '@/components/BarsMenu.vue'

const menuAbierto = ref(false)
const dropdownAbierto = ref(false)
const scrolled = ref(false)
const router = useRouter()
const route = useRoute()

// Refs para los contenedores (padres)
const menuContainer = ref(null)
const dropdownContainer = ref(null)

function abrirMenu() {
  menuAbierto.value = !menuAbierto.value
  if (menuAbierto.value) dropdownAbierto.value = false
}

function abrirDropdown() {
  dropdownAbierto.value = !dropdownAbierto.value
  if (dropdownAbierto.value) menuAbierto.value = false
}

function logout() {
  userStore.logout()
  router.push('/login')
  dropdownAbierto.value = false
}

// Lógica para cerrar al hacer click fuera
const handleClickOutside = (event) => {
  // 1. Cerrar Menú Bars
  if (menuAbierto.value && menuContainer.value && !menuContainer.value.contains(event.target)) {
    menuAbierto.value = false
  }

  // 2. Cerrar Dropdown Usuario
  if (dropdownAbierto.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    dropdownAbierto.value = false
  }
}

const handleScroll = () => {
    // Pequeña optimización: usar requestAnimationFrame si fuera muy pesado, pero aquí está bien
    scrolled.value = window.scrollY > 20
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll, { passive: true }) // passive: true mejora rendimiento scroll
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>