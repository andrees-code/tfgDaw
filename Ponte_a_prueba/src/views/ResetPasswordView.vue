<template>
  <div class="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-300 relative overflow-hidden">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

        <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-screen"></div>
        <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen"></div>
    </div>

    <main class="flex-grow flex items-center justify-center p-4 relative z-10">

      <div class="bg-slate-900/60 backdrop-blur-2xl border border-white/10 w-full max-w-md rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-8 relative overflow-hidden animate-fade-in-up">

        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>
        <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

        <div class="text-center mb-8 relative z-10">
          <div class="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400 shadow-lg shadow-indigo-900/20">
            <i class="fa-solid fa-key text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-white">Nueva contraseña</h2>
          <p class="text-slate-400 text-sm mt-2">Introduce tu nueva clave para recuperar el acceso.</p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5 relative z-10">

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Nueva contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
              </div>
              <input
                v-model="form.password"
                type="password"
                class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase text-slate-500 mb-2 ml-1 tracking-wider">Confirmar contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
              </div>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 transition-all"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/30 transition-all disabled:opacity-50 disabled:bg-slate-800 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6 hover:-translate-y-0.5"
          >
            <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            <span v-else>Cambiar contraseña</span>
          </button>
        </form>

        <transition name="slide-up">
            <div v-if="error" class="mt-6 p-4 rounded-xl bg-red-900/20 border border-red-500/20 flex items-start gap-3">
            <i class="fa-solid fa-circle-exclamation text-red-400 mt-0.5"></i>
            <p class="text-sm text-red-300 font-medium">{{ error }}</p>
            </div>
        </transition>

        <transition name="slide-up">
            <div v-if="success" class="mt-6 p-4 rounded-xl bg-green-900/20 border border-green-500/20 flex items-start gap-3">
            <i class="fa-solid fa-circle-check text-green-400 mt-0.5"></i>
            <div>
                <p class="text-sm text-green-300 font-medium">¡Contraseña actualizada!</p>
                <p class="text-xs text-green-400/70 mt-1">Redirigiendo al login...</p>
            </div>
            </div>
        </transition>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPassword } from "@/services/userService"

const route = useRoute()
const router = useRouter()

const form = ref({ password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const token = ref('')

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    error.value = "Token inválido o faltante. Vuelve a solicitar el correo."
  }
})

async function handleReset() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Las contraseñas no coinciden"
    return
  }

  // 👇 CAMBIO AQUÍ: Validación de 8 caracteres
  if (form.value.password.length < 8) {
    error.value = "La contraseña debe tener al menos 8 caracteres"
    return
  }

  try {
    loading.value = true
    error.value = null

    await resetPassword({
      token: token.value,
      newPassword: form.value.password
    })

    success.value = true

    setTimeout(() => {
      router.push('/login')
    }, 2000)

  } catch (e) {
    error.value = e.response?.data?.message || "El enlace ha expirado o es inválido."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transiciones */
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
