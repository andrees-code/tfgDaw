<template>
  <header class="bg-[#1C263F] py-3 px-4 shadow-md relative">
    <nav class="max-w-5xl mx-auto flex items-center justify-between relative">

      <!-- Flecha atrás -->
      <button
        @click="router.back()"
        class="text-white text-2xl mr-2 md:mr-4 hover:text-gray-300 z-10"
        aria-label="Volver"
      >
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <!-- Logo centrado -->
      <div class="absolute left-1/2 transform -translate-x-1/2 pointer-events-none">
        <router-link to="/buscador" class="pointer-events-auto">
          <img class="w-24 h-17" src="../assets/logo/prueba2.png" alt="Logo" />
        </router-link>
      </div>

      <!-- Menú derecho -->
      <div class="flex items-center gap-3 z-10">
        <!-- Icono hamburguesa -->
        <i
          class="fa-solid fa-bars text-white text-2xl cursor-pointer"
          @click="abrirMenu"
        ></i>
        <Menu v-if="menuAbierto" @cerrar="menuAbierto = false" />

        <!-- Usuario logueado -->
        <template v-if="userStore.isAuthenticated">
          <div class="relative">
            <img
              :src="userStore.user?.avatar ?? '/img/perro.jpg'"
              alt="Avatar"
              class="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
              @click="abrirDropdown"
            />

            <!-- Dropdown -->
            <div
              v-if="dropdownAbierto && userStore.user"
              class="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded z-50"
            >

              <!-- Perfil -->
              <div class="p-2 text-gray-700 border-b">
                <router-link to="/perfil">
                  <p style="display: flex; align-items: center; gap: 0.5rem;" class="text-black">
                    <i :class="['fa-solid', `fa-user`, 'text-black']"></i>
                    Perfil
                  </p>
                </router-link>
              </div>

              <!-- Cerrar sesión -->
              <button
                class="w-full text-left p-2 hover:bg-gray-100"
                @click="logout"
              >
                <p style="display: flex; align-items: center; gap: 0.5rem;" class="text-black">
                  <i :class="['fa-solid', 'fa-right-from-bracket', 'text-black']"></i>
                  Cerrar sesión
                </p>
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
}
</script>
