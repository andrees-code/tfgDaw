<template>
  <header class="bg-[#1C263F] py-3 px-4 shadow-md relative">
    <nav class="max-w-5xl mx-auto grid grid-cols-3 items-center">

      <!-- Logo -->
      <div class="justify-self-start">
        <router-link to="/">
          <img class="w-24 h-17" src="../assets/img/logoBueno.png" alt="Logo" />
        </router-link>
      </div>

      <!-- Título -->
      <h1 class="text-white text-xl md:text-2xl text-center font-serif-custom">
        <router-link to="/" class="text-white no-underline">
          Ponte a prueba
        </router-link>
      </h1>

      <!-- Menú derecho -->
      <div class="justify-self-end relative flex items-center gap-3">

        <!-- Icono hamburguesa -->
        <i
          class="fa-solid fa-bars text-white text-2xl cursor-pointer"
          @click="menuAbierto = !menuAbierto"
        ></i>
        <Menu v-if="menuAbierto" @cerrar="menuAbierto = false" />

        <!-- Usuario logueado -->
        <template v-if="userStore.isAuthenticated">
          <div class="relative">
           <img
            :src="userStore.user?.avatar ?? '/img/perro.jpg'"
            alt="Avatar"
            class="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            @click="dropdownAbierto = !dropdownAbierto"
          />

            <!-- Dropdown -->
            <div
              v-if="dropdownAbierto && userStore.user"
              class="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded z-50"
            >
              <p class="p-2 text-gray-700 border-b">{{ userStore.user?.username ?? 'Invitado' }}</p>
              <button
                class="w-full text-left p-2 hover:bg-gray-100"
                @click="logout"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </template>

        <!-- No hay usuario -->
        <template v-else>
          <button class="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">
            <router-link to="/login">Login</router-link>
          </button>
        </template>

      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '@/stores/userStores'
import { useRouter } from 'vue-router'
import Menu from '@/components/BarsMenu.vue'

const menuAbierto = ref(false)
const dropdownAbierto = ref(false)
const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Todo con Tailwind */
</style>
