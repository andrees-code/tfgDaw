<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <!-- TABS -->
        <div class="flex justify-center mb-6">
          <button
            class="px-4 py-2 font-semibold"
            :class="modo === 'login'
              ? 'text-[#3978D7] border-b-2 border-[#3978D7]'
              : 'text-gray-400'"
            @click="modo = 'login'"
          >
            Iniciar sesión
          </button>

          <button
            class="px-4 py-2 font-semibold"
            :class="modo === 'register'
              ? 'text-[#3978D7] border-b-2 border-[#3978D7]'
              : 'text-gray-400'"
            @click="modo = 'register'"
          >
            Registrarse
          </button>
        </div>

        <!-- LOGIN -->
        <form v-if="modo === 'login'" @submit.prevent="login">
          <h2 class="text-center text-lg font-bold text-[#546E7A] mb-6">
            Bienvenido de nuevo
          </h2>

          <div class="mb-4">
            <label class="block text-sm mb-1 text-gray-600">
              Correo electrónico
            </label>
            <input
              v-model="loginForm.email"
              type="email"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm mb-1 text-gray-600">
              Contraseña
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {{ loading ? "Iniciando sesión..." : "Iniciar sesión" }}
          </button>
        </form>

        <!-- REGISTER -->
        <form v-else @submit.prevent="register">
          <h2 class="text-center text-lg font-bold text-[#546E7A] mb-6">
            Crear cuenta
          </h2>

          <div class="mb-4">
            <label class="block text-sm mb-1 text-gray-600">
              Nombre de usuario
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
              placeholder="Tu nombre"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm mb-1 text-gray-600">
              Correo electrónico
            </label>
            <input
              v-model="registerForm.email"
              type="email"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div class="mb-6">
            <label class="block text-sm mb-1 text-gray-600">
              Contraseña
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {{ loading ? "Registrando..." : "Registrarse" }}
          </button>
        </form>

        <!-- ERROR -->
        <p v-if="error" class="text-red-500 text-center mt-4">
          {{ error }}
        </p>
      </div>
    </main>

    <footer class="py-6 text-center text-gray-500 text-xs bg-white">
      © 2025 Nombre de la Empresa. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Header from "@/components/HeaderCompleto.vue"
import { loginUser, registerUser } from "@/services/userService"
import { userStore } from "@/stores/userStores"

const router = useRouter()

const modo = ref("login")
const error = ref(null)
const loading = ref(false)

const loginForm = ref({ email: "", password: "" })
const registerForm = ref({ username: "", email: "", password: "" })

async function login() {
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "Completa todos los campos"
    return
  }

  try {
    loading.value = true
    error.value = null

    const res = await loginUser(loginForm.value)
    userStore.setSession(res) // ✅ Guardar user + token
    router.push("/")
  } catch (e) {
    error.value =
      Array.isArray(e.response?.data?.message)
        ? e.response.data.message.join(", ")
        : e.response?.data?.message || "Error al iniciar sesión"
  } finally {
    loading.value = false
  }
}

async function register() {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    error.value = "Completa todos los campos"
    return
  }

  try {
    loading.value = true
    error.value = null

    const res = await registerUser(registerForm.value)
    userStore.setSession(res) // ✅ Guardar user + token
    router.push("/")
  } catch (e) {
    error.value =
      Array.isArray(e.response?.data?.message)
        ? e.response.data.message.join(", ")
        : e.response?.data?.message || "Error al registrarse"
  } finally {
    loading.value = false
  }
}
</script>



<style scoped>
/* Todo con Tailwind */
</style>
