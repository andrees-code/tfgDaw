<template>
  <div class="max-w-4xl mx-auto p-6" v-if="exam">
    <button @click="$router.back()" class="text-blue-600 mb-4 hover:underline">← Volver a la biblioteca</button>

    <h1 class="text-3xl font-bold mb-2">{{ exam.title }}</h1>
    <div class="flex gap-4 mb-8 text-sm font-medium text-gray-500">
      <span class="bg-gray-100 px-2 py-1 rounded">📊 {{ exam.tipo }}</span>
      <span class="bg-gray-100 px-2 py-1 rounded">🔥 {{ exam.dificultad }}</span>
      <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded">❓ {{ exam.numPreguntas }} preguntas</span>
    </div>

    <div v-for="(item, index) in examEstructurado" :key="index"
         class="mb-8 p-6 border rounded-2xl bg-white shadow-sm border-gray-200">

      <p class="font-bold text-lg text-gray-800 mb-4">
        <span class="text-blue-600">{{ index + 1 }}.</span> {{ item.enunciado }}
      </p>

      <div v-if="item.opciones.length > 0" class="grid grid-cols-1 gap-2 mb-4">
        <div v-for="(opt, oIdx) in item.opciones" :key="oIdx"
             class="p-3 bg-gray-50 border border-gray-100 rounded-lg text-gray-700 text-sm break-words whitespace-pre-wrap">
          {{ opt }}
        </div>
      </div>

      <div class="mt-4">
        <button
          @click="showAnswers[index] = !showAnswers[index]"
          class="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          :class="showAnswers[index] ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'"
        >
          {{ showAnswers[index] ? '🙈 Ocultar Respuesta' : '👁️ Ver Respuesta Correcta' }}
        </button>

        <Transition name="fade">
          <div v-if="showAnswers[index]" class="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg break-words whitespace-pre-wrap">
            <p class="text-green-800 font-bold text-sm uppercase mb-1">Respuesta correcta:</p>
            <p class="text-gray-700">{{ item.respuesta || 'No disponible' }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-20 text-gray-500">Procesando examen...</div>
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
