<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header/>
    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md md:max-w-5xl rounded-2xl shadow-xl p-6 md:p-12">
        <h2 class="text-center text-[#546E7A] font-bold text-sm mb-3 md:text-lg">
          Pegue aquí los apuntes o suba un PDF
        </h2>

        <textarea
          v-model="apuntes"
          ref="textarea"
          @input="autoResize"
          class="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-600 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-[#3978D7]"
          placeholder="Escriba o copie un archivo PDF aquí..."
        ></textarea>

        <div class="my-6 flex flex-col items-center gap-4">
          <label
            for="pdf-upload"
            class="bg-[#3978D7] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#2d62b3]"
          >
            Subir PDF
          </label>
          <span>{{ archivoNombre }}</span>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handlePdfUploadCustom"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-16 md:items-center md:mb-6">
          <select v-model="dificultad" class="w-full border border-gray-400 rounded-lg p-2.5 text-gray-500">
            <option disabled value="">Elija la dificultad</option>
            <option value="facil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="dificil">Difícil</option>
          </select>

          <div>
            <div class="flex justify-between items-center mb-2">
              <span>5</span>
              <span class="font-semibold">Número de preguntas</span>
              <span>20</span>
            </div>
            <input type="range" min="5" max="20" step="5" v-model="numPreguntas" class="w-full" />
          </div>
        </div>

        <div class="mb-8 mt-6 flex flex-col items-center">
          <h3 class="text-center font-medium mb-6">Tipo de examen</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label v-for="tipo in tipos" :key="tipo" class="flex gap-2">
              <input type="radio" :value="tipo" v-model="tipoExamen" />
              <span>{{ tipo }}</span>
            </label>
          </div>
        </div>

        <button
          @click="generarExamen"
          :disabled="loading"
          class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
        >
          {{ loading ? "Generando..." : "Generar Examen" }}
        </button>

        <!-- RESULTADO -->
        <div v-if="resultado" class="mt-10 whitespace-pre-line grid">
          <h3 class="font-bold mb-4">Examen generado</h3>
          {{ resultado }}

          <button
            v-if="hayRespuestas"
            @click="toggleResuelto"
            class="mt-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            {{ mostrarResuelto ? "Ocultar Resuelto" : "Ver Examen Resuelto" }}
          </button>

          <div v-if="mostrarResuelto" class="mt-4 p-4 bg-gray-50 border rounded">
            <pre class="whitespace-pre-wrap font-sans">{{ respuestas }}</pre>
          </div>
        </div>

        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      </div>
    </main>
    <Footer/>
  </div>
</template>

<script setup>
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import { ref, onMounted } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import { sendChat } from '@/services/ollamaService'
import { sendChatStream } from '@/services/sendChatStream'

// ===================== VARIABLES =====================
const apuntes = ref("")
const dificultad = ref("")
const numPreguntas = ref(5)
const tipoExamen = ref("")
const loading = ref(false)
const resultado = ref("")
const respuestasInternas = ref("")
const respuestas = ref("")
const mostrarResuelto = ref(false)
const hayRespuestas = ref(false)
const error = ref(null)
const archivoNombre = ref("Ningún archivo seleccionado")

const tipos = [
  "Test (4 opciones)",
  "Verdadero/Falso",
  "Respuestas cortas",
  "Respuestas largas",
  "Mix"
]

// ===================== PDF =====================
onMounted(() => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
})

async function handlePdfUploadCustom(event) {
  const file = event.target.files[0]
  if (!file) return
  archivoNombre.value = file.name
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  let text = ""
  for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(i => i.str).join(" ") + "\n\n"
  }
  apuntes.value = text
}

// ===================== PROMPTS =====================
// Tus prompts EXACTOS
const promptPreguntas = () => { 
  const tipo = tipoExamen.value
  const num = numPreguntas.value
  const ap = apuntes.value.substring(0, 15000)
  /* TODO: Pega aquí exactamente el código de promptPreguntas que me pasaste */
}

const promptRespuestas = (preguntas) => {
  const tipo = tipoExamen.value
  const ap = apuntes.value.substring(0, 15000)
  /* TODO: Pega aquí exactamente el código de promptRespuestas que me pasaste */
}

function respuestasValidas(texto) {
  if (!texto) return false
  const t = texto.toLowerCase()
  if (t.length < 20) return false
  if (t.includes("no puedo") || t.includes("no se puede") || t.includes("faltan datos")) return false
  return true
}

// ===================== FUNCIONES =====================
async function generarExamen() {
  if (!apuntes.value || !dificultad.value || !tipoExamen.value) {
    error.value = "Completa todos los campos"
    return
  }

  loading.value = true
  error.value = null
  resultado.value = ""
  respuestas.value = ""
  respuestasInternas.value = ""
  mostrarResuelto.value = false
  hayRespuestas.value = false

  try {
    // 🟢 Generar preguntas en streaming usando tus prompts
    await sendChatStream(
      [
        { role: "system", content: "Eres un profesor experto." },
        { role: "user", content: promptPreguntas() }
      ],
      (chunk) => {
        resultado.value += chunk
      },
      () => {
        resultado.value = resultado.value.trim()
      }
    )

    // 🔁 Generar respuestas normalmente
    let respuestasTexto = ""
    let intentos = 0
    while (!respuestasValidas(respuestasTexto) && intentos < 2) {
      const respuestasData = await sendChat([
        { role: "system", content: "Eres un profesor experto." },
        { role: "user", content: promptRespuestas(resultado.value) }
      ])
      respuestasTexto = respuestasData.message.content?.trim() || ""
      intentos++
    }
    if (!respuestasValidas(respuestasTexto)) throw new Error("Respuestas inválidas")
    respuestasInternas.value = respuestasTexto
    hayRespuestas.value = true

  } catch (e) {
    console.error(e)
    error.value = "Error al generar el examen. Inténtalo de nuevo."
  } finally {
    loading.value = false
  }
}

function toggleResuelto() {
  mostrarResuelto.value = !mostrarResuelto.value
  respuestas.value = mostrarResuelto.value ? respuestasInternas.value : ""
}
</script>
