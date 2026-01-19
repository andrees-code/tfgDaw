<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-600 bg-[#f8fafc] overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-700">

    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow w-full mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">

      <div v-if="!modoExamenActivo" class="animate-fade-in-up">

        <div class="text-center mb-10">
          <span class="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-3 border border-indigo-100">
            Modo Estudio 2.0
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4">
            Transforma tus apuntes en <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">retos</span>
          </h1>
          <p class="text-slate-500 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Sube tu temario y deja que la IA genere un examen interactivo.
          </p>
        </div>

        <div class="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-white/50 p-6 md:p-10 relative overflow-hidden">

          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

          <div class="space-y-8">
            <div class="group relative">
              <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Fuente de conocimiento</label>
              <div class="relative transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-lg rounded-2xl">
                <textarea
                  v-model="apuntes"
                  rows="6"
                  class="w-full rounded-2xl bg-slate-50/50 border border-slate-200 px-6 py-5 text-slate-700 resize-none placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:outline-none transition-all text-base shadow-inner"
                  placeholder=" "
                ></textarea>
                <div v-if="!apuntes && !archivoNombre" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 gap-3">
                  <div class="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-400">
                    <i class="fa-solid fa-pen-nib text-xl"></i>
                  </div>
                  <span class="font-medium text-sm">Pega tus apuntes aquí</span>
                </div>
              </div>
            </div>

            <div class="group border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 rounded-2xl p-4 transition-all duration-300">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                       :class="archivoNombre ? 'bg-red-100 text-red-500' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500'">
                    <i class="fa-solid fa-file-pdf text-2xl"></i>
                  </div>
                  <div>
                      <p class="font-bold text-slate-700 truncate max-w-[200px] md:max-w-xs">
                        {{ archivoNombre || '¿Prefieres usar un PDF?' }}
                      </p>
                      <p class="text-slate-400 text-xs mt-0.5">
                        {{ archivoNombre ? 'Archivo cargado correctamente' : 'Hasta 20 páginas' }}
                      </p>
                  </div>
                </div>
                <label
                  for="pdf-upload"
                  class="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold cursor-pointer hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
                >
                  Explorar
                </label>
                <input id="pdf-upload" type="file" accept="application/pdf" class="hidden" @change="handlePdfUploadCustom" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Nivel de desafío</label>
                <div class="flex bg-slate-100/80 p-1.5 rounded-2xl backdrop-blur-sm">
                  <button
                    v-for="dif in ['facil', 'medio', 'dificil']"
                    :key="dif"
                    @click="dificultad = dif"
                    :class="[
                      'flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize',
                      dificultad === dif
                        ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-900/5 ring-1 ring-black/5 transform scale-100'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                    ]"
                  >
                    {{ dif }}
                  </button>
                </div>
              </div>

              <div>
                <label class="flex justify-between text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 pl-1">
                  <span>Cantidad</span>
                  <span class="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{{ numPreguntas }} preguntas</span>
                </label>
                <div class="relative px-2">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="5"
                    v-model.number="numPreguntas"
                    class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <div class="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span>5</span><span>10</span><span>15</span><span>20</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
               <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Formato de preguntas</label>
               <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <button
                   v-for="tipo in tipos"
                   :key="tipo"
                   @click="tipoExamen = tipo"
                   :class="[
                     'px-4 py-4 text-sm rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden',
                     tipoExamen === tipo
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold shadow-md'
                      : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-indigo-50/10'
                   ]"
                 >
                    <div v-if="tipoExamen === tipo" class="absolute top-0 right-0 w-8 h-8 -mr-4 -mt-4 bg-indigo-500 rotate-45"></div>
                    <span class="relative z-10">{{ tipo }}</span>
                 </button>
               </div>
            </div>
          </div>

          <div class="mt-10">
            <button
              @click="manejarGeneracion"
              :disabled="loading"
              class="w-full group relative overflow-hidden bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1"
            >
              <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

              <span v-if="loading" class="flex items-center justify-center gap-3 relative z-10">
                <svg class="animate-spin h-5 w-5 text-indigo-300" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span class="animate-pulse">Diseñando tu examen...</span>
              </span>
              <span v-else class="flex items-center justify-center gap-2 relative z-10">
                Comenzar Reto <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
              </span>
            </button>
          </div>

          <p v-if="error" class="text-center text-red-500 mt-6 text-sm bg-red-50 py-2 px-4 rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-shake">
            <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
          </p>
        </div>
      </div>

      <div v-else class="max-w-xl mx-auto h-[85vh] flex flex-col relative">

        <div class="flex items-center justify-between mb-6 px-4">
            <button @click="salirModoExamen" class="w-10 h-10 rounded-full bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm border border-slate-100 flex items-center justify-center transition-all hover:rotate-90">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>

            <div class="flex-1 mx-6 flex flex-col gap-1">
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <span>Progreso</span>
                  <span>{{ Math.round(progresoPorcentaje) }}%</span>
                </div>
                <div class="h-2.5 w-full bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                    <div
                        class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        :style="{ width: `${progresoPorcentaje}%` }"
                    ></div>
                </div>
            </div>

            <div class="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm text-slate-600 font-bold text-sm tabular-nums">
              <span class="text-indigo-600">{{ tarjetaActualIndex + 1 }}</span>
              <span class="text-slate-300 mx-1">/</span>
              <span>{{ preguntasParseadas.length }}</span>
            </div>
        </div>

        <div class="flex-grow relative perspective-1000 w-full">

            <div v-if="examenTerminado" class="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white p-8 flex flex-col items-center justify-center text-center animate-scale-up z-50">
                <div class="relative mb-8">
                  <div class="absolute inset-0 animate-ping opacity-20 rounded-full" :class="nota >= 5 ? 'bg-green-400' : 'bg-red-400'"></div>
                  <div class="w-32 h-32 rounded-full flex items-center justify-center border-[6px]" :class="nota >= 5 ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-500'">
                      <span class="text-5xl font-extrabold tracking-tighter">{{ nota }}</span>
                  </div>
                  <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Nota Final
                  </div>
                </div>
                <h2 class="text-3xl font-black text-slate-800 mb-2">{{ nota >= 5 ? '¡Excelente trabajo!' : 'A seguir practicando' }}</h2>
                <p class="text-slate-500 mb-10 max-w-xs mx-auto text-lg">Acertaste <strong class="text-slate-800">{{ aciertos }}</strong> de <strong class="text-slate-800">{{ preguntasParseadas.length }}</strong> preguntas.</p>
                <div class="w-full space-y-3">
                  <button @click="salirModoExamen" class="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-xl transition-all">Generar nuevo reto</button>
                  <button @click="reiniciarExamenActual" class="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-2xl font-bold">Repetir este examen</button>
                </div>
            </div>

            <div v-else class="absolute inset-0 flex flex-col transition-all duration-500 ease-out transform origin-bottom z-30"
                 :class="{'translate-x-[150%] rotate-12 opacity-0': animandoSalida}">

                <div class="flex-grow bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden relative">
                    <div class="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                        <div class="flex items-start gap-3 mb-6">
                           <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full text-xs font-black">Q</span>
                           <h3 class="text-xl md:text-2xl font-bold text-slate-800 leading-snug">{{ preguntaActual.pregunta }}</h3>
                        </div>
                        <div class="space-y-3">
                            <button
                                v-for="(opcion, index) in preguntaActual.opciones"
                                :key="index"
                                @click="seleccionarRespuesta(index)"
                                :disabled="respuestaSeleccionada !== null"
                                class="w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group"
                                :class="claseOpcion(index)"
                            >
                                <div class="flex items-center gap-4 relative z-10">
                                    <span class="flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-colors shadow-sm" :class="claseBotonLetra(index)">
                                        {{ obtenerLetraVisual(index) }}
                                    </span>
                                    <span class="font-medium text-sm md:text-base leading-snug transition-colors">
                                        {{ opcion.texto }}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div v-if="respuestaSeleccionada !== null" class="bg-slate-50 border-t border-slate-100 p-5 md:p-6 animate-slide-up-fade">
                        <div v-if="esRespuestaCorrecta" class="flex items-center gap-3 mb-3 p-3 bg-green-100/50 rounded-xl text-green-700 border border-green-200">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check"></i></div>
                            <span class="font-bold">¡Correcto!</span>
                        </div>
                        <div v-else class="flex items-center gap-3 mb-3 p-3 bg-red-100/50 rounded-xl text-red-700 border border-red-200">
                             <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"><i class="fa-solid fa-xmark"></i></div>
                            <span class="font-bold">Incorrecto</span>
                        </div>

                        <p class="text-sm text-slate-500 mb-5 pl-1">
                            La respuesta correcta era la <strong class="text-slate-900 bg-slate-200 px-1 rounded">{{ obtenerLetraCorrectaParaUI() }}</strong>.
                        </p>

                        <button @click="siguientePregunta" class="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2">
                            <span>{{ tarjetaActualIndex < preguntasParseadas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados' }}</span> <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!examenTerminado && tarjetaActualIndex < preguntasParseadas.length - 1"
                 class="absolute top-6 left-4 right-4 bottom-[-10px] bg-white rounded-[2rem] border border-slate-200 z-10 shadow-md transform scale-[0.96] opacity-60 pointer-events-none">
            </div>
            <div v-if="!examenTerminado && tarjetaActualIndex < preguntasParseadas.length - 2"
                 class="absolute top-10 left-8 right-8 bottom-[-20px] bg-white rounded-[2rem] border border-slate-200 z-0 shadow-sm transform scale-[0.92] opacity-30 pointer-events-none">
            </div>

        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as pdfjsLib from 'pdfjs-dist'
import Header from '@/components/HeaderCompleto.vue'
import { saveExam, generateExam } from '@/services/examService'
import { userStore } from "@/stores/userStores"

const router = useRouter()

// Datos de Entrada
const apuntes = ref("")
const dificultad = ref("medio")
const numPreguntas = ref(5)
const tipoExamen = ref("Test (4 opciones)")
const archivoNombre = ref("")

// Estado General
const loading = ref(false)
const error = ref(null)
const tipos = ["Test (4 opciones)", "Verdadero/Falso", "Mix"]

// --- ESTADO DEL MODO EXAMEN ---
const modoExamenActivo = ref(false)
const preguntasParseadas = ref([])
const tarjetaActualIndex = ref(0)
const respuestaSeleccionada = ref(null) // Guarda el índice del array barajado
const aciertos = ref(0)
const examenTerminado = ref(false)
const animandoSalida = ref(false)

// Generador visual de letras (independiente de la lógica interna)
const alfabeto = ['A', 'B', 'C', 'D', 'E', 'F'];
function obtenerLetraVisual(index) {
    return alfabeto[index] || '?';
}

function obtenerLetraCorrectaParaUI() {
    const indexCorrecta = preguntaActual.value.opciones.findIndex(o => o.esCorrecta);
    return obtenerLetraVisual(indexCorrecta);
}

// Computed
const preguntaActual = computed(() => preguntasParseadas.value[tarjetaActualIndex.value] || {})
const progresoPorcentaje = computed(() => ((tarjetaActualIndex.value) / preguntasParseadas.value.length) * 100)

const esRespuestaCorrecta = computed(() => {
    if (respuestaSeleccionada.value === null) return false;
    const opcion = preguntaActual.value.opciones[respuestaSeleccionada.value];
    return opcion ? opcion.esCorrecta : false;
})

const nota = computed(() => {
  if (preguntasParseadas.value.length === 0) return 0
  return ((aciertos.value / preguntasParseadas.value.length) * 10).toFixed(1)
})

onMounted(() => {
  userStore.loadSession()
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
})

// --- 1. LÓGICA DE PDF ---
async function handlePdfUploadCustom(event) {
  const file = event.target.files[0]
  if (!file) return
  archivoNombre.value = file.name
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  let text = ""
  for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(i => i.str).join(" ") + "\n\n"
  }
  apuntes.value = text
}

// --- 2. MOTOR DE PARSEO ROBUSTO (SECUENCIAL Y SINCRONIZADO) ---

function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function parsearExamen(textoPreguntas, textoRespuestas) {
    // Validaciones iniciales
    if (!textoPreguntas || !textoRespuestas) return [];

    // --- PARTE 1: PARSEAR RESPUESTAS (HOJA DE RESPUESTAS) ---
    // Estrategia: Ignorar el número exacto y recoger secuencialmente las letras.
    // Ej: "1. A", "2 - b", "3) C" -> ['a', 'b', 'c']
    const lineasResp = textoRespuestas.split('\n').filter(l => l.trim().length > 0);
    const respuestasSecuenciales = [];

    // Regex para capturar solo la letra de la respuesta (A-E, V, F) al inicio de algo que parece una respuesta
    const regexLetraRespuesta = /^\s*\d+[\.\-\)\s]+([a-eA-E]|verdadero|falso|v|f)/i;

    lineasResp.forEach(linea => {
        const match = linea.match(regexLetraRespuesta);
        if (match) {
            let letra = match[1].toLowerCase();
            // Normalizamos V/F a A/B para consistencia interna si fuese necesario
            if (letra.startsWith('v')) letra = 'a';
            if (letra.startsWith('f')) letra = 'b';
            respuestasSecuenciales.push(letra);
        }
    });

    // --- PARTE 2: PARSEAR PREGUNTAS EN BLOQUES ---
    // Usamos un split basado en "Número seguido de punto/paréntesis" al inicio de línea
    // para separar bloques de preguntas de forma fiable.
    const bloquesRaw = textoPreguntas.split(/\n+(?=\d+[\.\)\-])/g).filter(b => b.trim().length > 5);

    const preguntas = [];

    bloquesRaw.forEach((bloque, index) => {
        // Limpiar el "1." del inicio
        let contenidoRaw = bloque.replace(/^\d+[\.\)\-]\s*/, "").trim();
        const lineas = contenidoRaw.split('\n');

        let textoPregunta = "";
        let opcionesEncontradas = [];
        let opcionActual = null;

        // Regex para detectar inicio de opción: "a)", "A.", "a-", o letra sola "A" si es fin de línea
        const regexInicioOpcion = /^\s*([a-eA-E])(?:[\.\)\:\-]|\s$|\s+)(.*)/;
        const regexLetraSola = /^\s*([a-eA-E])\s*$/;

        lineas.forEach(linea => {
            const lineaLimpia = linea.trim();
            if (!lineaLimpia) return;

            const matchOpcion = lineaLimpia.match(regexInicioOpcion);
            const matchLetraSola = lineaLimpia.match(regexLetraSola);

            if (matchLetraSola) {
                // Caso: Línea con solo "A" -> El texto viene en la siguiente
                opcionActual = {
                    letraRaw: matchLetraSola[1].toLowerCase(),
                    texto: "",
                    esCorrecta: false
                };
                opcionesEncontradas.push(opcionActual);
            }
            else if (matchOpcion) {
                // Caso: Línea normal "A) Texto de la opción"
                // Protección: No confundir texto largo de pregunta que empieza por vocal con opción.
                // Si aún no hemos terminado la pregunta (pocas opciones) y el texto es muy largo, dudamos.
                const esTextoLargo = matchOpcion[2].length > 60;
                // Si es la primera línea del bloque, es parte de la pregunta seguro
                if (opcionesEncontradas.length === 0 && (textoPregunta === "" || esTextoLargo) && !linea.match(/^[a-eA-E][\)\.]/)) {
                     textoPregunta += " " + lineaLimpia;
                     return;
                }

                opcionActual = {
                    letraRaw: matchOpcion[1].toLowerCase(),
                    texto: matchOpcion[2].trim(),
                    esCorrecta: false
                };
                opcionesEncontradas.push(opcionActual);
            }
            else {
                // Texto de continuación
                if (opcionActual) {
                    opcionActual.texto += " " + lineaLimpia;
                } else {
                    textoPregunta += " " + lineaLimpia;
                }
            }
        });

        // Fallback para V/F si no se detectaron opciones explícitas
        if (opcionesEncontradas.length === 0) {
            opcionesEncontradas = [
                { letraRaw: 'a', texto: 'Verdadero', esCorrecta: false },
                { letraRaw: 'b', texto: 'Falso', esCorrecta: false }
            ];
        }

        // --- PARTE 3: SINCRONIZACIÓN ---
        // Aquí ocurre la magia: Usamos el INDEX para vincular respuesta y pregunta.
        // La pregunta 0 del array toma la respuesta 0 del array de respuestas.
        const letraCorrectaTarget = respuestasSecuenciales[index];

        let respuestaAsignada = false;
        if (letraCorrectaTarget) {
            opcionesEncontradas.forEach(op => {
                if (op.letraRaw === letraCorrectaTarget) {
                    op.esCorrecta = true;
                    respuestaAsignada = true;
                }
            });
        }

        // Si falló el emparejamiento (ej: respuesta dice 'c' pero solo hay a/b),
        // o si no había respuesta para este índice, marcamos la primera por seguridad (fail-safe visual).
        if (!respuestaAsignada && opcionesEncontradas.length > 0) {
            opcionesEncontradas[0].esCorrecta = true;
        }

        preguntas.push({
            id: index,
            pregunta: textoPregunta.trim(),
            opciones: mezclarArray(opcionesEncontradas)
        });
    });

    return preguntas;
}

// --- 3. GENERACIÓN ---
async function manejarGeneracion() {
  if (!apuntes.value || !dificultad.value) {
    error.value = "Introduce apuntes para generar el examen."
    return
  }
  if (!userStore.token) {
      error.value = "Debes iniciar sesión."
      return
  }

  loading.value = true
  error.value = null

  try {
    const data = await generateExam({
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: apuntes.value
    });

    // Usamos el nuevo parseador robusto
    const preguntasObj = parsearExamen(data.preguntas, data.respuestas);

    if (preguntasObj.length === 0) {
        throw new Error("La IA no generó preguntas válidas. Prueba con otro texto.");
    }

    preguntasParseadas.value = preguntasObj;

    await saveExam({
      title: `${tipoExamen.value} - ${new Date().toLocaleDateString()}`,
      tipo: tipoExamen.value,
      dificultad: dificultad.value,
      numPreguntas: Number(numPreguntas.value),
      apuntes: 'Contenido procesado',
      preguntas: data.preguntas,
      respuestas: data.respuestas
    });

    modoExamenActivo.value = true;
    reiniciarExamenActual();

  } catch (e) {
      console.error(e);
      error.value = "Hubo un error generando el examen. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}

// --- 4. INTERACCIÓN MODO EXAMEN ---
function seleccionarRespuesta(index) {
    if (respuestaSeleccionada.value !== null) return;
    respuestaSeleccionada.value = index;

    // Verificamos si la opción seleccionada (por índice actual) tiene el flag esCorrecta
    const opcionElegida = preguntaActual.value.opciones[index];
    if (opcionElegida && opcionElegida.esCorrecta) {
        aciertos.value++;
    }
}

function siguientePregunta() {
    animandoSalida.value = true;
    setTimeout(() => {
        if (tarjetaActualIndex.value < preguntasParseadas.value.length - 1) {
            tarjetaActualIndex.value++;
            respuestaSeleccionada.value = null;
            animandoSalida.value = false;
        } else {
            examenTerminado.value = true;
            animandoSalida.value = false;
        }
    }, 400);
}

function reiniciarExamenActual() {
    tarjetaActualIndex.value = 0;
    aciertos.value = 0;
    respuestaSeleccionada.value = null;
    examenTerminado.value = false;
    animandoSalida.value = false;
}

function salirModoExamen() {
    modoExamenActivo.value = false;
    preguntasParseadas.value = [];
}

// --- CLASES DINÁMICAS ---

function claseOpcion(index) {
    // Estado inicial (sin seleccionar nada)
    if (respuestaSeleccionada.value === null) {
        return "border-slate-100 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer shadow-sm hover:shadow-md";
    }

    const estaOpcion = preguntaActual.value.opciones[index];
    const fueSeleccionada = respuestaSeleccionada.value === index;

    // LÓGICA CORREGIDA:
    // 1. Si esta opción es la correcta (tiene el flag true), SIEMPRE se pone verde
    // independientemente de si la elegiste tú o no. Así ves cuál era la correcta si fallaste.
    if (estaOpcion.esCorrecta) {
        return "bg-green-100 border-green-500 text-green-900 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] ring-1 ring-green-500";
    }

    // 2. Si TU elegiste esta opción, y arriba ya comprobamos que NO es la correcta (porque si fuera correcta habría entrado en el if anterior),
    // entonces esta es la errónea seleccionada -> Rojo.
    if (fueSeleccionada) {
        return "bg-red-100 border-red-500 text-red-900 opacity-90";
    }

    // 3. El resto de opciones (ni correcta ni seleccionada) -> Gris
    return "border-slate-100 bg-slate-50 opacity-40 grayscale";
}

function claseBotonLetra(index) {
    if (respuestaSeleccionada.value === null) {
        return "bg-slate-50 text-slate-400 border-slate-200 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500";
    }

    const estaOpcion = preguntaActual.value.opciones[index];
    const fueSeleccionada = respuestaSeleccionada.value === index;

    if (estaOpcion.esCorrecta) {
        return "bg-green-600 text-white border-green-600 shadow-sm";
    }
    if (fueSeleccionada) {
        return "bg-red-500 text-white border-red-500";
    }

    return "bg-slate-100 text-slate-300 border-slate-200";
}
</script>

<style scoped>
/* Animaciones y utilidades */
.perspective-1000 {
    perspective: 1000px;
}
.animate-scale-up {
    animation: scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.animate-slide-up-fade {
    animation: slideUpFade 0.4s ease-out;
}
.animate-blob {
  animation: blob 7s infinite;
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

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
@keyframes scaleUp {
    from { transform: scale(0.8) translateY(20px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
}
@keyframes slideUpFade {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
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

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
