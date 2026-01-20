<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">

      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] opacity-70 mix-blend-screen will-change-transform"></div>

      <div class="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[80px] opacity-60 animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[80px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>

      <div class="hidden lg:block absolute top-[20%] left-[5%] animate-float opacity-30 will-change-transform">
        <div class="w-20 h-28 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl -rotate-12 flex items-center justify-center backdrop-blur-sm">
            <i class="fa-solid fa-file-lines text-3xl text-indigo-400" aria-hidden="true"></i>
        </div>
      </div>

      <div class="hidden lg:block absolute top-[30%] right-[8%] animate-float animation-delay-1000 opacity-30 will-change-transform">
        <div class="w-20 h-20 bg-slate-800/80 border border-white/10 rounded-2xl shadow-2xl rotate-12 flex items-center justify-center backdrop-blur-sm">
            <i class="fa-solid fa-graduation-cap text-3xl text-purple-400" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow w-full mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">
      <div class="animate-fade-in-up">

        <div class="text-center mb-10 relative">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full -z-10"></div>

          <span class="inline-block py-1.5 px-4 rounded-full bg-slate-800/50 backdrop-blur-sm text-indigo-300 text-xs font-bold tracking-wider uppercase mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-900/20">
              ✨ Herramienta IA Potenciada
          </span>
          <h1 class="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 flex flex-col md:block items-center justify-center gap-2 drop-shadow-lg">
            Generador de
            <span class="relative inline-block">
               <span class="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Exámenes</span>
               <svg class="absolute w-full h-3 -bottom-1 left-0 text-indigo-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none" /></svg>

               <span class="absolute -top-2 -right-4 flex h-4 w-4 cursor-pointer" role="button" aria-label="Nueva funcionalidad disponible" @click="irAlModoReto" title="Nueva funcionalidad disponible">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border-2 border-slate-900"></span>
              </span>
            </span>
          </h1>
          <p class="text-slate-300 max-w-xl mx-auto text-lg md:text-xl leading-relaxed font-medium">
            Convierte tus apuntes o PDFs en exámenes personalizados en segundos.
          </p>
        </div>

        <div class="w-full bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-10 relative overflow-hidden ring-1 ring-white/5">

          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>

          <div class="space-y-8">
            <div class="group relative">
               <label for="input-apuntes" class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Fuente de conocimiento</label>
               <div class="relative transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-xl focus-within:shadow-black/20 rounded-2xl h-64">
                <textarea 
                  id="input-apuntes"
                  v-model="apuntes" 
                  class="w-full h-full rounded-2xl bg-slate-950/50 border border-white/10 px-6 py-5 text-slate-200 resize-none placeholder:text-transparent focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none transition-all text-base shadow-inner relative z-10 custom-scrollbar"
                  aria-label="Introduce tus apuntes aquí"
                ></textarea>
                <div v-if="!apuntes && archivoNombre === 'Ningún archivo seleccionado'" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 gap-3 z-0">
                  <div class="w-14 h-14 rounded-full bg-slate-800 shadow-lg border border-white/5 flex items-center justify-center text-indigo-400 mb-2">
                    <i class="fa-solid fa-pen-nib text-xl" aria-hidden="true"></i>
                  </div>
                  <span class="font-medium text-slate-400">Pega tus apuntes aquí</span>
                </div>
              </div>
            </div>

             <div class="group border-2 border-dashed border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-2xl p-4 transition-all duration-300">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                       :class="archivoNombre !== 'Ningún archivo seleccionado' ? 'bg-red-900/20 text-red-400' : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'">
                    <i class="fa-solid fa-file-pdf text-2xl" aria-hidden="true"></i>
                  </div>
                  <div class="min-w-0">
                      <p class="font-bold text-slate-300 truncate max-w-[150px] md:max-w-xs">
                        {{ archivoNombre !== 'Ningún archivo seleccionado' ? archivoNombre : '¿Prefieres usar un PDF?' }}
                      </p>
                      <p class="text-slate-400 text-xs mt-0.5">
                        {{ archivoNombre !== 'Ningún archivo seleccionado' ? 'Archivo cargado correctamente' : 'Hasta 50 páginas' }}
                      </p>
                  </div>
                </div>
                <label for="pdf-upload" class="px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm font-bold cursor-pointer hover:border-indigo-500/50 hover:text-indigo-400 transition-all shadow-lg hover:shadow-black/20 whitespace-nowrap">
                  Explorar
                </label>
                <input id="pdf-upload" type="file" accept="application/pdf" class="hidden" @change="handlePdfUploadCustom" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Nivel de desafío</label>
                <div class="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5" role="group" aria-label="Selecciona la dificultad">
                  <button v-for="dif in ['facil', 'medio', 'dificil']" :key="dif" @click="dificultad = dif" :class="['flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize', dificultad === dif ? 'bg-slate-800 text-indigo-400 shadow-lg shadow-black/30 border border-white/5 transform scale-[1.02]' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5']">{{ dif }}</button>
                </div>
              </div>
              <div>
                <label for="range-preguntas" class="flex justify-between items-center text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 pl-1">
                  <span>Cantidad</span>
                  <span class="text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-lg shadow-sm">{{ numPreguntas }} preguntas</span>
                </label>
                <div class="relative px-1 py-2">
                  <input id="range-preguntas" aria-label="Número de preguntas" type="range" min="5" max="20" step="5" v-model.number="numPreguntas" :style="{ backgroundSize: ((numPreguntas - 5) * 100) / 15 + '% 100%' }" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none slider-custom" />
                  <div class="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1" aria-hidden="true"><span>5</span><span>10</span><span>15</span><span>20</span></div>
                </div>
              </div>
            </div>

            <div>
               <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Formato de preguntas</label>
               <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-label="Formato de preguntas">
                 <button role="radio" :aria-checked="tipoExamen === tipo" v-for="tipo in tipos" :key="tipo" @click="tipoExamen = tipo" :class="['h-full w-full px-5 py-5 text-sm rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden group', tipoExamen === tipo ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-bold shadow-lg shadow-indigo-900/10' : 'border-white/5 bg-slate-950/30 text-slate-400 hover:border-white/10 hover:bg-white/5']">
                    <div v-if="tipoExamen === tipo" class="absolute top-0 right-0 w-8 h-8 -mr-4 -mt-4 bg-indigo-500 rotate-45 shadow-sm"></div>
                    <span class="relative z-10 flex items-center gap-2">{{ tipo }}</span>
                 </button>
               </div>
            </div>

             <div class="mt-10">
                <button @click="manejarGeneracion" :disabled="loading" class="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:-translate-y-0.5">
                  <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  <span v-if="loading" class="flex items-center justify-center gap-3 relative z-10">
                    <svg class="animate-spin h-5 w-5 text-indigo-200" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span class="animate-pulse">Generando examen...</span>
                  </span>
                  <span v-else class="flex items-center justify-center gap-2 relative z-10">
                    Generar Examen <i class="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform text-indigo-200" aria-hidden="true"></i>
                  </span>
                </button>
             </div>

             <div v-if="error" class="text-center mt-6 animate-shake" role="alert">
                 <div class="inline-flex items-center gap-2 bg-red-900/20 text-red-400 py-2 px-4 rounded-xl border border-red-500/20 text-sm font-medium">
                   <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
                 </div>
                 <div v-if="esErrorDeAuth" class="mt-3">
                    <button @click="irAlLogin" class="text-xs text-slate-400 underline hover:text-indigo-400">Iniciar sesión para continuar</button>
                 </div>
             </div>

          </div>
        </div>

        <div v-if="resultado" class="mt-12 animate-slide-up-fade" role="region" aria-label="Resultado del examen">
             <div class="flex items-center justify-between mb-6 px-2">
                <h3 class="text-2xl font-bold text-slate-200">Resultado</h3>
                <span class="text-xs font-bold uppercase tracking-wider text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/20">Generado con éxito</span>
            </div>
            <div class="bg-slate-900 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative">
                 <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-700"></div>
                 <div class="p-8 md:p-10">
                    <div class="whitespace-pre-wrap leading-loose text-base md:text-lg font-medium text-slate-300 font-sans">{{ resultado }}</div>
                 </div>
                 <div class="bg-slate-950/50 border-t border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <button v-if="hayRespuestas" @click="toggleResuelto" class="px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 font-bold text-sm transition-all shadow-lg hover:shadow-black/20 flex items-center gap-2">
                        <i :class="mostrarResuelto ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
                        {{ mostrarResuelto ? 'Ocultar soluciones' : 'Ver soluciones' }}
                    </button>
                    <span class="text-xs text-slate-500 font-medium">Guardado automáticamente</span>
                 </div>
            </div>
            <div v-if="mostrarResuelto" class="mt-6 bg-green-900/10 backdrop-blur-sm border border-green-500/20 rounded-[2rem] p-8 md:p-10 shadow-lg animate-fade-in-up relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <h4 class="flex items-center gap-2 text-lg font-bold text-green-400 mb-6 pb-4 border-b border-green-500/20">
                    <span class="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
                    Hoja de Respuestas
                </h4>
                <div class="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-slate-300 font-medium">{{ respuestas }}</div>
            </div>
        </div>

      </div>
    </main>

    <Transition name="slide-fade">
        <div v-if="mostrarNovedad" class="fixed bottom-6 right-4 md:right-8 z-50 w-full max-w-sm">
             <div class="relative bg-slate-900/90 backdrop-blur-md p-5 rounded-3xl shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] border border-white/10 ring-1 ring-white/5 overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer" @click="irAlModoReto">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
                <button @click.stop="cerrarNovedad" aria-label="Cerrar aviso de novedad" class="absolute top-2 right-2 p-2 text-slate-500 hover:text-slate-300 z-10 transition-colors"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
                <div class="flex gap-4 items-start relative z-10">
                    <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <i class="fa-solid fa-fire text-xl animate-pulse" aria-hidden="true"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h2 class="font-bold text-slate-200 text-sm md:text-base">Nuevo: Modo Reto</h2>
                            <span class="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 text-[10px] font-bold uppercase tracking-wide border border-pink-500/20">Beta</span>
                        </div>
                        <p class="text-xs text-slate-400 leading-relaxed mb-3">¡Aprende jugando! Desliza tarjetas a la derecha o izquierda.</p>
                        <button class="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:gap-2 transition-all">Probar ahora <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
        </div>
    </Transition>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// ✅ OPTIMIZACIÓN #4 y #1: Eliminado import estático de 'pdfjs-dist' para Lazy Loading
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
  // Eliminado setup inmediato de PDF worker, se mueve a 'on demand'

  // ✅ OPTIMIZACIÓN #7: Añadir Meta Description y Title dinámicamente
  document.title = "Generador de Exámenes IA - Crea Tests Automáticos";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Convierte apuntes y PDFs en exámenes y tests automáticamente con nuestra IA. Herramienta de estudio para generar preguntas y respuestas al instante.";


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

// ✅ OPTIMIZACIÓN #4 y #1: Lazy Load de la librería PDF (Dividir JS)
// Solo se descarga el código de PDF.js si el usuario sube un archivo.
async function handlePdfUploadCustom(event) {
  const file = event.target.files[0]
  if (!file) return
  archivoNombre.value = file.name
  
  try {
      // Dynamic import
      const pdfjsLib = await import('pdfjs-dist')
      // Configuración del worker solo cuando se necesita
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
           pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
      }

      const buffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
      let text = ""
      for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(i => i.str).join(" ") + "\n\n"
      }
      apuntes.value = text
  } catch (e) {
      console.error("Error cargando PDF", e)
      error.value = "Error al leer el archivo PDF"
  }
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
/* Scrollbar Personalizado (Dark) */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #64748b; }

/* Patrón de cuadrícula técnica (Grid Blanco) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animación de flotación */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

/* Slider Personalizado */
.slider-custom {
  background-image: linear-gradient(#6366f1, #6366f1); /* Indigo 500 */
  background-repeat: no-repeat;
}

.slider-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1; /* Indigo 500 */
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  transition: all 0.1s ease-in-out;
}

.slider-custom::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.3);
  transform: scale(1.1);
}

/* Animaciones Generales */
.animate-blob {
  animation: blob 10s infinite alternate;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-slide-up-fade {
  animation: slideUpFade 0.6s ease-out;
}

.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from {
  transform: translateX(20px) translateY(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* Optimización GPU para fondos */
.will-change-transform {
    will-change: transform;
}

/* Keyframes */
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUpFade {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>