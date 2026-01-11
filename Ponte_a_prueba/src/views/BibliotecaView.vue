<template>
  <div>
    <Header />

    <div class="max-w-6xl mx-auto p-6 flex gap-6">

      <!-- 🗂 MENÚ ASIGNATURAS -->
      <aside class="w-64 border rounded p-4 flex flex-col">
        <div class="flex justify-between items-center mb-3">
          <h2 class="font-semibold">📘 Asignaturas</h2>
          <button
            v-if="asignaturas.length"
            @click="addAsignatura()"
            class="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            ➕ Añadir
          </button>
        </div>

        <!-- Lista de asignaturas -->
        <div v-if="asignaturas.length">
          <div
            v-for="asig in asignaturas"
            :key="asig"
            class="mb-2 border rounded p-1"
          >
            <!-- CABECERA ASIGNATURA -->
            <div class="flex justify-between items-center">
              <button
                @click="toggleAsignatura(asig)"
                class="font-medium text-left flex-1 text-left"
              >
                {{ asig }} <span>{{ openAsignaturas[asig] ? '▾' : '▸' }}</span>
              </button>

              <!-- Botón eliminar asignatura -->
              <button
                @click="removeAsignatura(asig)"
                class="text-red-600 text-sm px-1"
                title="Eliminar asignatura"
              >
                🗑
              </button>
            </div>

            <!-- LISTA DE EXÁMENES -->
            <ul
              v-if="openAsignaturas[asig]"
              class="text-sm text-gray-600 ml-4 mt-1"
            >
              <li
                v-for="exam in examsByAsignatura(asig)"
                :key="exam._id"
                class="truncate"
              >
                • {{ exam.title }}
              </li>

              <li v-if="!examsByAsignatura(asig).length" class="italic text-gray-400">
                Sin exámenes
              </li>
            </ul>
          </div>
        </div>

        <!-- Botón central cuando no hay asignaturas -->
        <div
          v-else
          class="flex flex-1 justify-center items-center"
        >
          <button
            @click="addAsignatura()"
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            ➕ Añadir asignatura
          </button>
        </div>
      </aside>

      <!-- 📚 CONTENIDO PRINCIPAL -->
      <main class="flex-1">
        <h1 class="text-2xl font-bold mb-6">📚 Biblioteca</h1>

        <!-- Tabs -->
        <div class="flex gap-4 mb-6">
          <button @click="tab = 'historial'" :class="tabClass('historial')">
            🕒 Historial
          </button>
          <button @click="tab = 'favoritos'" :class="tabClass('favoritos')">
            ⭐ Favoritos
          </button>
        </div>

        <!-- Lista de exámenes -->
        <div
          v-for="exam in filteredExams"
          :key="exam._id"
          class="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:justify-between md:items-center gap-3"
        >
          <!-- IZQUIERDA: Info del examen -->
          <div class="flex-1">
            <!-- Título editable -->
            <input
              v-model="exam.title"
              @blur="saveTitle(exam)"
              class="text-lg font-semibold w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 mb-1"
            />

            <!-- Asignatura / Tipo / Preguntas -->
            <div class="text-gray-500 text-sm flex flex-wrap gap-2 items-center">
              <select
                v-model="exam.asignatura"
                @change="handleAsignaturaChange(exam)"
                class="border rounded px-1 text-sm"
              >
                <option value="">Sin asignatura</option>
                <option
                  v-for="a in asignaturas"
                  :key="a"
                  :value="a"
                >
                  {{ a }}
                </option>
              </select>

              <span>· {{ exam.tipo }}</span>
              <span>· {{ exam.numPreguntas }} preguntas</span>
            </div>
          </div>

          <!-- DERECHA: Acciones -->
          <div class="flex items-center gap-3 mt-2 md:mt-0">
            <RouterLink
              :to="`/examen/${exam._id}`"
              class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
            >
              Abrir
            </RouterLink>

            <button
              @click="toggleFav(exam)"
              class="text-xl hover:text-yellow-500 transition"
              :title="exam.favorito ? 'Quitar favorito' : 'Marcar favorito'"
            >
              {{ exam.favorito ? '⭐' : '☆' }}
            </button>

            <button
              @click="removeExam(exam._id)"
              class="text-red-600 hover:text-red-800 transition text-lg"
              title="Eliminar examen"
            >
              🗑
            </button>
          </div>
        </div>

        <p v-if="!filteredExams.length" class="text-gray-500">
          No hay exámenes aquí.
        </p>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getExams, deleteExam, toggleFavorite, updateExamAsignatura } from '@/services/examService'
import { userStore } from '@/stores/userStores'
import Header from '@/components/HeaderCompleto.vue'
import { updateExamTitle } from '@/services/examService'

const exams = ref([])
const asignaturas = ref([])
const openAsignaturas = ref({})
const tab = ref('historial')

// 🔐 Sesión
userStore.loadSession()

// 📥 Cargar exámenes
onMounted(async () => {
  exams.value = await getExams()

  // Extraer asignaturas únicas existentes
  asignaturas.value = [
    ...new Set(exams.value.map(e => e.asignatura).filter(Boolean))
  ]

  // Inicializar menú desplegable cerrado
  asignaturas.value.forEach(a => {
    openAsignaturas.value[a] = false
  })
})

// 📚 Filtro por tabs
const filteredExams = computed(() => {
  if (tab.value === 'favoritos') {
    return exams.value.filter(e => e.favorito)
  }
  return exams.value
})

// 📘 Exámenes por asignatura (menú lateral)
const examsByAsignatura = (asig) =>
  exams.value.filter(e => e.asignatura === asig)

// 🔽 Toggle desplegable
const toggleAsignatura = (asig) => {
  openAsignaturas.value[asig] = !openAsignaturas.value[asig]
}

// 🏷 Añadir asignatura desde botón
const addAsignatura = async () => {
  const name = prompt('Nombre de la nueva asignatura:')
  if (!name) return
  if (!asignaturas.value.includes(name)) {
    asignaturas.value.push(name)
    openAsignaturas.value[name] = false
  }
}

// 🏷 Eliminar asignatura
const removeAsignatura = (asig) => {
  if (!confirm(`Eliminar la asignatura "${asig}" y desasignar todos los exámenes?`)) return

  // Desasignar exámenes
  exams.value.forEach(e => {
    if (e.asignatura === asig) e.asignatura = ''
  })

  // Eliminar de la lista
  asignaturas.value = asignaturas.value.filter(a => a !== asig)

  // Eliminar estado desplegable
  delete openAsignaturas.value[asig]
}

// 🏷 Asignatura de examen
const handleAsignaturaChange = async (exam) => {
  try {
    await updateExamAsignatura(exam._id, exam.asignatura)
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar la asignatura')
  }
}

// ❌ Eliminar examen
const removeExam = async (id) => {
  if (!confirm('¿Eliminar examen?')) return
  await deleteExam(id)
  exams.value = exams.value.filter(e => e._id !== id)
}

// ⭐ Favoritos
const toggleFav = async (exam) => {
  const updated = await toggleFavorite(exam._id)
  exam.favorito = updated.favorito
}

// 🎨 Tabs
const tabClass = (name) => `
  px-4 py-2 rounded
  ${tab.value === name ? 'bg-blue-600 text-white' : 'bg-gray-200'}
`

// 🖊 Guardar título
const saveTitle = async (exam) => {
  try {
    await updateExamTitle(exam._id, exam.title)
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el título')
  }
}
</script>
