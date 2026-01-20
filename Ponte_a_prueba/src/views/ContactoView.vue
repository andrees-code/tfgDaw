<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>

      <div class="absolute top-[15%] left-[5%] text-slate-800 text-8xl opacity-30 animate-float will-change-transform" aria-hidden="true">
        @
      </div>
      <div class="absolute bottom-[20%] right-[10%] text-indigo-900 text-8xl opacity-30 animate-float animation-delay-1000 will-change-transform" aria-hidden="true">
        ✉️
      </div>
    </div>

    <div class="relative z-20">
        <Header />
    </div>

    <div class="flex-grow w-full flex justify-center items-start px-4 py-12 relative z-10 animate-fade-in-up">

      <main class="w-full max-w-5xl">

        <div class="text-center mb-12">
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Contacto
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">.</span>
          </h1>
          <p class="mt-4 text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            ¿Tienes alguna duda o sugerencia? Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          <aside class="space-y-6">
            <div class="group bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
              <h3 class="font-bold text-slate-200 mb-4 flex items-center gap-3 text-lg">
                <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all">
                    <i class="fa-solid fa-envelope-open-text" aria-hidden="true"></i>
                </div>
                Atención al usuario
              </h3>
              <p class="text-sm text-slate-400 leading-relaxed pl-13">
                Nuestro equipo revisa los mensajes de forma diaria. Normalmente respondemos en menos de 24 horas.
              </p>
            </div>

            <div class="group bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl hover:border-indigo-500/30 transition-all duration-300">
              <h3 class="font-bold text-slate-200 mb-4 flex items-center gap-3 text-lg">
                <div class="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-white group-hover:bg-indigo-500 transition-all">
                    <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
                </div>
                Seguridad y privacidad
              </h3>
              <p class="text-sm text-slate-400 leading-relaxed pl-13">
                Tu información se utiliza exclusivamente para responder a tu consulta. No compartimos tus datos.
              </p>
            </div>
          </aside>

          <section class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-70"></div>

            <form @submit.prevent="enviarMensaje" class="space-y-6">

              <input type="text" v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

              <div class="group">
                <label for="contact-name" class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 ml-1">Nombre</label>
                <div class="relative">
                    <input
                    id="contact-name"
                    v-model="form.nombre"
                    type="text"
                    class="w-full rounded-xl bg-slate-950/50 border border-white/10 px-4 py-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all"
                    :placeholder="userPlaceholder"
                    />
                </div>
              </div>

              <div class="group">
                <label for="contact-email" class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 ml-1">Correo electrónico</label>
                <input
                  id="contact-email"
                  v-model="form.email"
                  type="email"
                  class="w-full rounded-xl bg-slate-950/50 border border-white/10 px-4 py-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div class="group">
                <label for="contact-subject" class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 ml-1">Asunto</label>
                <div class="relative">
                    <select
                    id="contact-subject"
                    v-model="form.asunto"
                    class="w-full rounded-xl bg-slate-950/50 border border-white/10 px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                    <option disabled value="" class="bg-slate-900 text-slate-500">Selecciona un asunto</option>
                    <option class="bg-slate-900 text-slate-300">Soporte técnico</option>
                    <option class="bg-slate-900 text-slate-300">Consulta general</option>
                    <option class="bg-slate-900 text-slate-300">Sugerencias</option>
                    <option class="bg-slate-900 text-slate-300">Otros</option>
                    </select>
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs" aria-hidden="true">▼</div>
                </div>
              </div>

              <div class="group">
                <label for="contact-message" class="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 ml-1">Mensaje</label>
                <textarea
                  id="contact-message"
                  v-model="form.mensaje"
                  rows="5"
                  class="w-full rounded-xl bg-slate-950/50 border border-white/10 px-4 py-3 text-slate-200 placeholder-slate-500 resize-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 focus:bg-slate-900 outline-none transition-all custom-scrollbar"
                  placeholder="Cuéntanos en qué podemos ayudarte..."
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 relative overflow-hidden group"
              >
                <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span class="relative z-10">{{ loading ? 'Enviando mensaje...' : 'Enviar mensaje' }}</span>
              </button>

              <div v-if="error" class="text-center mt-2 animate-shake" role="alert">
                  <p class="inline-block text-red-400 bg-red-900/20 px-3 py-1 rounded-lg border border-red-500/20 text-sm">
                      <i class="fa-solid fa-circle-exclamation mr-1" aria-hidden="true"></i> {{ error }}
                  </p>
              </div>
              <div v-if="success" class="text-center mt-2 animate-fade-in-up" role="status">
                  <p class="inline-block text-green-400 bg-green-900/20 px-3 py-1 rounded-lg border border-green-500/20 text-sm">
                      <i class="fa-solid fa-check mr-1" aria-hidden="true"></i> Mensaje enviado correctamente
                  </p>
              </div>
            </form>
          </section>
        </div>
      </main>

    </div>

    <div class="relative z-20">
        <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import emailjs from "emailjs-com"
import Header from "@/components/HeaderCompleto.vue"
import Footer from '@/components/FooterComponent.vue'
import { userStore } from '@/stores/userStores'

const loading = ref(false)
const error = ref(null)
const success = ref(false)

const form = ref({
  nombre: "",
  email: "",
  asunto: "",
  mensaje: "",
  website: "" // honeypot
})

// Computed para placeholder (más seguro que en template)
const userPlaceholder = computed(() => {
    return userStore.user ? userStore.user.username : 'Tu nombre'
})

onMounted(() => {
  // ✅ SEO: Títulos dinámicos
  document.title = "Contacto - PonteAprobados";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Contacta con el equipo de PonteAprobados para resolver tus dudas o enviarnos sugerencias.";
})

// --- LOGICA FORMULARIO ---

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)
}

function validarFormulario() {
  if (!form.value.nombre || !form.value.email || !form.value.asunto || !form.value.mensaje) {
    error.value = "Completa todos los campos"
    return false
  }
  if (!emailValido(form.value.email)) {
    error.value = "El correo electrónico no es válido"
    return false
  }
  return true
}

const LIMITE_ENVIOS = 3
const BLOQUEO_MINUTOS = 15

function puedeEnviar() {
  const ahora = Date.now()
  const datos = JSON.parse(localStorage.getItem("contacto_envios") || "[]")
  const recientes = datos.filter(t => ahora - t < BLOQUEO_MINUTOS * 60 * 1000)
  if (recientes.length >= LIMITE_ENVIOS) return false
  recientes.push(ahora)
  localStorage.setItem("contacto_envios", JSON.stringify(recientes))
  return true
}

function obtenerTokenRecaptcha() {
  return new Promise((resolve) => {
    if (!window.grecaptcha) return resolve(null)
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "contacto" })
        .then(resolve)
        .catch(() => resolve(null))
    })
  })
}

const avatarMap = {
  "Soporte técnico": "🛠️",
  "Consulta general": "❓",
  "Sugerencias": "💡",
  "Otros": "📬"
}

async function enviarMensaje() {
  error.value = null
  success.value = false

  if (form.value.website) return // honeypot
  if (!validarFormulario()) return
  if (!puedeEnviar()) {
    error.value = "Has alcanzado el límite de mensajes. Inténtalo más tarde."
    return
  }

  loading.value = true
  try {
    const recaptchaToken = await obtenerTokenRecaptcha()

    const templateParams = {
      name: form.value.nombre,
      email: form.value.email,
      subject: form.value.asunto,
      message: form.value.mensaje,
      time: new Date().toLocaleString("es-ES"),
      recaptcha: recaptchaToken,
      avatar: avatarMap[form.value.asunto] || "👤"
    }

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    const autoReplyParams = {
      name: form.value.nombre,
      email: form.value.email,
      subject: form.value.asunto,
      message: form.value.mensaje
    }

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_AUTOREPLY_ID,
      autoReplyParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    success.value = true
    form.value = { nombre: "", email: "", asunto: "", mensaje: "", website: "" }

  } catch (e) {
    console.error(e)
    error.value = "Error al enviar el mensaje. Inténtalo más tarde."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Scrollbar Personalizado (Dark) */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #64748b; }

/* Patrón de fondo (Grid Blanco SVG) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Optimización GPU */
.will-change-transform {
    will-change: transform;
}

/* Animaciones */
.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-1000 {
  animation-delay: 1s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

/* Keyframes */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>