<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
    <Header />

    <div class="flex-grow w-full flex justify-center items-start px-4 py-12">

      <main class="w-full max-w-5xl">
        <div class="text-center mb-10">
          <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Contacto</h1>
          <p class="mt-2 text-slate-500 max-w-xl mx-auto">
            ¿Tienes alguna duda o sugerencia? Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <aside class="space-y-6">
            <div class="bg-white rounded-2xl shadow-sm border p-6">
              <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-envelope-open-text text-blue-500"></i>
                Atención al usuario
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Nuestro equipo revisa los mensajes de forma diaria. Normalmente respondemos en menos de 24 horas.
              </p>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border p-6">
              <h3 class="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <i class="fa-solid fa-shield-halved text-blue-500"></i>
                Seguridad y privacidad
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Tu información se utiliza exclusivamente para responder a tu consulta. No compartimos tus datos.
              </p>
            </div>
          </aside>

          <section class="bg-white rounded-2xl shadow-sm border p-8">
            <form @submit.prevent="enviarMensaje" class="space-y-6">

              <input type="text" v-model="form.website" class="hidden" tabindex="-1" autocomplete="off" />

              <div>
                <label class="block text-sm font-medium text-slate-600">Nombre</label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  :placeholder="userStore.user ? userStore.user.username : 'Tu nombre'"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600">Correo electrónico</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600">Asunto</label>
                <select
                  v-model="form.asunto"
                  class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option disabled value="">Selecciona un asunto</option>
                  <option>Soporte técnico</option>
                  <option>Consulta general</option>
                  <option>Sugerencias</option>
                  <option>Otros</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-600">Mensaje</label>
                <textarea
                  v-model="form.mensaje"
                  rows="5"
                  class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Cuéntanos en qué podemos ayudarte"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {{ loading ? 'Enviando mensaje...' : 'Enviar mensaje' }}
              </button>

              <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
              <p v-if="success" class="text-green-600 text-center text-sm">Mensaje enviado correctamente</p>
            </form>
          </section>
        </div>
      </main>

    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue" // Se ha eliminado onMounted ya que solo se usaba para ads
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

// --- PUBLICIDAD ELIMINADA ---
// Se han borrado las referencias leftAd, rightAd, onMounted y las funciones de carga.

// --- LOGICA FORMULARIO ---

// Validación de email
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

// Límite de envíos
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

// reCAPTCHA v3
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

// Avatares según asunto
const avatarMap = {
  "Soporte técnico": "🛠️",
  "Consulta general": "❓",
  "Sugerencias": "💡",
  "Otros": "📬"
}

// Envío
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

    // 1️⃣ Correo al equipo
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    // 2️⃣ Auto-reply al usuario
    const autoReplyParams = {
      name: form.value.nombre,
      email: form.value.email,
      subject: form.value.asunto,
      message: form.value.mensaje
    }

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_AUTOREPLY_ID, // plantilla auto-reply
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