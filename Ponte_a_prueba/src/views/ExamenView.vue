<template>
  <div class="min-h-screen font-sans text-slate-300 bg-slate-950 relative overflow-hidden selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[100px] opacity-60 animate-blob mix-blend-screen"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] opacity-60 animate-blob animation-delay-2000 mix-blend-screen"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto p-6 lg:py-12" v-if="exam">

      <button
        @click="$router.back()"
        class="group flex items-center gap-2 text-indigo-400 mb-8 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide"
      >
        <span class="w-8 h-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center group-hover:border-indigo-500/50 transition-all">←</span>
        Volver a la biblioteca
      </button>

      <div class="mb-10">
        <h1 class="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-lg leading-tight">{{ exam.title }}</h1>

        <div class="flex flex-wrap gap-3 text-sm font-bold">
          <span class="bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg text-slate-400 flex items-center gap-2">
            <i class="fa-solid fa-chart-simple text-indigo-500"></i> {{ exam.tipo }}
          </span>
          <span class="bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg text-slate-400 flex items-center gap-2">
            <i class="fa-solid fa-fire text-orange-500"></i> {{ exam.dificultad }}
          </span>
          <span class="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <i class="fa-solid fa-circle-question"></i> {{ exam.numPreguntas }} preguntas
          </span>
        </div>
      </div>

      <div
        v-for="(item, index) in examEstructurado"
        :key="index"
        class="mb-6 p-6 md:p-8 border border-white/10 rounded-2xl bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 opacity-50"></div>

        <p class="font-bold text-lg md:text-xl text-slate-200 mb-6 leading-relaxed">
          <span class="text-indigo-400 inline-block mr-2 text-2xl font-black opacity-50">{{ index + 1 }}.</span>
          {{ item.enunciado }}
        </p>

        <div v-if="item.opciones.length > 0" class="grid grid-cols-1 gap-3 mb-6">
          <div
            v-for="(opt, oIdx) in item.opciones"
            :key="oIdx"
            class="p-4 bg-slate-950/50 border border-white/5 rounded-xl text-slate-400 text-sm md:text-base break-words whitespace-pre-wrap hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
          >
            {{ opt }}
          </div>
        </div>

        <div class="mt-6 border-t border-white/5 pt-6">
          <button
            @click="showAnswers[index] = !showAnswers[index]"
            class="text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
            :class="showAnswers[index] ? 'bg-slate-800 text-slate-400 border border-white/5 hover:text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'"
          >
            <span>{{ showAnswers[index] ? '🙈 Ocultar Respuesta' : '👁️ Ver Respuesta Correcta' }}</span>
          </button>

          <Transition name="fade">
            <div v-if="showAnswers[index]" class="mt-4 p-5 bg-green-900/10 border border-green-500/30 rounded-xl break-words whitespace-pre-wrap relative overflow-hidden">
              <div class="absolute inset-0 bg-green-500/5 pointer-events-none"></div>
              <p class="text-green-400 font-bold text-xs uppercase mb-2 tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-check-circle"></i> Respuesta correcta
              </p>
              <p class="text-green-100 font-medium text-lg">{{ item.respuesta || 'No disponible' }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <div v-else class="min-h-screen flex flex-col items-center justify-center relative z-10">
       <div class="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
       <p class="text-slate-500 font-medium animate-pulse">Procesando examen...</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getExamById } from '@/services/examService'

const route = useRoute()
const exam = ref(null)
const showAnswers = ref({})

// Procesar preguntas y respuestas respetando todo el texto
const examEstructurado = computed(() => {
  if (!exam.value) return []

  const rawPreguntas = exam.value.preguntas.split('\n').map(l => l.trim()).filter(Boolean)
  const rawRespuestas = exam.value.respuestas.split('\n').map(l => l.trim()).filter(Boolean)

  const resultado = []
  let currentItem = null

  rawPreguntas.forEach(linea => {
    if (/^\d+\./.test(linea) && !linea.match(/^[a-d]\)/)) {
      if (currentItem) resultado.push(currentItem)
      currentItem = { enunciado: linea.replace(/^\d+\.\s*/, ''), opciones: [], respuesta: '' }
    } else if (/^[a-d]\)/.test(linea)) {
      if (currentItem) currentItem.opciones.push(linea)
    }
  })

  if (currentItem) resultado.push(currentItem)

  // Emparejar respuestas
  resultado.forEach((pregunta, i) => {
    const rFound = rawRespuestas.find(r => r.startsWith(`${i+1}.`))
    if (rFound) pregunta.respuesta = rFound.replace(/^\d+\.\s*/, '').replace(/^Respuesta:\s*/i, '')
  })

  return resultado
})

onMounted(async () => {
  try {
    exam.value = await getExamById(route.params.id)
  } catch (err) {
    console.error("Error al cargar:", err)
  }
})
</script>

<style scoped>
/* Grid Pattern */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones */
.animate-blob {
  animation: blob 7s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

/* Transiciones Vue */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
