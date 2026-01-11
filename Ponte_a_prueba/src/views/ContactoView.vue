<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md md:max-w-3xl rounded-2xl shadow-xl p-6 md:p-12">
        <h2 class="text-center text-[#546E7A] font-bold text-lg mb-8">
          Página de contacto
        </h2>

        <form @submit.prevent="enviarMensaje" class="space-y-6">

          <!-- Honeypot anti-bots -->
          <input
            type="text"
            v-model="form.website"
            class="hidden"
            tabindex="-1"
            autocomplete="off"
          />

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <input
              v-model="form.nombre"
              type="text"
              class="w-full p-3 border border-gray-300 rounded-lg"
              :placeholder="userStore.user ? userStore.user.username : 'Nombre'"
            />
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Correo electrónico"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Asunto</label>
            <select
              v-model="form.asunto"
              class="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option disabled value="">Selecciona un asunto</option>
              <option>Soporte técnico</option>
              <option>Consulta general</option>
              <option>Sugerencias</option>
              <option>Otros</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">Mensaje</label>
            <textarea
              v-model="form.mensaje"
              rows="5"
              class="w-full p-3 border border-gray-300 rounded-lg resize-none"
              placeholder="Escriba aqui su problema."
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
          >
            {{ loading ? "Enviando..." : "Enviar mensaje" }}
          </button>

          <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-center text-sm">Mensaje enviado correctamente</p>

        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue"
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
