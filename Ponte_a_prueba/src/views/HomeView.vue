<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
    <Header />

    <main class="mx-auto max-w-[1400px] px-4 py-10">
      <div class="text-center mb-10">
        <h1 class="text-2xl md:text-3xl font-bold text-slate-800">Generador de Exámenes</h1>
        <p class="mt-2 text-slate-500 max-w-2xl mx-auto">
          Convierte tus apuntes o PDFs en exámenes personalizados en segundos.
        </p>
      </div>

      <div class="max-w-5xl mx-auto gap-8 items-start">

        <section class="bg-white rounded-2xl shadow-sm border p-8 md:p-10 w-full">
          <div class="mb-8">
            <label class="block text-sm font-medium text-slate-600 mb-2">
              Apuntes o contenido del examen
            </label>
            <textarea
              v-model="apuntes"
              rows="8"
              class="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Pega aquí tus apuntes o sube un PDF…"
            ></textarea>
          </div>

          <div class="mb-10 flex flex-col items-center gap-3">
            <label
              for="pdf-upload"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm cursor-pointer hover:bg-blue-700"
            >
              <i class="fa-solid fa-file-pdf"></i> Subir PDF
            </label>
            <span class="text-sm text-slate-500">{{ archivoNombre }}</span>
            <input id="pdf-upload" type="file" accept="application/pdf" class="hidden" @change="handlePdfUploadCustom" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Dificultad</label>
              <select
                v-model="dificultad"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option disabled value="">Selecciona dificultad</option>
                <option value="facil">Fácil</option>
                <option value="medio">Media</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-2">Número de preguntas</label>
              <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>5</span><span>20</span>
              </div>
              <input type="range" min="5" max="20" step="5" v-model.number="numPreguntas" class="w-full" />
            </div>
          </div>

          <div class="mb-10">
            <h3 class="text-sm font-medium text-slate-600 mb-4">Tipo de examen</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label
                v-for="tipo in tipos"
                :key="tipo"
                class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-blue-500"
              >
                <input type="radio" :value="tipo" v-model="tipoExamen" />
                <span class="text-sm text-slate-700">{{ tipo }}</span>
              </label>
            </div>
          </div>

          <button
            @click="manejarGeneracion"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando con IA...
            </span>
            <span v-else>Generar examen</span>
          </button>

          <div class="mt-8 flex justify-center w-full" ref="adContainer">
              </div>
          <div v-if="resultado" class="mt-8 animate-fade-in">
            <h3 class="font-semibold text-slate-800 mb-4">Examen generado</h3>
            <div class="prose max-w-none bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700" v-html="resultado.replace(/\n/g, '<br/>')"></div>

            <button
              v-if="hayRespuestas"
              @click="toggleResuelto"
              class="mt-6 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700 transition-colors"
            >
              {{ mostrarResuelto ? 'Ocultar soluciones' : 'Ver examen resuelto' }}
            </button>

            <div v-if="mostrarResuelto" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
              <h4 class="text-sm font-bold text-green-800 mb-2">Soluciones:</h4>
              <pre class="whitespace-pre-wrap text-sm text-green-900 font-sans">{{ respuestas }}</pre>
            </div>
          </div>

          <div v-if="error" class="mt-6 p-6 rounded-lg bg-red-50 border border-red-200 text-center animate-fade-in">
             <div class="mb-3 flex justify-center">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
             </div>

             <p class="text-red-800 font-semibold text-lg">{{ error }}</p>

             <div v-if="esErrorDeAuth" class="mt-4">
                <p class="text-slate-600 mb-4 text-sm">
                    Regístrate gratis para generar tus primeros 5 exámenes mensuales.
                </p>
                <button
                    @click="irAlLogin"
                    class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    Iniciar Sesión / Registrarse
                </button>
             </div>

             <div v-else-if="esErrorDeLimite" class="mt-2">
                <p class="text-sm text-red-600 mt-1">
                   Actualiza a Premium para generar exámenes ilimitados y sin esperas.
                </p>
             </div>

             <p v-else class="text-sm text-red-500 mt-2">
                 Por favor, revisa tu conexión a internet o intenta de nuevo más tarde.
             </p>
          </div>

        </section>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue' // Agregado onBeforeUnmount
import { useRouter } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import { saveExam, generateExam } from '@/services/examService'
import { userStore } from "@/stores/userStores"

const router = useRouter()

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
const esErrorDeLimite = ref(false)
const esErrorDeAuth = ref(false)

const archivoNombre = ref("Ningún archivo seleccionado")

// Referencia para la publicidad
const adContainer = ref(null)

const tipos = [
  "Test (4 opciones)",
  "Verdadero/Falso",
  "Respuestas cortas",
  "Respuestas largas",
  "Mix"
]

// Ciclo de vida: onMounted
onMounted(() => {
  // Sesión de usuario
  userStore.loadSession()

  // Worker de PDF.js
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  // --- LÓGICA DE PUBLICIDAD (Adsterra) ---
  if (!adContainer.value) return

  // 1️⃣ Limpiar el contenedor (por si Vue reusa la vista)
  adContainer.value.innerHTML = ''

  // 2️⃣ Definir atOptions ANTES de cargar el script
  window.atOptions = {
    key: '61c5ff75921e650e6548be96f6641978',
    format: 'iframe',
    height: 250,
    width: 300,
    params: {}
  }

  // 3️⃣ Crear el script de Adsterra
  const script = document.createElement('script')
  script.src = 'https://www.highperformanceformat.com/61c5ff75921e650e6548be96f6641978/invoke.js'
  script.async = true

  // 4️⃣ Insertar DIRECTAMENTE el script en el contenedor visible
  adContainer.value.appendChild(script)
})


// Ciclo de vida: onBeforeUnmount (Limpieza)
onBeforeUnmount(() => {
    // Es buena práctica limpiar las variables globales si salimos de la vista
    if (window.atOptions) {
        delete window.atOptions;
    }
})

function corregirNumeracion(texto) {
  if (!texto) return "";
  let contador = 1;
  return texto.replace(/(^|\n)\s*\d+([\.\)-])\s/g, (match, inicio, separador) => {
    return `${inicio}${contador++}${separador} `;
  });
}

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

async function guardarExamen() {
  if (!userStore.token) return
  try {
    await saveExam({
      title: `Examen ${tipoExamen.value} · ${new Date().toLocaleDateString()}`,
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: 'Apuntes procesados',
      preguntas: resultado.value,
      respuestas: respuestasInternas.value
    })
    console.log("Examen guardado correctamente en historial")
  } catch (e) {
    console.error("Error guardando examen en historial:", e)
  }
}

async function manejarGeneracion() {
  if (!apuntes.value || !dificultad.value || !tipoExamen.value) {
    error.value = "Por favor completa todos los campos (apuntes, dificultad, tipo)."
    esErrorDeLimite.value = false
    esErrorDeAuth.value = false
    return
  }

  if (!userStore.token) {
      error.value = "Debes iniciar sesión para generar exámenes."
      esErrorDeAuth.value = true
      esErrorDeLimite.value = false
      return
  }

  loading.value = true
  error.value = null
  esErrorDeLimite.value = false
  esErrorDeAuth.value = false
  resultado.value = ""
  respuestas.value = ""
  respuestasInternas.value = ""
  mostrarResuelto.value = false
  hayRespuestas.value = false

  try {
    const data = await generateExam({
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: apuntes.value
    });

    resultado.value = corregirNumeracion(data.preguntas);
    respuestasInternas.value = corregirNumeracion(data.respuestas);

    hayRespuestas.value = true;

    await guardarExamen();

  } catch (e) {
    console.error("Error en generación:", e);

    if (e.response) {
        if (e.response.status === 401) {
            error.value = "Tu sesión ha expirado o no estás registrado.";
            esErrorDeAuth.value = true;
        }
        else if (e.response.status === 403) {
            error.value = e.response.data.message || "Has alcanzado el límite de exámenes para tu plan.";
            esErrorDeLimite.value = true;
        }
        else {
             error.value = "Hubo un error al generar el examen. Intenta con un texto más corto.";
        }
    } else {
        error.value = "Error de conexión con el servidor.";
    }

  } finally {
    loading.value = false;
  }
}

function toggleResuelto() {
  mostrarResuelto.value = !mostrarResuelto.value
  respuestas.value = mostrarResuelto.value ? respuestasInternas.value : ""
}

function irAlLogin() {
    router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
