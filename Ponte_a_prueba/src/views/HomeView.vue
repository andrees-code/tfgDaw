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

      <div class="flex flex-col xl:flex-row justify-center items-start gap-6">

        <div class="hidden xl:flex justify-center w-[160px] flex-shrink-0 sticky top-4" ref="leftAd"></div>

        <div class="w-full max-w-5xl">
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
                Generando examen...
              </span>
              <span v-else>Generar examen</span>
            </button>

            <div class="mt-8 flex justify-center w-full min-h-[60px]" ref="bottomAd"></div>

            <div v-if="resultado" class="mt-8 animate-fade-in">
                <h3 class="font-semibold text-slate-800 mb-4 text-lg">Examen generado</h3>

                <div class="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-200 text-slate-700 shadow-sm">
                   <div class="whitespace-pre-wrap leading-loose text-base md:text-lg font-medium">
                      {{ resultado }}
                   </div>
                </div>

                <button v-if="hayRespuestas" @click="toggleResuelto" class="mt-6 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-sm font-medium text-slate-700 transition-colors">
                  {{ mostrarResuelto ? 'Ocultar soluciones' : 'Ver examen resuelto' }}
                </button>

                <div v-if="mostrarResuelto" class="mt-4 bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
                  <h4 class="text-base font-bold text-green-800 mb-3 border-b border-green-200 pb-2">Soluciones:</h4>
                  <div class="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-green-900 font-sans">
                    {{ respuestas }}
                  </div>
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
                  <button @click="irAlLogin" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                      Iniciar Sesión / Registrarse
                  </button>
               </div>
               <div v-else-if="esErrorDeLimite" class="mt-2">
                  <p class="text-sm text-red-600 mt-1">Actualiza a Premium para generar exámenes ilimitados.</p>
               </div>
            </div>

          </section>
        </div>

        <div class="hidden xl:flex justify-center w-[160px] flex-shrink-0 sticky top-4" ref="rightAd"></div>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const tipos = ["Test (4 opciones)", "Verdadero/Falso", "Respuestas cortas", "Respuestas largas", "Mix"]

// --- REFERENCIAS DE PUBLICIDAD ---
const leftAd = ref(null)
const rightAd = ref(null)
const bottomAd = ref(null)

onMounted(() => {
  userStore.loadSession()
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  cargarAnuncios()
})

// --- PUBLICIDAD ---
function cargarAnuncios() {
  const sideConfig = { key: 'c767c5331b742c5410e5e3d193dc4291', format: 'iframe', height: 600, width: 160, params: {} }
  const sideScript = 'https://www.highperformanceformat.com/c767c5331b742c5410e5e3d193dc4291/invoke.js'

  const width = window.innerWidth
  let bottomConfig = {}
  let bottomScript = ''

  if (width >= 500) {
    bottomConfig = { key: 'a5b39c8d227fe8cf72a19bb7e4c104ed', format: 'iframe', height: 60, width: 468, params: {} }
    bottomScript = 'https://www.highperformanceformat.com/a5b39c8d227fe8cf72a19bb7e4c104ed/invoke.js'
  } else {
    bottomConfig = { key: '61c5ff75921e650e6548be96f6641978', format: 'iframe', height: 250, width: 300, params: {} }
    bottomScript = 'https://www.highperformanceformat.com/61c5ff75921e650e6548be96f6641978/invoke.js'
  }

  renderAdInIframe(leftAd.value, sideConfig, sideScript)
  renderAdInIframe(rightAd.value, sideConfig, sideScript)
  renderAdInIframe(bottomAd.value, bottomConfig, bottomScript)
}

function renderAdInIframe(container, config, scriptUrl) {
  if (!container) return;
  container.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.style.width = config.width + 'px';
  iframe.style.height = config.height + 'px';
  iframe.style.border = '0';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = 'no';
  container.appendChild(iframe);
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`<html><body style="margin:0;padding:0;background-color:transparent;"><script>var atOptions = ${JSON.stringify(config)};<\/script><script type="text/javascript" src="${scriptUrl}"><\/script></body></html>`);
  doc.close();
}

// --- LÓGICA DE PDF ---
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

// --- LÓGICA DEL EXAMEN ---

/**
 * Función CLAVE: Formatea el texto para darle "aire".
 * 1. Separa las preguntas con doble salto de línea.
 * 2. Separa las opciones (a, b, c, d) a su propia línea.
 */
function darFormatoVisual(texto) {
  if (!texto) return "";

  let t = texto;

  // 1. Corregir numeración básica (por si acaso viene rota tipo "1-")
  let contador = 1;
  t = t.replace(/(^|\n)\s*\d+([\.\)-])\s/g, (match, inicio, separador) => {
    return `${inicio}${contador++}. `;
  });

  // 2. Asegurar que las opciones (a), b), etc.) tengan un salto de línea antes.
  //    Busca: un espacio, seguido de letra+paréntesis. Reemplaza con salto de línea.
  t = t.replace(/(\s)([a-e]\))/g, "\n   $2");

  // 3. Separación GRANDE entre preguntas.
  //    Busca: Un salto de línea (o inicio) seguido de un número y punto (ej: "2.").
  //    Reemplaza con: Dos saltos de línea extra para crear el hueco.
  t = t.replace(/(\n)(\d+\.)/g, "\n\n\n$2");

  return t;
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
  } catch (e) {
    console.error("Error guardando examen:", e)
  }
}

async function manejarGeneracion() {
  if (!apuntes.value || !dificultad.value || !tipoExamen.value) {
    error.value = "Por favor completa todos los campos."
    return
  }
  if (!userStore.token) {
      error.value = "Debes iniciar sesión."
      esErrorDeAuth.value = true
      return
  }
  loading.value = true
  error.value = null
  resultado.value = ""
  respuestas.value = ""
  try {
    const data = await generateExam({
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: apuntes.value
    });

    // APLICAMOS EL NUEVO FORMATO AQUÍ
    resultado.value = darFormatoVisual(data.preguntas);
    respuestasInternas.value = darFormatoVisual(data.respuestas);

    hayRespuestas.value = true;
    await guardarExamen();
  } catch (e) {
    if (e.response && e.response.status === 403) {
        error.value = "Has alcanzado el límite de exámenes.";
        esErrorDeLimite.value = true;
    } else {
        error.value = "Error al generar el examen.";
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
