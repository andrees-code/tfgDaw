<template>
  <div class="min-h-screen font-sans text-slate-300 bg-slate-950 relative overflow-hidden selection:bg-indigo-500 selection:text-white pb-20">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
       <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

       <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-screen"></div>
       <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen"></div>
       <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen"></div>
    </div>

    <Header class="relative z-20" />

    <main class="mx-auto max-w-6xl px-4 py-8 lg:py-12 relative z-10">

      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 justify-center md:justify-start drop-shadow-lg">
            <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Ajustes de Cuenta</span>
        </h1>
        <p class="text-slate-400 mt-2 text-lg">Gestiona tu perfil, seguridad y plan de facturación.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <aside class="lg:col-span-4 xl:col-span-3">
          <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sticky top-24 overflow-hidden group hover:border-indigo-500/30 transition-colors ring-1 ring-white/5">

            <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-indigo-500/20 to-transparent opacity-50"></div>

            <div class="relative flex flex-col items-center text-center pt-4">
              <div class="relative group/avatar">
                <div v-if="loadingAvatar" class="absolute inset-0 flex items-center justify-center bg-slate-950/60 rounded-full z-10 backdrop-blur-sm">
                   <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></span>
                </div>

                <img
                  :src="previewFoto || userStore.user.avatar || fotoPlaceholder"
                  class="w-32 h-32 rounded-full object-cover border-4 border-slate-900 ring-2 ring-indigo-500/50 shadow-xl bg-slate-800"
                />

                <label
                  for="foto"
                  class="absolute bottom-0 right-0 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-indigo-500 hover:scale-110 transition-all ring-4 ring-slate-900 border border-white/10"
                  title="Cambiar foto"
                >
                  <i class="fa-solid fa-camera text-sm"></i>
                </label>
                <input id="foto" type="file" accept="image/*" class="hidden" @change="updateAvatar" />
              </div>

              <h2 class="mt-4 text-xl font-bold text-white">{{ userStore.user.username || 'Usuario' }}</h2>
              <p class="text-sm text-slate-400 font-medium">{{ userStore.user.email }}</p>

              <p v-if="msgAvatar" class="text-xs text-green-400 mt-2 font-medium animate-fade-in-up">{{ msgAvatar }}</p>
              <p v-if="errAvatar" class="text-xs text-red-400 mt-2 animate-shake">{{ errAvatar }}</p>

              <div
                class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider"
                :class="activePlan === 'free' ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]'"
              >
                  <i v-if="activePlan !== 'free'" class="fa-solid fa-crown mr-1.5 text-xs"></i>
                  {{ activePlanDisplay }}
              </div>
            </div>

            <nav class="mt-8 space-y-2">
              <a href="#general" class="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl font-medium transition-all hover:bg-indigo-500/20">
                <i class="fa-regular fa-user w-5"></i> General
              </a>
              <a href="#billing" class="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition-colors border border-transparent">
                <i class="fa-regular fa-credit-card w-5"></i> Facturación
              </a>
            </nav>
          </div>
        </aside>

        <section class="lg:col-span-8 xl:col-span-9 space-y-8">

          <div id="general" class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 scroll-mt-32 shadow-2xl relative overflow-hidden">
            <div class="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-900/20">
                  <i class="fa-regular fa-id-card text-xl"></i>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Información Personal</h3>
                  <p class="text-sm text-slate-400">Actualiza tus datos de identificación</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="updateInfo" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Nombre de usuario</label>
                  <input
                    v-model="username"
                    type="text"
                    class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900 transition-all outline-none placeholder-slate-600"
                    placeholder="Tu nombre"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Correo electrónico</label>
                  <input
                    v-model="email"
                    type="email"
                    class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:bg-slate-900 transition-all outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              <div class="flex items-center gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  :disabled="loadingInfo"
                  class="px-6 py-3 bg-white hover:bg-slate-200 text-slate-900 rounded-xl font-bold shadow-lg shadow-white/5 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm hover:-translate-y-0.5"
                >
                  <span v-if="loadingInfo" class="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-slate-900"></span>
                  {{ loadingInfo ? 'Guardando...' : 'Guardar Información' }}
                </button>

                <transition name="fade">
                  <p v-if="msgInfo" class="text-green-400 text-sm font-medium flex items-center"><i class="fa-solid fa-check-circle mr-1.5"></i> {{ msgInfo }}</p>
                </transition>
                <transition name="fade">
                  <p v-if="errInfo" class="text-red-400 text-sm font-medium flex items-center"><i class="fa-solid fa-circle-exclamation mr-1.5"></i> {{ errInfo }}</p>
                </transition>
              </div>
            </form>
          </div>

          <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
              <div class="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
              <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30 shadow-lg shadow-purple-900/20">
                <i class="fa-solid fa-lock text-xl"></i>
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Contraseña y Seguridad</h3>
                <p class="text-sm text-slate-400">Mantén tu cuenta protegida</p>
              </div>
            </div>

            <form @submit.prevent="updatePassword" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Nueva contraseña</label>
                  <input v-model="password" type="password" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-slate-900 transition-all outline-none placeholder-slate-600" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold uppercase text-slate-500 ml-1 tracking-wider">Confirmar contraseña</label>
                  <input v-model="passwordConfirm" type="password" placeholder="••••••••" class="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 focus:bg-slate-900 transition-all outline-none placeholder-slate-600" />
                </div>
              </div>

              <div class="flex items-center gap-4 pt-4 border-t border-white/5">
                <button
                  type="submit"
                  :disabled="loadingPass || !password"
                  class="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all flex items-center gap-2 text-sm hover:-translate-y-0.5"
                >
                  <span v-if="loadingPass" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                  {{ loadingPass ? 'Actualizando...' : 'Actualizar Contraseña' }}
                </button>

                <transition name="fade">
                  <p v-if="msgPass" class="text-green-400 text-sm font-medium flex items-center"><i class="fa-solid fa-check-circle mr-1.5"></i> {{ msgPass }}</p>
                </transition>
                <transition name="fade">
                  <p v-if="errPass" class="text-red-400 text-sm font-medium flex items-center"><i class="fa-solid fa-circle-exclamation mr-1.5"></i> {{ errPass }}</p>
                </transition>
              </div>
            </form>
          </div>

          <div id="billing" class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden relative scroll-mt-32 shadow-2xl">
            <div class="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <i class="fa-solid fa-gem text-9xl text-white"></i>
            </div>

            <div class="relative z-10 mb-8">
              <h3 class="text-xl font-bold text-white">Planes de Suscripción</h3>
              <p class="text-slate-400">Estado actual: <strong class="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{{ activePlanDisplay }}</strong></p>
            </div>

           <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

             <div class="rounded-2xl border p-6 flex flex-col items-start transition-all duration-300"
                  :class="activePlan === 'free' ? 'bg-slate-800/80 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-slate-950/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60'">
               <span class="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded mb-4 tracking-wider border border-white/5">BÁSICO</span>
               <h4 class="text-2xl font-bold text-slate-200">Gratis</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-white">0€</span>
                 <span class="text-slate-500">/mes</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                 <li class="flex items-center gap-2 text-sm text-slate-400"><i class="fa-solid fa-check text-slate-500"></i> Acceso básico</li>
               </ul>
               <button disabled class="w-full py-2.5 rounded-xl font-bold border border-white/10 text-slate-500 bg-transparent cursor-default">
                 {{ activePlan === 'free' ? 'Plan Actual' : 'Incluido' }}
               </button>
             </div>

             <div class="rounded-2xl border p-6 flex flex-col items-start transition-all duration-300 group relative overflow-hidden"
                  :class="activePlan === 'monthly' ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-slate-900/40 border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/60'">

               <div v-if="activePlan === 'monthly'" class="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>

               <span class="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded mb-4 tracking-wider border border-indigo-500/20">PRO</span>
               <h4 class="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">Mensual</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-white">10€</span>
                 <span class="text-slate-500">/mes</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                 <li class="flex items-center gap-2 text-sm text-slate-300"><i class="fa-solid fa-check text-indigo-400"></i> Sin publicidad</li>
                 <li class="flex items-center gap-2 text-sm text-slate-300"><i class="fa-solid fa-check text-indigo-400"></i> Exámenes ilimitados</li>
               </ul>
               <button
                 @click="suscribirse('monthly')"
                 :disabled="activePlan === 'monthly' || loadingSub === 'monthly'"
                 class="w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 relative z-10"
                 :class="activePlan === 'monthly' ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5'"
               >
                 <span v-if="loadingSub === 'monthly'" class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
                 <span v-else>
                    <i v-if="activePlan === 'monthly'" class="fa-solid fa-check mr-2"></i>
                    {{ activePlan === 'monthly' ? 'Activo' : 'Elegir Mensual' }}
                 </span>
               </button>
             </div>

             <div class="rounded-2xl border-2 p-6 flex flex-col items-start shadow-xl relative overflow-hidden transform transition-all duration-300"
                  :class="activePlan === 'yearly' ? 'bg-green-900/10 border-green-500 ring-1 ring-green-500/50' : 'bg-slate-900/60 border-indigo-500/50 hover:border-indigo-400 hover:-translate-y-1 shadow-indigo-500/10'">

               <div class="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                 AHORRA 20%
               </div>
               <span class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded mb-4 tracking-wider shadow-lg shadow-indigo-900/40">RECOMENDADO</span>

               <h4 class="text-2xl font-bold text-white">Anual</h4>
               <div class="mt-2 mb-6">
                 <span class="text-4xl font-bold text-white">99€</span>
                 <span class="text-slate-500">/año</span>
               </div>
               <ul class="space-y-3 mb-8 flex-1">
                <li class="flex items-center gap-2 text-sm text-slate-300"><i class="fa-solid fa-check text-green-400"></i> Sin publicidad</li>
                <li class="flex items-center gap-2 text-sm text-slate-300"><i class="fa-solid fa-check text-green-400"></i> Exámenes ilimitados</li>
                 <li class="flex items-center gap-2 text-sm text-slate-300"><i class="fa-solid fa-check text-green-400"></i> 2 meses gratis</li>
               </ul>
               <button
                 @click="suscribirse('yearly')"
                 :disabled="activePlan === 'yearly' || loadingSub === 'yearly'"
                 class="w-full py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                 :class="activePlan === 'yearly' ? 'bg-green-600 text-white cursor-default shadow-green-500/30' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 shadow-indigo-500/30'"
               >
                 <span v-if="loadingSub === 'yearly'" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                 <span v-else>
                     <i v-if="activePlan === 'yearly'" class="fa-solid fa-check mr-2"></i>
                     {{ activePlan === 'yearly' ? 'Activo' : 'Elegir Anual' }}
                 </span>
               </button>
             </div>

            </div>

             <div class="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p class="text-sm text-slate-400 italic">¿Prefieres hacer una aportación única?</p>
              <router-link to="/paypal" class="inline-flex items-center gap-2 text-slate-300 hover:text-[#003087] hover:bg-[#003087]/10 font-bold transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:border-[#003087]/30">
                <i class="fab fa-paypal text-xl text-[#003087]"></i> Donar con PayPal
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

// ... (TU LÓGICA PERMANECE EXACTAMENTE IGUAL)
const fotoPlaceholder = '/img/perfil.jpg'
const previewFoto = ref(null)

const username = ref('')
const email = ref('')

const password = ref('')
const passwordConfirm = ref('')

const msgInfo = ref('')
const errInfo = ref('')
const loadingInfo = ref(false)

const msgPass = ref('')
const errPass = ref('')
const loadingPass = ref(false)

const msgAvatar = ref('')
const errAvatar = ref('')
const loadingAvatar = ref(false)

const loadingSub = ref(null)

const activePlan = ref('free')

const activePlanDisplay = computed(() => {
  if (activePlan.value === 'monthly') return 'Pro Mensual'
  if (activePlan.value === 'yearly') return 'Pro Anual'
  return 'Plan Gratuito'
})

onMounted(async () => {
  await userStore.loadSession()
  if (userStore.user) {
    cargarDatosLocales()
    await refreshSubscriptionStatus()
  }
})

function cargarDatosLocales() {
  username.value = userStore.user.username
  email.value = userStore.user.email
  if (userStore.user.plan) {
    activePlan.value = userStore.user.plan
  } else if (userStore.user.subscription?.plan) {
    activePlan.value = userStore.user.subscription.plan
  }
}

async function refreshSubscriptionStatus() {
    try {
        const res = await SubscriptionService.getPremiumContent()
        let planDetectado = 'free'
        if (res?.plan) planDetectado = res.plan
        else if (res?.data?.plan) planDetectado = res.data.plan
        if (activePlan.value !== planDetectado) {
            activePlan.value = planDetectado
            userStore.updateUser({ ...userStore.user, plan: planDetectado })
        }
    } catch (e) {
        console.warn("Usando caché local para suscripción.")
    }
}

function formatError(errorResponse) {
    if (!errorResponse) return 'Error desconocido'
    if (Array.isArray(errorResponse.message)) {
        return errorResponse.message.join(', ')
    }
    return errorResponse.message || 'Error al procesar la solicitud'
}

async function updateAvatar(e) {
  const file = e.target.files[0]
  if (!file) return

  loadingAvatar.value = true
  msgAvatar.value = ''
  errAvatar.value = ''

  previewFoto.value = URL.createObjectURL(file)

  try {
    const updatedUser = await updateProfile(userStore.user._id, { avatar: file })
    userStore.updateUser({ ...userStore.user, avatar: updatedUser.avatar })
    msgAvatar.value = 'Foto actualizada'
    setTimeout(() => msgAvatar.value = '', 3000)
  } catch (e) {
    console.error(e)
    errAvatar.value = formatError(e.response?.data)
    previewFoto.value = null
  } finally {
    loadingAvatar.value = false
  }
}

async function updateInfo() {
  if (!username.value || !email.value) {
    errInfo.value = 'Nombre y correo son obligatorios'
    return
  }
  loadingInfo.value = true
  errInfo.value = ''
  msgInfo.value = ''
  try {
    const updateData = { username: username.value, email: email.value }
    const updatedUser = await updateProfile(userStore.user._id, updateData)
    userStore.updateUser({ ...userStore.user, username: updatedUser.username, email: updatedUser.email })
    msgInfo.value = 'Información guardada'
    setTimeout(() => msgInfo.value = '', 3000)
  } catch (e) {
    console.error(e)
    errInfo.value = formatError(e.response?.data)
  } finally {
    loadingInfo.value = false
  }
}

async function updatePassword() {
  if (password.value !== passwordConfirm.value) {
    errPass.value = 'Las contraseñas no coinciden'
    return
  }
  if (!password.value) {
      errPass.value = 'Introduce una contraseña'
      return
  }
  loadingPass.value = true
  errPass.value = ''
  msgPass.value = ''
  try {
    const updatedUser = await updateProfile(userStore.user._id, { password: password.value })
    let token = userStore.token
    if (updatedUser.email) {
       const loginRes = await loginUser({ email: updatedUser.email, password: password.value })
       token = loginRes.token
       userStore.setToken(token)
    }
    password.value = ''
    passwordConfirm.value = ''
    msgPass.value = 'Contraseña actualizada'
    setTimeout(() => msgPass.value = '', 3000)
  } catch (e) {
    console.error(e)
    errPass.value = formatError(e.response?.data)
  } finally {
    loadingPass.value = false
  }
}

async function suscribirse(plan) {
  loadingSub.value = plan
  try {
    const res = await SubscriptionService.createCheckoutSession(plan)
    if (res.url) window.location.href = res.url
    else throw new Error('No se recibió URL de pago')
  } catch (e) {
    console.error(e)
    alert(formatError(e.response?.data))
  } finally {
    loadingSub.value = null
  }
}
</script>

<style scoped>
/* Transiciones */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.scroll-mt-32 {
    scroll-margin-top: 8rem;
}

/* Animaciones del fondo */
.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Grid Pattern (Blanco sutil para dark mode) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones utilitarias */
.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
