<template>
  <div>
    <div class="w-full bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-10 relative overflow-hidden ring-1 ring-white/5">

      <div class="absolute top-0 left-0 w-full h-1.5 opacity-80" :class="theme.topBar"></div>

      <div class="space-y-8">

        <div v-if="categoria.temas">
          <div class="flex p-1.5 bg-slate-950/50 rounded-2xl border border-white/5 w-fit mb-6" role="tablist" aria-label="Fuente de la pregunta">
            <button
              type="button"
              role="tab"
              :aria-selected="gen.fuenteActiva.value === 'apuntes'"
              @click="gen.fuenteActiva.value = 'apuntes'"
              :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all', gen.fuenteActiva.value === 'apuntes' ? theme.segmentActive : 'text-slate-400 hover:text-slate-300 hover:bg-white/5']"
            >
              📋 Pegar apuntes
            </button>
            <button
              type="button"
              role="tab"
              :aria-selected="gen.fuenteActiva.value === 'tema'"
              @click="gen.fuenteActiva.value = 'tema'"
              :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all', gen.fuenteActiva.value === 'tema' ? theme.segmentActive : 'text-slate-400 hover:text-slate-300 hover:bg-white/5']"
            >
              🎯 Elegir tema
            </button>
          </div>
        </div>

        <div v-if="!categoria.temas || gen.fuenteActiva.value === 'apuntes'" class="space-y-8">
          <div class="group relative">
             <label :for="`input-apuntes-${categoria.id}`" class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Fuente de conocimiento</label>
             <div class="relative transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-xl focus-within:shadow-black/20 rounded-2xl h-64">
              <textarea
                :id="`input-apuntes-${categoria.id}`"
                v-model="gen.apuntes.value"
                class="w-full h-full rounded-2xl bg-slate-950/50 border border-white/10 px-6 py-5 text-slate-200 resize-none placeholder:text-transparent focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none transition-all text-base shadow-inner relative z-10 custom-scrollbar"
                aria-label="Introduce tus apuntes aquí"
              ></textarea>
              <div v-if="!gen.apuntes.value && !gen.archivoNombre.value" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 gap-3 z-0">
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
                     :class="gen.archivoNombre.value ? 'bg-red-900/20 text-red-400' : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'">
                  <i class="fa-solid fa-file-pdf text-2xl" aria-hidden="true"></i>
                </div>
                <div class="min-w-0">
                    <p class="font-bold text-slate-300 truncate max-w-[150px] md:max-w-xs">
                      {{ gen.archivoNombre.value || '¿Prefieres usar un PDF?' }}
                    </p>
                    <p class="text-slate-400 text-xs mt-0.5">
                      {{ gen.archivoNombre.value ? 'Archivo cargado correctamente' : 'Hasta 50 páginas' }}
                    </p>
                </div>
              </div>
              <label :for="`pdf-upload-${categoria.id}`" class="px-5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-slate-300 text-sm font-bold cursor-pointer hover:border-indigo-500/50 hover:text-indigo-400 transition-all shadow-lg hover:shadow-black/20 whitespace-nowrap">
                Explorar
              </label>
              <input :id="`pdf-upload-${categoria.id}`" type="file" accept="application/pdf" class="hidden" @change="gen.handlePdfUploadCustom" />
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1 block pl-1">Elige un tema</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="t in categoria.temas"
              :key="t"
              type="button"
              @click="gen.tema.value = t"
              :class="['px-5 py-4 text-sm rounded-2xl border-2 text-left transition-all duration-200', gen.tema.value === t ? theme.optionActive : 'border-white/5 bg-slate-950/30 text-slate-400 hover:border-white/10 hover:bg-white/5']"
            >
              {{ t }}
            </button>
          </div>
          <div class="pt-2">
            <label :for="`tema-libre-${categoria.id}`" class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 block pl-1">O escribe tu propio tema</label>
            <input
              :id="`tema-libre-${categoria.id}`"
              v-model="gen.tema.value"
              type="text"
              placeholder="Ej: rotondas y cruces"
              class="w-full rounded-2xl bg-slate-950/50 border border-white/10 px-5 py-3.5 text-slate-200 placeholder:text-slate-600 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div>
            <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Nivel de desafío</label>
            <div class="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5" role="group" aria-label="Selecciona la dificultad">
              <button v-for="dif in ['facil', 'medio', 'dificil']" :key="dif" type="button" @click="gen.dificultad.value = dif" :class="['flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize', gen.dificultad.value === dif ? theme.segmentActive : 'text-slate-400 hover:text-slate-300 hover:bg-white/5']">{{ dif }}</button>
            </div>
          </div>
          <div>
            <label :for="`range-preguntas-${categoria.id}`" class="flex justify-between items-center text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 pl-1">
              <span>Cantidad</span>
              <span class="border px-3 py-1 rounded-lg shadow-sm" :class="theme.chip">{{ gen.numPreguntas.value }} preguntas</span>
            </label>
            <div class="relative px-1 py-2">
              <input :id="`range-preguntas-${categoria.id}`" aria-label="Número de preguntas" type="range" min="5" max="20" step="5" v-model.number="gen.numPreguntas.value" class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none slider-custom" :style="{ accentColor: theme.accentHex, '--slider-accent': theme.accentHex }" />
              <div class="flex justify-between mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1" aria-hidden="true"><span>5</span><span>10</span><span>15</span><span>20</span></div>
            </div>
          </div>
        </div>

        <div>
           <label class="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block pl-1">Formato de preguntas</label>
           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="radiogroup" aria-label="Formato de preguntas">
             <button role="radio" :aria-checked="gen.tipoExamen.value === tipo" v-for="tipo in tipos" :key="tipo" type="button" @click="gen.tipoExamen.value = tipo" :class="['h-full w-full px-5 py-5 text-sm rounded-2xl border-2 text-left transition-all duration-200 relative overflow-hidden group', gen.tipoExamen.value === tipo ? theme.optionActive : 'border-white/5 bg-slate-950/30 text-slate-400 hover:border-white/10 hover:bg-white/5']">
                <span class="relative z-10 flex items-center gap-2">{{ tipo }}</span>
             </button>
           </div>
        </div>

         <div class="mt-10">
            <button @click="gen.generar" :disabled="gen.loading.value" class="w-full group relative overflow-hidden text-white py-5 rounded-2xl font-bold text-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:-translate-y-0.5" :class="theme.button">
              <span v-if="gen.loading.value" class="flex items-center justify-center gap-3 relative z-10">
                <svg class="animate-spin h-5 w-5 text-indigo-200" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span class="animate-pulse">Generando examen...</span>
              </span>
              <span v-else class="flex items-center justify-center gap-2 relative z-10">
                Generar Examen <i class="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform text-indigo-200" aria-hidden="true"></i>
              </span>
            </button>
         </div>

         <div v-if="gen.error.value" class="text-center mt-6" role="alert">
             <div class="inline-flex items-center gap-2 bg-red-900/20 text-red-400 py-2 px-4 rounded-xl border border-red-500/20 text-sm font-medium">
               <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ gen.error.value }}
             </div>
             <div v-if="gen.esErrorDeAuth.value" class="mt-3">
                <button @click="$router.push('/login')" class="text-xs text-slate-400 underline hover:text-indigo-400">Iniciar sesión para continuar</button>
             </div>
         </div>

      </div>
    </div>

    <div v-if="gen.resultado.value" class="mt-12" role="region" aria-label="Resultado del examen">
         <div class="flex items-center justify-between mb-6 px-2">
            <h3 class="text-2xl font-bold text-slate-200">Resultado</h3>
            <span class="text-xs font-bold uppercase tracking-wider text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-500/20">Generado con éxito</span>
        </div>
        <div class="bg-slate-900 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden relative">
             <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-slate-800 to-slate-700"></div>
             <div class="p-8 md:p-10">
                <div class="whitespace-pre-wrap leading-loose text-base md:text-lg font-medium text-slate-300 font-sans">{{ gen.resultado.value }}</div>
             </div>
             <div class="bg-slate-950/50 border-t border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <button v-if="gen.hayRespuestas.value" @click="gen.toggleResuelto" class="px-6 py-3 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-indigo-400 hover:border-indigo-500/30 font-bold text-sm transition-all shadow-lg hover:shadow-black/20 flex items-center gap-2">
                    <i :class="gen.mostrarResuelto.value ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" aria-hidden="true"></i>
                    {{ gen.mostrarResuelto.value ? 'Ocultar soluciones' : 'Ver soluciones' }}
                </button>
                <span class="text-xs text-slate-500 font-medium">Guardado automáticamente</span>
             </div>
        </div>
        <div v-if="gen.mostrarResuelto.value" class="mt-6 bg-green-900/10 backdrop-blur-sm border border-green-500/20 rounded-[2rem] p-8 md:p-10 shadow-lg relative overflow-hidden">
            <h4 class="flex items-center gap-2 text-lg font-bold text-green-400 mb-6 pb-4 border-b border-green-500/20">
                <span class="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs"><i class="fa-solid fa-check" aria-hidden="true"></i></span>
                Hoja de Respuestas
            </h4>
            <div class="whitespace-pre-wrap leading-relaxed text-sm md:text-base text-slate-300 font-medium">{{ gen.respuestas.value }}</div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useExamGenerator } from '@/composables/useExamGenerator'

const props = defineProps({
  categoria: { type: Object, required: true },
})

const tipos = ['Test (4 opciones)', 'Verdadero/Falso', 'Respuestas cortas', 'Respuestas largas', 'Mix']

const theme = props.categoria.theme

const gen = useExamGenerator({
  categoria: props.categoria.id,
  modo: 'normal',
  tituloPrefix: `Examen ${props.categoria.label}`,
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #64748b; }

.slider-custom {
  background-image: linear-gradient(var(--slider-accent, #6366f1), var(--slider-accent, #6366f1));
  background-repeat: no-repeat;
}
.slider-custom::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--slider-accent, #6366f1);
  cursor: pointer;
  box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.2);
  transition: all 0.1s ease-in-out;
}
.slider-custom::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 6px rgba(148, 163, 184, 0.3);
  transform: scale(1.1);
}
</style>
