<template>
  <div>
  <header
    class="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/10"
    :class="scrolled ? 'bg-[#0f172a]/95 shadow-lg backdrop-blur-xl py-2' : 'bg-[#0f172a]/80 backdrop-blur-md py-3'"
  >
    <nav class="max-w-6xl mx-auto px-4 flex items-center justify-between relative">

      <div class="flex items-center">
        <button
          @click="router.back()"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 border border-white/10 transition-all duration-200 group backdrop-blur-sm"
          aria-label="Volver"
        >
          <i class="fa-solid fa-arrow-left group-hover:-translate-x-0.5 transition-transform"></i>
        </button>
      </div>

      <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <router-link to="/" class="block pointer-events-auto hover:opacity-80 transition-opacity">
          <img class="h-8 w-auto object-contain" src="../assets/logo/prueba2.png" alt="Logo" />
        </router-link>
      </div>

      <div class="flex items-center gap-3 md:gap-4 z-10">

        <div class="relative" ref="menuContainer">
             <button
                class="w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
                @click="abrirMenu"
            >
                <i class="fa-solid fa-bars text-xl"></i>
            </button>

            <Menu v-if="menuAbierto" @cerrar="menuAbierto = false" />
        </div>

        <template v-if="userStore.isAuthenticated">
          <div class="relative" ref="dropdownContainer">

            <button
                @click="abrirDropdown"
                class="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-white/10 transition-all border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                :class="dropdownAbierto ? 'bg-white/10' : ''"
            >
                <img
                  :src="userStore.user?.avatar ?? '/img/perfil.jpg'"
                  alt="Avatar"
                  class="w-9 h-9 rounded-full object-cover border-2 border-slate-700 shadow-sm"
                />
                <i class="hidden md:block fa-solid fa-chevron-down text-[10px] text-slate-400 mr-1 transition-transform duration-200" :class="dropdownAbierto ? 'rotate-180' : ''"></i>
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
                  class="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                >
                  <div class="px-4 py-3 border-b border-slate-50 bg-slate-50/50">
                    <p class="text-xs font-bold uppercase text-slate-400 tracking-wider">Cuenta</p>
                    <p class="text-sm font-bold text-slate-800 truncate">{{ userStore.user?.name || 'Usuario' }}</p>
                  </div>

                  <div class="p-1.5">
                      <router-link
                        to="/perfil"
                        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors group"
                        @click="dropdownAbierto = false"
                      >
                        <span class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-200 group-hover:text-indigo-700 transition-colors">
                             <i class="fa-solid fa-user text-xs"></i>
                        </span>
                        Perfil
                      </router-link>

                      <button
                        @click="logout"
                        class="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors group mt-1"
                      >
                        <span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                             <i class="fa-solid fa-right-from-bracket text-xs"></i>
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
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-full transition-all shadow-lg hover:shadow-indigo-500/30 border border-indigo-500"
          >
            <span class="hidden md:inline">Entrar</span>
            <i class="fa-solid fa-user md:hidden"></i>
            <i class="hidden md:inline fa-solid fa-arrow-right text-xs text-indigo-200"></i>
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
import { useRouter } from 'vue-router'
import Menu from '@/components/BarsMenu.vue'

const menuAbierto = ref(false)
const dropdownAbierto = ref(false)
const scrolled = ref(false)
const router = useRouter()

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

// Lógica corregida para cerrar al hacer click fuera
const handleClickOutside = (event) => {
  // 1. Cerrar Menú Bars
  // Si el menú está abierto Y existe el contenedor Y el click NO fue dentro del contenedor
  if (menuAbierto.value && menuContainer.value && !menuContainer.value.contains(event.target)) {
    menuAbierto.value = false
  }

  // 2. Cerrar Dropdown Usuario
  if (dropdownAbierto.value && dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    dropdownAbierto.value = false
  }
}

const handleScroll = () => {
    scrolled.value = window.scrollY > 20
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})
</script>
