<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
    <Header />

    <main class="mx-auto max-w-6xl px-4 py-8 lg:py-12">
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Ajustes de Cuenta</h1>
        <p class="text-slate-500 mt-2 text-lg">Gestiona tu perfil, seguridad y plan de facturación.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <aside class="lg:col-span-4 xl:col-span-3">
          <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sticky top-6 overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400 opacity-10"></div>

            <div class="relative flex flex-col items-center text-center pt-4">
              <div class="relative group">
                <img
                  :src="previewFoto || userStore.user.avatar || fotoPlaceholder"
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md group-hover:shadow-lg transition-all"
                />
                <label
                  for="foto"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-blue-700 hover:scale-105 transition-all"
                  title="Cambiar foto"
                >
                  <i class="fa-solid fa-camera text-sm"></i>
                </label>
                <input id="foto" type="file" accept="image/*" class="hidden" @change="cambiarFoto" />
              </div>

              <h2 class="mt-4 text-xl font-bold text-slate-800">{{ username || 'Usuario' }}</h2>
              <p class="text-sm text-slate-500 font-medium">{{ email }}</p>

              <div
                class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border"
                :class="activePlan === 'free' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-blue-50 text-blue-700 border-blue-100'"
              >
                  <i v-if="activePlan !== 'free'" class="fa-solid fa-crown mr-1.5 text-xs"></i>
                  {{ activePlanDisplay }}
              </div>
            </div>

            <nav class="mt-8 space-y-2">
              <a href="#" class="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium transition-colors">
                <i class="fa-regular fa-user w-5"></i> General
              </a>
              <a href="#" class="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-medium transition-colors">
                <i class="fa-regular fa-credit-card w-5"></i> Facturación
              </a>
            </nav>
          </div>
        </aside>

        <section class="lg:col-span-8 xl:col-span-9 space-y-8">

          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
            <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i class="fa-regular fa-id-card text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800">Información Personal</h3>
                <p class="text-xs text-slate-500">Actualiza tus datos de identificación</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Nombre de usuario</label>
                <input
                  v-model="username"
                  type="text"
                  class="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all outline-none border"
                  placeholder="Tu nombre"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Correo electrónico</label>
                <input
                  v-model="email"
                  type="email"
                  class="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 focus:bg-white transition-all outline-none border"
                />
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8">
             <div class="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <i class="fa-solid fa-lock text-lg"></i>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-800">Contraseña y Seguridad</h3>
                <p class="text-xs text-slate-500">Mantén tu cuenta protegida</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Nueva contraseña</label>
                <input v-model="password" type="password" placeholder="••••••••" class="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-all outline-none border" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">Confirmar contraseña</label>
                <input v-model="passwordConfirm" type="password" placeholder="••••••••" class="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:ring-blue-500 transition-all outline-none border" />
              </div>
            </div>

             <div class="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <button
                @click="guardarCambios"
                :disabled="loadingSave"
                class="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-slate-900/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span v-if="loadingSave" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                {{ loadingSave ? 'Guardando...' : 'Guardar cambios' }}
              </button>
              <transition name="fade">
                <p v-if="mensaje" class="text-green-600 text-sm font-medium"><i class="fa-solid fa-check-circle mr-1"></i> {{ mensaje }}</p>
              </transition>
              <transition name="fade">
                <p v-if="error" class="text-red-500 text-sm font-medium"><i class="fa-solid fa-circle-exclamation mr-1"></i> {{ error }}</p>
              </transition>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 overflow-hidden relative">
            <div class="absolute top-0 right-0 p-4 opacity-5">
              <i class="fa-solid fa-gem text-9xl text-blue-900"></i>
            </div>

            <div class="relative z-10 mb-8">
              <h3 class="text-xl font-bold text-slate-800">Planes de Suscripción</h3>
              <p class="text-slate-500">Estado actual: <strong class="text-slate-800">{{ activePlanDisplay }}</strong></p>
            </div>

           <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

             <div class="rounded-2xl border p-6 flex flex-col items-start transition-colors bg-slate-50/50"
                  :class="activePlan === 'free' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'">
               <span class="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded mb-4">BÁSICO</span>
               <h4 class="text-2xl font-bold text-slate-800">Gratis</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-slate-900">0€</span>
                 <span class="text-slate-500">/mes</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                 <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-green-500"></i> Acceso básico</li>
               </ul>
               <button
                 disabled
                 class="w-full py-2.5 rounded-xl font-semibold border border-slate-300 text-slate-400 bg-transparent cursor-default"
               >
                 {{ activePlan === 'free' ? 'Plan Actual' : 'Incluido' }}
               </button>
             </div>

             <div class="rounded-2xl border p-6 flex flex-col items-start transition-all bg-white group"
                  :class="activePlan === 'monthly' ? 'border-blue-500 ring-2 ring-blue-500 shadow-lg' : 'border-slate-200 hover:shadow-xl hover:border-blue-200'">
               <span class="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded mb-4">PRO</span>
               <h4 class="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Mensual</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-slate-900">10€</span>
                 <span class="text-slate-500">/mes</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                 <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-blue-500"></i> Sin publicidad</li>
                 <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-blue-500"></i> Exámenes ilimitados</li>
               </ul>
               <button
                 @click="suscribirse('monthly')"
                 :disabled="activePlan === 'monthly' || loadingSub === 'monthly'"
                 class="w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                 :class="activePlan === 'monthly' ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'"
               >
                 <span v-if="loadingSub === 'monthly'" class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                 <span v-else>
                    <i v-if="activePlan === 'monthly'" class="fa-solid fa-check mr-2"></i>
                    {{ activePlan === 'monthly' ? 'Activo' : 'Elegir Mensual' }}
                 </span>
               </button>
             </div>

             <div class="rounded-2xl border-2 p-6 flex flex-col items-start shadow-xl bg-white relative overflow-hidden transform transition-transform duration-300"
                  :class="activePlan === 'yearly' ? 'border-green-500 ring-2 ring-green-500' : 'border-blue-500 hover:-translate-y-1'">
               <div class="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                 AHORRA 20%
               </div>
               <span class="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded mb-4">RECOMENDADO</span>
               <h4 class="text-2xl font-bold text-slate-800">Anual</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-slate-900">99€</span>
                 <span class="text-slate-500">/año</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-blue-500"></i> Sin publicidad</li>
                <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-blue-500"></i> Exámenes ilimitados</li>
                 <li class="flex items-center gap-2 text-sm text-slate-600"><i class="fa-solid fa-check text-blue-500"></i> 2 meses gratis</li>
               </ul>
               <button
                 @click="suscribirse('yearly')"
                 :disabled="activePlan === 'yearly' || loadingSub === 'yearly'"
                 class="w-full py-2.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
                 :class="activePlan === 'yearly' ? 'bg-green-600 text-white cursor-default shadow-green-500/30' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30'"
               >
                 <span v-if="loadingSub === 'yearly'" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                 <span v-else>
                     <i v-if="activePlan === 'yearly'" class="fa-solid fa-check mr-2"></i>
                     {{ activePlan === 'yearly' ? 'Activo' : 'Elegir Anual' }}
                 </span>
               </button>
             </div>

            </div>

             <div class="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <p class="text-sm text-slate-500 italic">¿Prefieres hacer una aportación única?</p>
              <router-link to="/paypal" class="inline-flex items-center gap-2 text-slate-600 hover:text-[#003087] font-medium transition-colors">
                <i class="fab fa-paypal text-xl"></i> Donar con PayPal
              </router-link>
            </div>
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
import { ref, onMounted, computed } from 'vue'
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

const loadingSave = ref(false)
const loadingSub = ref(null)

// Plan activo: "free", "monthly" o "yearly"
const activePlan = ref('free')

const activePlanDisplay = computed(() => {
  if (activePlan.value === 'free') return 'Plan Gratuito'
  if (activePlan.value === 'monthly') return 'Pro Mensual'
  if (activePlan.value === 'yearly') return 'Pro Anual'
  return 'Plan desconocido'
})

onMounted(async () => {
  await userStore.loadSession()

  if (userStore.user) {
    // 1. Cargar datos básicos
    username.value = userStore.user.username
    email.value = userStore.user.email
    previewFoto.value = userStore.user.avatar

    // 2. Intentar obtener el plan directamente del store (fuente de verdad más rápida)
    // Asumimos que la propiedad en BD se llama 'plan', 'subscriptionPlan' o similar.
    // Si tu backend guarda el plan en user.plan, esto lo arregla instantáneamente.
    if (userStore.user.plan) {
      activePlan.value = userStore.user.plan
    } else if (userStore.user.subscription && userStore.user.subscription.plan) {
        // Por si viene anidado
        activePlan.value = userStore.user.subscription.plan
    }

    // 3. (Opcional) Refrescar estado desde el servidor para asegurar que no hay caché vieja
    // Esto es vital si el usuario acaba de pagar y vuelve a esta página.
    await refreshSubscriptionStatus()
  }
})

// Nueva función robusta para chequear el estado
async function refreshSubscriptionStatus() {
    try {
        // Intentamos obtener el usuario fresco primero (a veces getPremiumContent falla si no hay contenido)
        // O usamos el servicio de suscripción si tiene un endpoint de 'status'
        const res = await SubscriptionService.getPremiumContent()

        // Verificamos varias estructuras posibles de respuesta para evitar el bug
        if (res && res.plan) {
            activePlan.value = res.plan
        } else if (res && res.data && res.data.plan) {
            activePlan.value = res.data.plan
        }

        // Actualizamos el store si detectamos un cambio
        if (userStore.user.plan !== activePlan.value) {
             userStore.updateUser({ ...userStore.user, plan: activePlan.value })
        }
    } catch (e) {
        console.warn("No se pudo verificar suscripción externa, usando datos en caché de usuario.", e)
        // No forzamos 'free' aquí para no sobrescribir si el userStore ya tenía el dato correcto
    }
}

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

  loadingSave.value = true
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
    if (password.value) {
      const loginRes = await loginUser({ email: updatedUser.email, password: password.value })
      token = loginRes.token
      userStore.setToken(token)
    }

    // Asegurarnos de no perder el plan al actualizar el usuario
    const planActual = activePlan.value
    userStore.updateUser({ ...updatedUser, token, plan: planActual })

    username.value = updatedUser.username
    email.value = updatedUser.email
    previewFoto.value = updatedUser.avatar

    mensaje.value = 'Perfil actualizado correctamente'
    password.value = ''
    passwordConfirm.value = ''

    setTimeout(() => mensaje.value = '', 3000)
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar cambios'
  } finally {
    loadingSave.value = false
  }
}

async function suscribirse(plan) {
  loadingSub.value = plan
  error.value = ''
  try {
    const res = await SubscriptionService.createCheckoutSession(plan)
    if (res.url) window.location.href = res.url
    else throw new Error('No se recibió URL de pago')
  } catch (e) {
    console.error(e)
    error.value = e.response?.data?.message || 'Error al conectar con la pasarela de pago'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loadingSub.value = null
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
