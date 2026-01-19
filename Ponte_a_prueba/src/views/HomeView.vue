<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-600 bg-[#f8fafc] overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-700">

    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow w-full mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">

      <div class="animate-fade-in-up">

        <div class="text-center mb-10">
          <span class="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-3 border border-indigo-100">
            Herramienta IA
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 flex items-center justify-center gap-1">
            Generador de
            <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Exámenes
              <span class="absolute -top-1 -right-3 flex h-3 w-3 cursor-pointer" @click="irAlModoReto" title="Nueva funcionalidad disponible">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </span>
          </h1>
          <p class="text-slate-500 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Convierte tus apuntes o PDFs en exámenes personalizados en segundos.
          </p>
        </div>

        <div class="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-white/50 p-6 md:p-10 relative overflow-hidden">

          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div class="space-y-8">

            <div class="group relative">
              <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Fuente de conocimiento</label>
              <div class="relative transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-lg rounded-2xl h-64">
                <textarea
                  v-model="apuntes"
                  class="w-full h-full rounded-2xl bg-slate-50/50 border border-slate-200 px-6 py-5 text-slate-700 resize-none placeholder:text-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-base shadow-inner relative z-10"
                ></textarea>

                <div v-if="!apuntes && archivoNombre === 'Ningún archivo seleccionado'" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 gap-3 z-0">
                  <div class="w-14 h-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 mb-2">
                    <i class="fa-solid fa-pen-nib text-xl"></i>
                  </div>
                  <span class="font-medium text-slate-400">Pega tus apuntes aquí</span>
                </div>
              </div>
            </div>

            <div class="group border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-2xl p-4 transition-all duration-300">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                       :class="archivoNombre !== 'Ningún archivo seleccionado' ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'">
                    <i class="fa-solid fa-file-pdf text-2xl"></i>
                  </div>
                  <div class="min-w-0">
                      <p class="font-bold text-slate-700 truncate max-w-[150px] md:max-w-xs">
                        {{ archivoNombre !== 'Ningún archivo seleccionado' ? archivoNombre : '¿Prefieres usar un PDF?' }}
                      </p>
                      <p class="text-slate-400 text-xs mt-0.5">
                        {{ archivoNombre !== 'Ningún archivo seleccionado' ? 'Archivo cargado correctamente' : 'Hasta 50 páginas' }}
                      </p>
                  </div>
                </div>
                <label
                  for="pdf-upload"
                  class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Explorar
                </label>
                <input id="pdf-upload" type="file" accept="application/pdf" class="hidden" @change="handlePdfUploadCustom" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

              <div>
                <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Nivel de desafío</label>
                <div class="flex bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    v-for="dif in ['facil', 'medio', 'dificil']"
                    :key="dif"
                    @click="dificultad = dif"
                    :class="[
                      'flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize',
                      dificultad === dif
                        ? 'bg-white text-indigo-600 shadow-md transform scale-[1.02]'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                    ]"
                  >
                    {{ dif }}
                  </button>
                </div>
              </div>

              <div>
                <label class="flex justify-between items-center text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 pl-1">
                  <span>Cantidad</span>
                  <span class="text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-lg shadow-sm">{{ numPreguntas }} preguntas</span>
                </label>
                <div class="relative px-1 py-2">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="5"
                    v-model.number="numPreguntas"
                    :style="{ backgroundSize: ((numPreguntas - 5) * 100) / 15 + '% 100%' }"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none slider-custom"
                  />
                  <div class="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
                    <span>5</span><span>10</span><span>15</span><span>20</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
               <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Formato de preguntas</label>
               <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 <button
                   v-for="tipo in tipos"
                   :key="tipo"
                   @click="tipoExamen = tipo"
                   :class="[
                     'h-full w-full px-5 py-5 text-sm rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden group',
                     tipoExamen === tipo
                      ? 'border-indigo-500 bg-indigo-50/40 text-indigo-700 font-bold shadow-md'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/10'
                   ]"
                 >
                    <div v-if="tipoExamen === tipo" class="absolute top-0 right-0 w-8 h-8 -mr-4 -mt-4 bg-indigo-500 rotate-45 shadow-sm"></div>

                    <span class="relative z-10 flex items-center gap-2">
                      {{ tipo }}
                    </span>
                 </button>
               </div>
            </div>
          </div>

          <div class="mt-10">
            <button
              @click="manejarGeneracion"
              :disabled="loading"
              class="w-full group relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
            >
              <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

              <span v-if="loading" class="flex items-center justify-center gap-3 relative z-10">
                <svg class="animate-spin h-5 w-5 text-indigo-300" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span class="animate-pulse">Generando examen...</span>
              </span>
              <span v-else class="flex items-center justify-center gap-2 relative z-10">
                Generar Examen <i class="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform text-indigo-300"></i>
              </span>
            </button>
          </div>

          <div v-if="error" class="text-center mt-6 animate-shake">
             <div class="inline-flex items-center gap-2 bg-red-50 text-red-600 py-2 px-4 rounded-xl border border-red-100 text-sm font-medium">
               <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
             </div>
             <div v-if="esErrorDeAuth" class="mt-3">
                <button @click="irAlLogin" class="text-xs text-slate-500 underline hover:text-indigo-600">Iniciar sesión para continuar</button>
             </div>
          </div>

        </div>

        <div v-if="resultado" class="mt-12 animate-slide-up-fade">
            <div class="flex items-center justify-between mb-6 px-2">
                <h3 class="text-2xl font-bold text-slate-800">Resultado</h3>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                    Generado con éxito
                </span>
            </div>
            <div class="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
                 <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-slate-200 to-slate-100"></div>
                 <div class="p-8 md:p-10">
                    <div class="whitespace-pre-wrap leading-loose text-base md:text-lg font-medium text-slate-700 font-sans">
                      {{ resultado }}
                    </div>
                 </div>
                 <div class="bg-slate-50 border-t border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <button v-if="hayRespuestas" @click="toggleResuelto" class="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 font-bold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                        <i :class="mostrarResuelto ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
                        {{ mostrarResuelto ? 'Ocultar soluciones' : 'Ver soluciones' }}
                    </button>
                    <span class="text-xs text-slate-400 font-medium">Guardado automáticamente</span>
                 </div>
            </div>
            <div v-if="mostrarResuelto" class="mt-6 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-[2rem] p-8 md:p-10 shadow-lg animate-fade-in-up relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h4 class="flex items-center gap-2 text-lg font-bold text-green-800 mb-6 pb-4 border-b border-green-200/50">
                    <span class="w-8 h-8 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-xs"><i class="fa-solid fa-check"></i></span>
                    Hoja de Respuestas
                </h4>
                <div class="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-slate-700 font-medium">
                  {{ respuestas }}
                </div>
            </div>
        </div>

      </div>
    </main>

    <Transition name="slide-fade">
        <div v-if="mostrarNovedad" class="fixed bottom-6 right-4 md:right-8 z-50 w-full max-w-sm">
            <div
                class="relative bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_10px_40px_-10px_rgba(79,70,229,0.3)] border border-white ring-1 ring-indigo-50 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                @click="irAlModoReto"
            >
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                <button @click.stop="cerrarNovedad" class="absolute top-2 right-2 p-2 text-slate-300 hover:text-slate-500 z-10 transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="flex gap-4 items-start relative z-10">
                    <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <i class="fa-solid fa-fire text-xl animate-pulse"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-bold text-slate-800 text-sm md:text-base">Nuevo: Modo Reto</h4>
                            <span class="px-1.5 py-0.5 rounded bg-pink-100 text-pink-600 text-[10px] font-bold uppercase tracking-wide">Beta</span>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed mb-3">
                            ¡Aprende jugando! Desliza tarjetas a la derecha o izquierda.
                        </p>
                        <button class="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                            Probar ahora <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    </Transition>

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
const dificultad = ref("medio")
const numPreguntas = ref(5)
const tipoExamen = ref("Test (4 opciones)")
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
const mostrarNovedad = ref(false)

const tipos = ["Test (4 opciones)", "Verdadero/Falso", "Respuestas cortas", "Respuestas largas", "Mix"]

onMounted(() => {
  userStore.loadSession()
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  setTimeout(() => {
    const yaVisto = localStorage.getItem('novedad_reto_visto')
    if (!yaVisto) {
      mostrarNovedad.value = true
    }
  }, 2000)
})

function cerrarNovedad() {
    mostrarNovedad.value = false
    localStorage.setItem('novedad_reto_visto', 'true')
}

function irAlModoReto() {
    router.push('/modotinder')
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

function darFormatoVisual(texto) {
  if (!texto) return "";
  let t = texto;
  let contador = 1;
  t = t.replace(/(^|\n)\s*\d+([\.\)-])\s/g, (match, inicio, separador) => {
    return `${inicio}${contador++}. `;
  });
  t = t.replace(/(\s)([a-e]\))/g, "\n   $2");
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
  mostrarResuelto.value = false

  try {
    const data = await generateExam({
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: apuntes.value
    });
    resultado.value = darFormatoVisual(data.preguntas);
    respuestasInternas.value = darFormatoVisual(data.respuestas);
    hayRespuestas.value = true;
    await guardarExamen();
  } catch (e) {
    if (e.response && e.response.status === 403) {
        error.value = "Límite alcanzado.";
        esErrorDeLimite.value = true;
    } else {
        error.value = "Error generando el examen.";
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
/* Estilo para el slider con progreso de color */
.slider-custom {
  background-image: linear-gradient(#4f46e5, #4f46e5); /* Indigo 600 */
  background-repeat: no-repeat;
  /* background-size se calcula dinámicamente en el template */
}
.slider-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  transition: all 0.1s ease-in-out;
}
.slider-custom::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(79, 70, 229, 0.2);
  transform: scale(1.1);
}

/* Animaciones existentes */
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animate-shimmer { animation: shimmer 2s infinite; }
.animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
.animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
.animate-slide-up-fade { animation: slideUpFade 0.6s ease-out; }
.slide-fade-enter-active { transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-fade-leave-active { transition: all 0.3s ease-out; }
.slide-fade-enter-from { transform: translateX(20px) translateY(20px); opacity: 0; }
.slide-fade-leave-to { transform: translateX(20px); opacity: 0; }

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes slideUpFade {
    from { transform: translateY(40px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
</style>
