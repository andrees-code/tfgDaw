<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
    <Header />

    <main class="mx-auto max-w-6xl px-4 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Ajustes de perfil</h1>
        <p class="text-slate-500 mt-1">Gestiona tu información personal, seguridad y suscripción</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna izquierda -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-sm border p-6 sticky top-6">
            <div class="flex flex-col items-center text-center">
              <img
                :src="previewFoto || userStore.user.avatar || fotoPlaceholder"
                class="w-28 h-28 rounded-full border-4 border-blue-500 shadow"
              />
              <h2 class="mt-4 font-semibold text-slate-800">{{ username || 'Usuario' }}</h2>
              <p class="text-sm text-slate-500">{{ email }}</p>

              <label
                for="foto"
                class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm cursor-pointer hover:bg-blue-700"
              >
                <i class="fa-solid fa-camera"></i> Cambiar foto
              </label>
              <input id="foto" type="file" accept="image/*" class="hidden" @change="cambiarFoto" />
              <span class="text-xs text-slate-400 mt-2">JPG o PNG · Máx. 2MB</span>
            </div>

            <div class="mt-6 border-t pt-4 space-y-3 text-sm">
              <p class="flex items-center gap-2 text-slate-600">
                <i class="fa-solid fa-shield-halved text-blue-500"></i> Cuenta segura
              </p>
              <p class="flex items-center gap-2 text-slate-600">
                <i class="fa-solid fa-credit-card text-blue-500"></i> Gestión de pagos
              </p>
            </div>
          </div>
        </aside>

        <!-- Columna derecha -->
        <section class="lg:col-span-2 space-y-8">
          <!-- Datos personales -->
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-user text-blue-500"></i> Datos personales
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nombre completo</label>
                <input v-model="username" type="text" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="text-sm text-slate-500">Correo electrónico</label>
                <input v-model="email" type="email" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Seguridad -->
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-lock text-blue-500"></i> Seguridad
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm text-slate-500">Nueva contraseña</label>
                <input v-model="password" type="password" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
              <div>
                <label class="text-sm text-slate-500">Confirmar contraseña</label>
                <input v-model="passwordConfirm" type="password" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
            </div>
          </div>

          <!-- Suscripciones -->
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <i class="fa-solid fa-gem text-blue-500"></i> Planes de suscripción
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Gratis -->
              <div class="rounded-xl border bg-slate-50 p-5 flex flex-col">
                <h4 class="font-bold text-slate-700">Gratis</h4>
                <p class="text-sm text-slate-500 mt-2">Funciones básicas</p>
                <p class="text-3xl font-bold text-slate-700 mt-4">0 €</p>
                <button class="mt-auto mt-6 bg-slate-400 text-white py-2 rounded-lg text-sm" disabled>Plan actual</button>
              </div>

              <!-- Mensual -->
              <div class="rounded-xl border p-5 flex flex-col hover:shadow-md transition">
                <h4 class="font-bold text-blue-600">Mensual</h4>
                <p class="text-sm text-slate-500 mt-2">Acceso completo</p>
                <p class="text-3xl font-bold mt-4">10,00 €</p>
                <button class="mt-auto mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm">Elegir plan</button>
              </div>

              <!-- Anual -->
              <div class="rounded-xl border-2 border-blue-600 bg-blue-50 p-5 flex flex-col hover:shadow-lg transition">
                <h4 class="font-bold text-blue-600">Anual</h4>
                <p class="text-sm text-slate-500 mt-2">Mejor ahorro</p>
                <p class="text-3xl font-bold mt-4">99,99 €</p>
                <button class="mt-auto mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm">Elegir plan</button>
              </div>
            </div>
          </div>

          <!-- Donaciones -->
          <div class="bg-white rounded-2xl shadow-sm border p-6 text-center">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Donaciones</h3>
            <router-link to="/paypal" class="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#002169] text-white px-6 py-3 rounded-lg">
              <i class="fab fa-paypal"></i> Donar con PayPal
            </router-link>
          </div>

          <!-- Guardar -->
          <div class="bg-white rounded-2xl shadow-sm border p-6">
            <button @click="guardarCambios" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium">
              {{ loading ? 'Guardando...' : 'Guardar cambios' }}
            </button>
            <p v-if="mensaje" class="mt-4 text-center text-green-600 text-sm">{{ mensaje }}</p>
            <p v-if="error" class="mt-4 text-center text-red-500 text-sm">{{ error }}</p>
          </div>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>


<script setup>
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import { ref, onMounted } from 'vue'
import { userStore } from '@/stores/userStores'
import { SubscriptionService } from '@/services/subscriptionService'
import { updateProfile, loginUser } from '@/services/userService'

const fotoPlaceholder = '/img/perfil.jpg'
const previewFoto = ref(null)
const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const mensaje = ref('')
const error = ref('')
const loading = ref(false)

onMounted(() => {
  // 🔹 Cargamos la sesión desde store
  userStore.loadSession()

  // 🔹 Inicializamos variables locales desde store
  username.value = userStore.user.username
  email.value = userStore.user.email
  previewFoto.value = userStore.user.avatar
})

function cambiarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  previewFoto.value = URL.createObjectURL(file)
}

async function guardarCambios() {
  if (!username.value || !email.value) {
    error.value = 'Nombre y correo son obligatorios'
    return
  }
  if (password.value && password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const updatedUser = await updateProfile(userStore.user._id, {
      username: username.value,
      email: email.value,
      password: password.value || undefined,
      avatar: previewFoto.value || undefined
    })

    let token = userStore.token

    // 🔹 Solo hacemos login si se cambió la contraseña
    if (password.value) {
      const loginRes = await loginUser({
        email: updatedUser.email,
        password: password.value
      })
      token = loginRes.token
      userStore.setToken(token)
    }

    // 🔹 Actualizamos store de forma reactiva
    userStore.updateUser({
      ...updatedUser,
      token
    })

    // 🔹 Actualizamos variables locales
    username.value = updatedUser.username
    email.value = updatedUser.email
    previewFoto.value = updatedUser.avatar

    mensaje.value = 'Cambios guardados correctamente'
    password.value = ''
    passwordConfirm.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar los cambios'
  } finally {
    loading.value = false
  }
}

// 🔹 Suscribirse usando Stripe Checkout
async function suscribirse(plan) {
  loading.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const res = await SubscriptionService.createCheckoutSession(plan)
    if (res.url) {
      window.location.href = res.url
    } else {
      throw new Error('No se pudo generar la sesión de pago')
    }
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Error al iniciar la suscripción'
  } finally {
    loading.value = false
  }
}



</script>

<style lang="sass">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
@import url("https://fonts.cdnfonts.com/css/jacques-francois")

.font-serif-custom
  font-family: "Jacques Francois", serif
</style>
