<template>
  <div class="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-300 relative overflow-hidden">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[100px] opacity-50 animate-blob mix-blend-screen"></div>
        <div class="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[100px] opacity-50 animate-blob animation-delay-2000 mix-blend-screen"></div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow flex items-center justify-center p-4 lg:p-8 relative z-10">

      <div class="bg-slate-900/60 backdrop-blur-2xl border border-white/10 w-full max-w-5xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative">

        <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 to-slate-950 p-12 flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
          <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 opacity-20 blur-3xl"></div>
          <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 opacity-20 blur-3xl"></div>

          <div class="relative z-10">
            <h3 class="text-3xl font-bold font-serif-custom mb-2 text-white">Bienvenido a tu Portal</h3>
            <p class="text-slate-400 opacity-90">Gestiona tu cuenta, suscripciones y seguridad en un solo lugar.</p>
          </div>

          <div class="relative z-10">
            <div class="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
              <div class="flex items-center gap-4 mb-3">
                <div class="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                  <i class="fa-solid fa-shield-halved text-xl"></i>
                </div>
                <div>
                  <h4 class="font-bold text-slate-200">Seguridad Garantizada</h4>
                  <p class="text-xs text-slate-400">Tus datos están protegidos</p>
                </div>
              </div>
              <p class="text-sm text-slate-500 italic">"La mejor forma de empezar es dejar de hablar y comenzar a hacer."</p>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">

          <div class="max-w-md mx-auto w-full">

            <div class="lg:hidden text-center mb-8">
              <h2 class="text-2xl font-bold text-white">Acceso Usuario</h2>
              <p class="text-slate-400 text-sm">Gestiona tu acceso desde aquí</p>
            </div>

            <div v-if="modo !== 'forgot'" class="flex p-1 bg-slate-950/50 rounded-xl mb-8 relative border border-white/5">
              <button
                class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                :class="modo === 'login' ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'"
                @click="cambiarModo('login')"
              >
                <i class="fa-solid fa-right-to-bracket"></i> Iniciar sesión
              </button>
              <button
                class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                :class="modo === 'register' ? 'bg-slate-800 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'"
                @click="cambiarModo('register')"
              >
                <i class="fa-solid fa-user-plus"></i> Registrarse
              </button>
            </div>

            <div v-else class="mb-8">
              <button @click="cambiarModo('login')" class="text-slate-400 hover:text-indigo-400 text-sm flex items-center gap-2 transition-colors">
                <i class="fa-solid fa-arrow-left"></i> Volver al inicio de sesión
              </button>
            </div>

            <transition name="fade" mode="out-in">

              <form v-if="modo === 'login'" @submit.prevent="login" key="login" class="space-y-5">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1 hidden lg:block">Hola de nuevo 👋</h2>
                  <p class="text-slate-400 text-sm mb-6 hidden lg:block">Ingresa tus credenciales para acceder.</p>

                  <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Correo electrónico</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-envelope text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="loginForm.email"
                      type="email"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="nombre@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2 ml-1">
                    <label class="block text-xs font-bold uppercase text-slate-500 tracking-wider">Contraseña</label>
                    <a href="#" @click.prevent="cambiarModo('forgot')" class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">¿Olvidaste tu contraseña?</a>
                  </div>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-solid fa-lock text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="loginForm.password"
                      type="password"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 hover:-translate-y-0.5"
                >
                  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span v-else>Iniciar sesión</span>
                  <i v-if="!loading" class="fa-solid fa-arrow-right text-sm"></i>
                </button>
              </form>

              <form v-else-if="modo === 'register'" @submit.prevent="register" key="register" class="space-y-5">
                  <div>
                  <h2 class="text-2xl font-bold text-white mb-1 hidden lg:block">Crea tu cuenta 🚀</h2>
                  <p class="text-slate-400 text-sm mb-6 hidden lg:block">Empieza tu prueba gratuita de 30 días.</p>

                  <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Nombre de usuario</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-user text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.username"
                      type="text"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Correo electrónico</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-regular fa-envelope text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.email"
                      type="email"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Contraseña</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-solid fa-lock text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="registerForm.password"
                      type="password"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <p class="text-xs text-slate-500 mt-1 ml-1">Debe contener números y letras.</p>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 hover:-translate-y-0.5"
                >
                  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span v-else>Crear cuenta</span>
                </button>
              </form>

              <form v-else-if="modo === 'forgot'" @submit.prevent="forgotPassword" key="forgot" class="space-y-5">
                <div>
                  <h2 class="text-2xl font-bold text-white mb-1">Recuperar acceso 🔒</h2>
                  <p class="text-slate-400 text-sm mb-6">Ingresa tu email y te enviaremos las instrucciones.</p>

                  <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Correo electrónico</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i class="fa-solid fa-paper-plane text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
                    </div>
                    <input
                      v-model="forgotEmail"
                      type="email"
                      class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                      placeholder="nombre@ejemplo.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4 hover:-translate-y-0.5"
                >
                  <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span v-else>Enviar enlace de recuperación</span>
                </button>
              </form>

            </transition>

            <transition name="slide-up">
              <div v-if="error" class="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/20 flex items-start gap-3">
                <i class="fa-solid fa-circle-exclamation text-red-400 mt-0.5"></i>
                <p class="text-sm text-red-300 font-medium">{{ error }}</p>
              </div>
            </transition>

            <transition name="slide-up">
              <div v-if="success" class="mt-6 p-4 rounded-xl bg-green-900/20 border border-green-500/20 flex items-start gap-3">
                <i class="fa-solid fa-circle-check text-green-400 mt-0.5"></i>
                <p class="text-sm text-green-300 font-medium">{{ success }}</p>
              </div>
            </transition>

          </div>

          <div class="mt-8 text-center text-xs text-slate-600">
             &copy; {{ new Date().getFullYear() }} Tu Empresa. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </main>

    <Footer class="hidden lg:block relative z-20"/>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import Header from "@/components/HeaderCompleto.vue"
import Footer from '@/components/FooterComponent.vue'
import { loginUser, registerUser, sendPasswordResetEmail } from "@/services/userService"
import { userStore } from "@/stores/userStores"

const router = useRouter()

// Modos disponibles: 'login', 'register', 'forgot'
const modo = ref("login")
const error = ref(null)
const success = ref(null)
const loading = ref(false)

const loginForm = ref({ email: "", password: "" })
const registerForm = ref({ username: "", email: "", password: "" })
const forgotEmail = ref("")

function cambiarModo(nuevoModo) {
  modo.value = nuevoModo
  error.value = null
  success.value = null
  if (nuevoModo === 'login') forgotEmail.value = ""
}

async function login() {
  if (!loginForm.value.email || !loginForm.value.password) {
    error.value = "Por favor, completa todos los campos"
    return
  }

  try {
    loading.value = true
    error.value = null
    success.value = null

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
    success.value = null

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

async function forgotPassword() {
  if (!forgotEmail.value) {
    error.value = "Introduce tu correo electrónico para continuar"
    return
  }

  try {
    loading.value = true
    error.value = null
    success.value = null

    await sendPasswordResetEmail({ email: forgotEmail.value })

    success.value = "Hemos enviado un enlace a tu correo. Revisa tu bandeja de entrada."

  } catch (e) {
    error.value = e.response?.data?.message || "No se pudo enviar el correo. Inténtalo más tarde."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.font-serif-custom {
  font-family: 'Jacques Francois', serif;
}

/* Grid Pattern */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones */
.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
