<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div class="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-900/20 rounded-full blur-[80px] opacity-40 animate-blob animation-delay-4000 mix-blend-screen will-change-transform"></div>
    </div>

    <Header class="relative z-20" />

    <main class="flex-grow w-full mx-auto max-w-5xl px-4 py-8 md:py-12 relative z-10">

      <div v-if="!modoExamenActivo" class="animate-fade-in-up">
          <div class="text-center mb-10">
          <span class="inline-block py-1 px-3 rounded-full bg-slate-800/50 backdrop-blur-sm text-indigo-300 text-xs font-bold tracking-wider uppercase mb-3 border border-indigo-500/20 shadow-lg shadow-indigo-900/20">
            Modo Estudio 2.0
          </span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
            Elige tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">reto</span>
          🔥</h1>
          <p class="text-slate-400 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Elige una categoría o escribe tu propio tema y ponte a prueba al instante.
          </p>
        </div>

        <div class="w-full bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-10 relative overflow-hidden ring-1 ring-white/5">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-80"></div>

              <div class="space-y-8">

                <div v-if="!categoriaSeleccionada">
                  <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 block pl-1">¿Sobre qué quieres tu reto?</label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      v-for="cat in opcionesCategoria"
                      :key="cat.id"
                      type="button"
                      @click="elegirCategoria(cat)"
                      class="flex items-center gap-4 px-6 py-5 rounded-2xl border-2 border-white/5 bg-slate-950/30 text-left text-slate-300 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-200"
                    >
                      <div class="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 text-xl flex-shrink-0">
                        <i :class="cat.icon" aria-hidden="true"></i>
                      </div>
                      <div>
                        <p class="font-bold text-slate-200">{{ cat.label }}</p>
                        <p class="text-xs text-slate-500 mt-0.5">{{ cat.temas ? `${cat.temas.length} temas disponibles` : 'Escribe cualquier tema' }}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div v-else class="space-y-6">
                  <button @click="cambiarCategoria" type="button" class="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Cambiar categoría
                  </button>

                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                      <i :class="categoriaSeleccionada.icon" aria-hidden="true"></i>
                    </div>
                    <h2 class="font-bold text-slate-200 text-lg">{{ categoriaSeleccionada.label }}</h2>
                  </div>

                  <div v-if="categoriaSeleccionada.temas">
                    <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Elige un tema</label>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        v-for="t in categoriaSeleccionada.temas"
                        :key="t"
                        type="button"
                        @click="gen.tema.value = t"
                        :class="['px-5 py-4 text-sm rounded-2xl border-2 text-left transition-all duration-200', gen.tema.value === t ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 font-bold shadow-lg shadow-indigo-900/10' : 'border-white/5 bg-slate-950/30 text-slate-400 hover:border-white/10 hover:bg-white/5']"
                      >
                        {{ t }}
                      </button>
                    </div>
                    <div class="pt-4">
                      <label for="tema-reto-libre" class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block pl-1">O escribe tu propio tema</label>
                      <input id="tema-reto-libre" v-model="gen.tema.value" type="text" placeholder="Ej: rotondas y cruces" class="w-full rounded-2xl bg-slate-950/50 border border-white/10 px-5 py-3.5 text-slate-200 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none transition-all text-sm" />
                    </div>
                  </div>

                  <div v-else>
                    <label for="tema-reto-libre-input" class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">¿Sobre qué tema quieres tu reto?</label>
                    <input
                      id="tema-reto-libre-input"
                      v-model="gen.tema.value"
                      type="text"
                      placeholder="Ej: la Revolución Francesa"
                      class="w-full rounded-2xl bg-slate-950/50 border border-white/10 px-6 py-4 text-slate-200 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none transition-all text-base shadow-inner"
                    />
                  </div>
                </div>

                <div v-if="categoriaSeleccionada" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Nivel de desafío</label>
                        <div class="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5" role="group" aria-label="Nivel de dificultad">
                            <button v-for="dif in ['facil', 'medio', 'dificil']" :key="dif" type="button" @click="gen.dificultad.value = dif" :class="['flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize', gen.dificultad.value === dif ? 'bg-slate-800 text-indigo-400 shadow-lg shadow-black/30 border border-white/5 transform scale-100' : 'text-slate-400 hover:text-slate-300 hover:bg-white/5']">{{ dif }}</button>
                        </div>
                    </div>
                    <div>
                        <label for="range-preguntas" class="flex justify-between text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 pl-1">
                            <span>Cantidad</span>
                            <span class="text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">{{ gen.numPreguntas.value }} preguntas</span>
                        </label>
                        <div class="relative px-2">
                              <input id="range-preguntas" type="range" min="5" max="20" step="5" v-model.number="gen.numPreguntas.value" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 slider-custom" aria-valuemin="5" aria-valuemax="20" :aria-valuenow="gen.numPreguntas.value" aria-label="Número de preguntas" />
                            <div class="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest" aria-hidden="true"><span>5</span><span>10</span><span>15</span><span>20</span></div>
                        </div>
                    </div>
                </div>
             </div>

             <div v-if="categoriaSeleccionada" class="mt-10">
                <button @click="manejarGeneracion" :disabled="gen.loading.value" class="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:-translate-y-1">
                  <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  <span v-if="gen.loading.value" class="flex items-center justify-center gap-3 relative z-10">
                    <svg class="animate-spin h-5 w-5 text-indigo-200" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span class="animate-pulse">Diseñando tu reto...</span>
                  </span>
                  <span v-else class="flex items-center justify-center gap-2 relative z-10">
                    Comenzar Reto <i class="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform text-indigo-200" aria-hidden="true"></i>
                  </span>
                </button>
             </div>

             <p v-if="gen.error.value" role="alert" class="text-center text-red-400 mt-6 text-sm bg-red-900/20 py-2 px-4 rounded-xl border border-red-500/20 flex items-center justify-center gap-2 animate-shake"><i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ gen.error.value }}</p>

        </div>
      </div>

      <div v-else class="max-w-xl mx-auto h-[85vh] flex flex-col relative">
          <div class="flex items-center justify-between mb-6 px-4">
            <button @click="salirModoExamen" aria-label="Salir del examen" class="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-red-900/20 shadow-sm border border-white/10 flex items-center justify-center transition-all hover:rotate-90">
                <i class="fa-solid fa-xmark text-xl" aria-hidden="true"></i>
            </button>
            <div class="flex-1 mx-6 flex flex-col gap-1">
                <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Progreso</span><span>{{ Math.round(progresoPorcentaje) }}%</span>
                </div>
                <div class="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5" role="progressbar" :aria-valuenow="progresoPorcentaje" aria-valuemin="0" aria-valuemax="100">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" :style="{ width: `${progresoPorcentaje}%` }"></div>
                </div>
            </div>
            <div class="bg-slate-800 px-3 py-1.5 rounded-full border border-white/10 shadow-sm text-slate-400 font-bold text-sm tabular-nums">
                <span class="text-indigo-400">{{ tarjetaActualIndex + 1 }}</span><span class="text-slate-600 mx-1">/</span><span>{{ preguntasParseadas.length }}</span>
            </div>
        </div>

        <div class="flex-grow relative perspective-1000 w-full">

             <div v-if="examenTerminado" class="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/10 p-8 flex flex-col items-center justify-center text-center animate-scale-up z-50">
                 <div class="relative mb-8">
                  <div class="absolute inset-0 animate-ping opacity-20 rounded-full" :class="nota >= 5 ? 'bg-green-400' : 'bg-red-400'"></div>
                  <div class="w-32 h-32 rounded-full flex items-center justify-center border-[6px]" :class="nota >= 5 ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'">
                      <span class="text-5xl font-extrabold tracking-tighter">{{ nota }}</span>
                  </div>
                  <div class="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-950 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">Nota Final</div>
                </div>
                <h2 class="text-3xl font-black text-white mb-2">{{ nota >= 5 ? '¡Excelente trabajo!' : 'A seguir practicando' }}</h2>
                <p class="text-slate-400 mb-10 max-w-xs mx-auto text-lg">Acertaste <strong class="text-slate-200">{{ aciertos }}</strong> de <strong class="text-slate-200">{{ preguntasParseadas.length }}</strong> preguntas.</p>
                <div class="w-full space-y-3">
                  <button @click="salirModoExamen" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold shadow-xl transition-all">Generar nuevo reto</button>
                  <button @click="reiniciarExamenActual" class="w-full bg-slate-800 text-slate-300 hover:text-white border border-white/10 py-4 rounded-2xl font-bold">Repetir este examen</button>
                </div>
            </div>

            <div v-else class="absolute inset-0 flex flex-col transition-all duration-500 ease-out transform origin-bottom z-30" :class="{'translate-x-[150%] rotate-12 opacity-0': animandoSalida}">
                <div class="flex-grow bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col overflow-hidden relative">
                      <div class="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                         <div class="flex items-start gap-3 mb-6">
                            <span class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-black border border-indigo-500/20">Q</span>
                            <h3 class="text-xl md:text-2xl font-bold text-slate-200 leading-snug">{{ preguntaActual.pregunta }}</h3>
                         </div>
                         <div class="space-y-3">
                             <button v-for="(opcion, index) in preguntaActual.opciones" :key="index" @click="seleccionarRespuesta(index)" :disabled="respuestaSeleccionada !== null" class="w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden group" :class="claseOpcion(index)">
                                 <div class="flex items-center gap-4 relative z-10">
                                     <span class="flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center text-sm font-bold transition-colors shadow-sm" :class="claseBotonLetra(index)">{{ obtenerLetraVisual(index) }}</span>
                                     <span class="font-medium text-sm md:text-base leading-snug transition-colors">{{ opcion.texto }}</span>
                                 </div>
                             </button>
                         </div>
                     </div>

                    <div v-if="respuestaSeleccionada !== null" class="bg-slate-950/80 backdrop-blur border-t border-white/10 p-5 md:p-6 animate-slide-up-fade">
                        <div v-if="esRespuestaCorrecta" class="flex items-center gap-3 mb-3 p-3 bg-green-900/20 rounded-xl text-green-400 border border-green-500/20">
                            <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check" aria-hidden="true"></i></div>
                            <span class="font-bold">¡Correcto!</span>
                        </div>
                        <div v-else class="flex items-center gap-3 mb-3 p-3 bg-red-900/20 rounded-xl text-red-400 border border-red-500/20">
                             <div class="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs"><i class="fa-solid fa-xmark" aria-hidden="true"></i></div>
                            <span class="font-bold">Incorrecto</span>
                        </div>
                        <p class="text-sm text-slate-500 mb-5 pl-1">La respuesta correcta era la <strong class="text-slate-200 bg-slate-800 px-1 rounded border border-white/10">{{ obtenerLetraCorrectaParaUI() }}</strong>.</p>
                        <button @click="siguientePregunta" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-900/40 transition-all flex items-center justify-center gap-2">
                            <span>{{ tarjetaActualIndex < preguntasParseadas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados' }}</span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!examenTerminado && tarjetaActualIndex < preguntasParseadas.length - 1" class="absolute top-6 left-4 right-4 bottom-[-10px] bg-slate-800/40 backdrop-blur-sm rounded-[2rem] border border-white/5 z-10 shadow-md transform scale-[0.96] opacity-60 pointer-events-none"></div>
            <div v-if="!examenTerminado && tarjetaActualIndex < preguntasParseadas.length - 2" class="absolute top-10 left-8 right-8 bottom-[-20px] bg-slate-800/20 backdrop-blur-sm rounded-[2rem] border border-white/5 z-0 shadow-sm transform scale-[0.92] opacity-30 pointer-events-none"></div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/HeaderCompleto.vue'
import { useBackCloseWhen } from '@/composables/useBackClose'
import { useExamGenerator } from '@/composables/useExamGenerator'
import { userStore } from "@/stores/userStores"
import { CATEGORIAS_RETO } from '@/config/categorias'

// Selección de categoría/tema (pantalla de configuración del reto)
const TEMA_LIBRE = { id: 'libre', label: 'Tema libre', icon: 'fa-solid fa-pen-nib', temas: null }
const opcionesCategoria = [...CATEGORIAS_RETO, TEMA_LIBRE]
const categoriaSeleccionada = ref(null)

const categoriaIdParaGeneracion = computed(() => {
  if (!categoriaSeleccionada.value || categoriaSeleccionada.value.id === 'libre') return 'general'
  return categoriaSeleccionada.value.id
})

const gen = useExamGenerator({ categoria: categoriaIdParaGeneracion, modo: 'reto', tituloPrefix: 'Reto' })
gen.fuenteActiva.value = 'tema'

function elegirCategoria(cat) {
  categoriaSeleccionada.value = cat
  gen.tema.value = ''
}

function cambiarCategoria() {
  categoriaSeleccionada.value = null
  gen.tema.value = ''
}

// --- ESTADO DEL MODO EXAMEN ---
const modoExamenActivo = ref(false)
const preguntasParseadas = ref([])
const tarjetaActualIndex = ref(0)
const respuestaSeleccionada = ref(null)
const aciertos = ref(0)
const examenTerminado = ref(false)
const animandoSalida = ref(false)

// Generador visual de letras
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

  // ✅ OPTIMIZACIÓN: SEO Local
  document.title = "Modo Reto - Exámenes Interactivos con IA";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Ponte a prueba con el modo reto. Elige una categoría o un tema libre y obtén feedback instantáneo.";
})

// --- MOTOR DE PARSEO ROBUSTO ---
function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function parsearExamen(textoPreguntas, textoRespuestas) {
    if (!textoPreguntas || !textoRespuestas) return [];

    const lineasResp = textoRespuestas.split('\n').filter(l => l.trim().length > 0);
    const respuestasSecuenciales = [];
    const regexLetraRespuesta = /^\s*\d+[\.\-\)\s]+([a-eA-E]|verdadero|falso|v|f)/i;

    lineasResp.forEach(linea => {
        const match = linea.match(regexLetraRespuesta);
        if (match) {
            let letra = match[1].toLowerCase();
            if (letra.startsWith('v')) letra = 'a';
            if (letra.startsWith('f')) letra = 'b';
            respuestasSecuenciales.push(letra);
        }
    });

    const bloquesRaw = textoPreguntas.split(/\n+(?=\d+[\.\)\-])/g).filter(b => b.trim().length > 5);
    const preguntas = [];

    bloquesRaw.forEach((bloque, index) => {
        let contenidoRaw = bloque.replace(/^\d+[\.\)\-]\s*/, "").trim();
        const lineas = contenidoRaw.split('\n');

        let textoPregunta = "";
        let opcionesEncontradas = [];
        let opcionActual = null;
        const regexInicioOpcion = /^\s*([a-eA-E])(?:[\.\)\:\-]|\s$|\s+)(.*)/;
        const regexLetraSola = /^\s*([a-eA-E])\s*$/;

        lineas.forEach(linea => {
            const lineaLimpia = linea.trim();
            if (!lineaLimpia) return;

            const matchOpcion = lineaLimpia.match(regexInicioOpcion);
            const matchLetraSola = lineaLimpia.match(regexLetraSola);

            if (matchLetraSola) {
                opcionActual = {
                    letraRaw: matchLetraSola[1].toLowerCase(),
                    texto: "",
                    esCorrecta: false
                };
                opcionesEncontradas.push(opcionActual);
            }
            else if (matchOpcion) {
                const esTextoLargo = matchOpcion[2].length > 60;
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
                if (opcionActual) {
                    opcionActual.texto += " " + lineaLimpia;
                } else {
                    textoPregunta += " " + lineaLimpia;
                }
            }
        });

        if (opcionesEncontradas.length === 0) {
            opcionesEncontradas = [
                { letraRaw: 'a', texto: 'Verdadero', esCorrecta: false },
                { letraRaw: 'b', texto: 'Falso', esCorrecta: false }
            ];
        }

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

// --- GENERACIÓN ---
async function manejarGeneracion() {
  const data = await gen.generar()
  if (!data) return

  const preguntasObj = parsearExamen(data.preguntas, data.respuestas)

  if (preguntasObj.length === 0) {
    gen.error.value = "La IA no generó preguntas válidas. Prueba con otro tema."
    return
  }

  preguntasParseadas.value = preguntasObj
  modoExamenActivo.value = true
  reiniciarExamenActual()
}

// --- INTERACCIÓN MODO EXAMEN ---
function seleccionarRespuesta(index) {
    if (respuestaSeleccionada.value !== null) return;
    respuestaSeleccionada.value = index;

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

// Botón "atrás" sale del modo examen (o de resultados) antes de navegar de ruta
useBackCloseWhen(() => modoExamenActivo.value, () => salirModoExamen())

// --- CLASES DINÁMICAS ---
function claseOpcion(index) {
    if (respuestaSeleccionada.value === null) {
        return "border-white/5 bg-slate-800 hover:border-indigo-500/50 hover:bg-slate-700 cursor-pointer shadow-sm hover:shadow-md text-slate-300";
    }

    const estaOpcion = preguntaActual.value.opciones[index];
    const fueSeleccionada = respuestaSeleccionada.value === index;

    if (estaOpcion.esCorrecta) {
        return "bg-green-900/30 border-green-500 text-green-300 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] ring-1 ring-green-500/50";
    }

    if (fueSeleccionada) {
        return "bg-red-900/30 border-red-500 text-red-300 opacity-90";
    }

    return "border-white/5 bg-slate-900 opacity-40 grayscale";
}

function claseBotonLetra(index) {
    if (respuestaSeleccionada.value === null) {
        return "bg-slate-700 text-slate-400 border-white/10 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500";
    }

    const estaOpcion = preguntaActual.value.opciones[index];
    const fueSeleccionada = respuestaSeleccionada.value === index;

    if (estaOpcion.esCorrecta) {
        return "bg-green-600 text-white border-green-500 shadow-sm";
    }
    if (fueSeleccionada) {
        return "bg-red-500 text-white border-red-500";
    }

    return "bg-slate-800 text-slate-600 border-white/5";
}
</script>

<style scoped>
/* Scrollbar Dark */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Patrón de fondo (Grid Blanco SVG) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Slider Personalizado */
.slider-custom {
  background-image: linear-gradient(#6366f1, #6366f1);
  background-repeat: no-repeat;
}
.slider-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #6366f1;
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  transition: all 0.1s ease-in-out;
}
.slider-custom::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.4);
  transform: scale(1.1);
}

/* Optimización GPU para fondos */
.will-change-transform {
    will-change: transform;
}

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
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
    animation-delay: 4s;
}
.animate-shimmer {
  animation: shimmer 2s infinite;
}
.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
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
</style>
