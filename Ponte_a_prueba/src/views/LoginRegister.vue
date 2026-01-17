<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4 lg:p-8">

      <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3978D7] to-[#1a4b9c] p-12 flex-col justify-between text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

          <div class="relative z-10">
            <h3 class="text-3xl font-bold font-serif-custom mb-2">Bienvenido a tu Portal</h3>
            <p class="text-blue-100 opacity-90">Gestiona tu cuenta, suscripciones y seguridad en un solo lugar.</p>
          </div>

          <div class="relative z-10">
            <div class="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
              <div class="flex items-center gap-4 mb-3">
                <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600">
                  <i class="fa-solid fa-shield-halved text-lg"></i>
                </div>
                <div>
                  <h4 class="font-bold">Seguridad Garantizada</h4>
                  <p class="text-xs text-blue-100">Tus datos están protegidos</p>
                </div>
              </div>
              <p class="text-sm opacity-80 italic">"La mejor forma de empezar es dejar de hablar y comenzar a hacer."</p>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">

          <div class="max-w-md mx-auto w-full">
            <div class="lg:hidden text-center mb-8">
              <h2 class="text-2xl font-bold text-slate-800">Acceso Usuario</h2>
              <p class="text-slate-500 text-sm">Ingresa a tu cuenta para continuar</p>
            </div>

            <div class="flex p-1 bg-slate-100 rounded-xl mb-8 relative">
              <button
                class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                :class="modo === 'login' ? 'bg-white text-[#3978D7] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                @click="cambiarModo('login')"
              >
                <i class="fa-solid fa-right-to-bracket"></i> Iniciar sesión
              </button>
              <button
                class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                :class="modo === 'register' ? 'bg-white text-[#3978D7] shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                @click="cambiarModo('register')"
              >
                <i class="fa-solid fa-user-plus"></i> Registrarse
              </button>
            </div>

            <transition name="fade" mode="out-in">
              <form v-if="modo === 'login'" @submit.prevent="login" key="login" class="space-y-5">
                <div>
                  <h2 class="text-2xl font-bold text-slate-800 mb-1 hidden lg:block">Hola de nuevo 👋</h2>
                  <p class="text-slate-500 text-sm mb-6 hidden lg:block">Ingresa tus credenciales para acceder.</p>

                  <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Correo electrónico</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-envelope text-slate-400 group-focus-within:text-[#3978D7] transition-colors"></i>
                    </div>
                    <input
                      v-model="loginForm.email"
                      type="email"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                      placeholder="nombre@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-1.5 ml-1">
                    <label class="block text-sm font-medium text-slate-700">Contraseña</label>
                    <a href="#" class="text-xs text-[#3978D7] hover:underline">¿Olvidaste tu contraseña?</a>
                  </div>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-solid fa-lock text-slate-400 group-focus-within:text-[#3978D7] transition-colors"></i>
                    </div>
                    <input
                      v-model="loginForm.password"
                      type="password"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-[#3978D7] hover:bg-[#2d62b3] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                >
                  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span v-else>Iniciar sesión</span>
                  <i v-if="!loading" class="fa-solid fa-arrow-right text-sm"></i>
                </button>
              </form>

              <form v-else @submit.prevent="register" key="register" class="space-y-5">
                 <div>
                  <h2 class="text-2xl font-bold text-slate-800 mb-1 hidden lg:block">Crea tu cuenta 🚀</h2>
                  <p class="text-slate-500 text-sm mb-6 hidden lg:block">Empieza tu prueba gratuita de 30 días.</p>

                  <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Nombre de usuario</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-user text-slate-400 group-focus-within:text-[#3978D7] transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.username"
                      type="text"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Correo electrónico</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-envelope text-slate-400 group-focus-within:text-[#3978D7] transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.email"
                      type="email"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Contraseña</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-solid fa-lock text-slate-400 group-focus-within:text-[#3978D7] transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.password"
                      type="password"
                      class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <p class="text-xs text-slate-400 mt-1 ml-1">Debe contener números y letras.</p>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-[#3978D7] hover:bg-[#2d62b3] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
                >
                  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span v-else>Crear cuenta</span>
                </button>
              </form>
            </transition>

            <transition name="slide-up">
              <div v-if="error" class="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
                <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
                <p class="text-sm text-red-600 font-medium">{{ error }}</p>
              </div>
            </transition>

          </div>

          <div class="mt-8 text-center text-xs text-slate-400">
             &copy; {{ new Date().getFullYear() }} Tu Empresa. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </main>

    <Footer class="hidden lg:block"/> </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Header from "@/components/HeaderCompleto.vue"
import Footer from '@/components/FooterComponent.vue'
import { loginUser, registerUser } from "@/services/userService"
import { userStore } from "@/stores/userStores"

const router = useRouter()

const modo = ref("login")
const error = ref(null)
const loading = ref(false)

const loginForm = ref({ email: "", password: "" })
const registerForm = ref({ username: "", email: "", password: "" })

// Función para limpiar errores al cambiar de tab
function cambiarModo(nuevoModo) {
  modo.value = nuevoModo
  error.value = null
  // Opcional: limpiar formularios
  // loginForm.value = { email: "", password: "" }
  // registerForm.value = { username: "", email: "", password: "" }
}

async function login() {
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "Por favor, completa todos los campos"
    return
  }

  try {
    loading.value = true
    error.value = null

    const res = await loginUser(loginForm.value)
    userStore.setSession(res)
    router.push("/")
  } catch (e) {
    error.value =
      Array.isArray(e.response?.data?.message)
        ? e.response.data.message.join(", ")
        : e.response?.data?.message || "Credenciales incorrectas o error de conexión"
  } finally {
    loading.value = false
  }
}

async function register() {
  if (!registerForm.value.username || !registerForm.value.email || !registerForm.value.password) {
    error.value = "Por favor, completa todos los campos"
    return
  }

  try {
    loading.value = true
    error.value = null

    const res = await registerUser(registerForm.value)
    userStore.setSession(res)
    router.push("/")
  } catch (e) {
    error.value =
      Array.isArray(e.response?.data?.message)
        ? e.response.data.message.join(", ")
        : e.response?.data?.message || "Error al crear la cuenta"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Asegúrate de tener FontAwesome importado en tu proyecto o en el index.html */
/* @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"); */

.font-serif-custom {
  font-family: 'Jacques Francois', serif; /* Coincide con tu referencia */
}

/* Transición suave entre formularios (Fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transición para el mensaje de error (Slide Up) */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
