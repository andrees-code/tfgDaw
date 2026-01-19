<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden">

        <div class="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-blue-500 opacity-5 blur-2xl"></div>
        <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-blue-500 opacity-10 blur-2xl"></div>

        <div class="text-center mb-8 relative z-10">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3978D7]">
            <i class="fa-solid fa-key text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Nueva contraseña</h2>
          <p class="text-slate-500 text-sm mt-2">Introduce tu nueva clave para recuperar el acceso.</p>
        </div>

        <form @submit.prevent="handleReset" class="space-y-5 relative z-10">

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Nueva contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-slate-400"></i>
              </div>
              <input
                v-model="form.password"
                type="password"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Confirmar contraseña</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-solid fa-lock text-slate-400"></i>
              </div>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3978D7]/20 focus:border-[#3978D7] transition-all"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#3978D7] hover:bg-[#2d62b3] active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-4"
          >
            <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
            <span v-else>Cambiar contraseña</span>
          </button>
        </form>

        <div v-if="error" class="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
          <i class="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
          <p class="text-sm text-red-600 font-medium">{{ error }}</p>
        </div>

        <div v-if="success" class="mt-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-start gap-3">
          <i class="fa-solid fa-circle-check text-green-500 mt-0.5"></i>
          <div>
             <p class="text-sm text-green-600 font-medium">¡Contraseña actualizada!</p>
             <p class="text-xs text-green-500 mt-1">Redirigiendo al login...</p>
          </div>
        </div>

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
  // Capturar el token de la URL (?token=xyz...)
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

  if (form.value.password.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres"
    return
  }

  try {
    loading.value = true
    error.value = null

    // Enviar token y nueva contraseña al backend
    await resetPassword({
      token: token.value,
      newPassword: form.value.password
    })

    success.value = true

    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login') // O la ruta donde tengas tu AuthView
    }, 2000)

  } catch (e) {
    error.value = e.response?.data?.message || "El enlace ha expirado o es inválido."
  } finally {
    loading.value = false
  }
}
</script>
