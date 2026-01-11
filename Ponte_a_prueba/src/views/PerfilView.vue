<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md md:max-w-4xl rounded-2xl shadow-xl p-6 md:p-10">

        <h2 class="text-center text-[#546E7A] font-bold text-lg mb-10">
          Ajustes de perfil
        </h2>

        <!-- FOTO DE PERFIL -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4">
            Foto de perfil
          </h3>
          <div class="flex items-center justify-center gap-6">
            <img
              :src="previewFoto || userStore.user.avatar || fotoPlaceholder"
              class="w-24 h-24 rounded-full border-4 border-[#3978D7]"
            />
            <div class="flex flex-col items-center">
              <label
                for="foto"
                class="bg-[#3978D7] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#2d62b3] text-sm"
              >
                Cambiar foto
              </label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                class="hidden"
                @change="cambiarFoto"
              />
              <p class="text-xs text-gray-500 mt-2 text-center">
                JPG o PNG · Máx. 2MB
              </p>
            </div>
          </div>
        </section>

        <!-- DATOS PERSONALES -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4 text-center">
            Datos personales
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              v-model="username"
              type="text"
              placeholder="Nombre completo"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
          </div>
        </section>

        <!-- SEGURIDAD -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4 text-center">
            Seguridad
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              v-model="password"
              type="password"
              placeholder="Nueva contraseña"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
            <input
              v-model="passwordConfirm"
              type="password"
              placeholder="Confirmar contraseña"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
          </div>
        </section>

        <!-- SUSCRIPCIONES -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4 text-center">Planes de suscripción</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <!-- Gratuita -->
            <div class="p-4 border rounded-lg flex flex-col items-center">
              <h4 class="font-bold mb-2">Gratis</h4>
              <p class="text-gray-600 mb-4">Acceso limitado a funciones básicas</p>
              <button
                class="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                disabled
              >
                Actual
              </button>
            </div>

            <!-- Mensual -->
            <div class="p-4 border rounded-lg flex flex-col items-center">
              <h4 class="font-bold mb-2">Mensual</h4>
              <p class="text-gray-600 mb-4">9,99 € / mes</p>
              <button
                :class="userStore.user.subscription?.plan === 'monthly' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3978D7] hover:bg-[#2d62b3]'"
                :disabled="userStore.user.subscription?.plan === 'monthly'"
                @click="suscribirse('monthly')"
              >
                {{ userStore.user.subscription?.plan === 'monthly' ? 'Actual' : 'Suscribirse' }}
              </button>
            </div>

            <!-- Anual -->
            <div class="p-4 border rounded-lg flex flex-col items-center">
              <h4 class="font-bold mb-2">Anual</h4>
              <p class="text-gray-600 mb-4">99,99 € / año</p>
              <button
                :class="userStore.user.subscription?.plan === 'yearly' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3978D7] hover:bg-[#2d62b3]'"
                :disabled="userStore.user.subscription?.plan === 'yearly'"
                @click="suscribirse('yearly')"
              >
                {{ userStore.user.subscription?.plan === 'yearly' ? 'Actual' : 'Suscribirse' }}
              </button>
            </div>
          </div>

          <div class="mt-4 flex justify-center">
            <button @click="getPremiumContent" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Probar contenido premium
            </button>
          </div>
        </section>

        <!-- DONACIONES -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4 text-center">Donaciones</h3>
          <div class="flex justify-center">
            <router-link
              to="/paypal"
              class="bg-[#003087] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[#002169]"
            >
              <i class="fab fa-paypal text-lg"></i> Donar con PayPal
            </router-link>
          </div>
        </section>

        <!-- BOTÓN GUARDAR -->
        <button
          @click="guardarCambios"
          :disabled="loading"
          class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>

        <p v-if="mensaje" class="mt-4 text-center text-green-600 text-sm">
          {{ mensaje }}
        </p>

        <p v-if="error" class="mt-4 text-center text-red-500 text-sm">
          {{ error }}
        </p>

      </div>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import { ref, onMounted } from 'vue'
import { userStore } from '@/stores/userStores'
import { SubscriptionService } from '@/services/subscriptionService'
import { updateProfile, loginUser } from '@/services/userService'

const fotoPlaceholder = '/img/perro.jpg'
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

async function getPremiumContent() {
  try {
    const res = await SubscriptionService.getPremiumContent()
    alert(`Contenido premium desbloqueado: ${res.message}`)
  } catch (e) {
    alert('No tienes suscripción activa')
  }
}

function donarPaypal() {
  window.open('https://www.paypal.com/donate?hosted_button_id=TU_ID', '_blank')
}
</script>

<style lang="sass">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
@import url("https://fonts.cdnfonts.com/css/jacques-francois")

.font-serif-custom
  font-family: "Jacques Francois", serif
</style>
