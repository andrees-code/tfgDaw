<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <Header />

    <div class="flex-grow w-full flex justify-center items-start gap-4 px-4 md:px-6 py-6">

      <div class="hidden xl:flex justify-center w-[160px] flex-shrink-0 sticky top-4" ref="leftAd">
      </div>

      <div class="w-full max-w-6xl flex flex-col md:flex-row gap-6">

        <aside class="w-full md:w-64 border rounded-xl p-4 flex flex-col h-fit bg-white shadow-sm">
          <div class="flex justify-between items-center mb-3">
            <h2 class="font-semibold text-slate-700 text-sm md:text-base">📘 Asignaturas</h2>
            <button
              v-if="asignaturas.length"
              @click="addAsignatura()"
              class="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
            >
              ➕ Añadir
            </button>
          </div>

          <div v-if="asignaturas.length">
            <div
              v-for="asig in asignaturas"
              :key="asig"
              class="mb-2 border rounded p-2 hover:bg-slate-50 transition"
            >
              <div class="flex justify-between items-center">
                <button
                  @click="toggleAsignatura(asig)"
                  class="font-medium flex-1 text-left text-slate-700 text-sm"
                >
                  {{ asig }}
                  <span class="ml-1 text-xs">
                    {{ openAsignaturas[asig] ? '▼' : '▶' }}
                  </span>
                </button>

                <button
                  @click="removeAsignatura(asig)"
                  class="text-red-400 hover:text-red-600 text-xs px-1"
                  title="Borrar asignatura y desasignar exámenes"
                >
                  🗑
                </button>
              </div>

              <ul
                v-if="openAsignaturas[asig]"
                class="text-xs text-gray-500 ml-3 mt-2 border-l-2 border-slate-200 pl-2"
              >
                <li
                  v-for="exam in examsByAsignatura(asig)"
                  :key="exam._id"
                  class="break-words mb-1"
                >
                  • {{ exam.title }}
                </li>
                <li v-if="!examsByAsignatura(asig).length" class="italic text-gray-400">
                  Sin exámenes
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="flex flex-1 justify-center items-center py-4">
            <button
              @click="addAsignatura()"
              class="px-3 py-1.5 bg-blue-600 text-white rounded text-xs md:text-sm hover:bg-blue-700 transition"
            >
              ➕ Crear asignatura
            </button>
          </div>
        </aside>

        <main class="flex-1 min-w-0">

          <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-800">📚 Biblioteca</h1>

          <div class="flex flex-col sm:flex-row gap-2 md:gap-3 mb-4 md:mb-6">
            <button
              @click="tab = 'historial'"
              :class="tabClass('historial')"
              class="w-full sm:w-auto transition-colors text-sm md:text-base"
            >
              🕒 Historial
            </button>

            <button
              @click="tab = 'favoritos'"
              :class="tabClass('favoritos')"
              class="w-full sm:w-auto transition-colors text-sm md:text-base"
            >
              ⭐ Favoritos
            </button>
          </div>

          <div
            v-for="exam in filteredExams"
            :key="exam._id"
            class="bg-white border rounded-xl p-4 md:p-5 mb-4 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 md:gap-4"
          >
            <div class="flex-1 w-full">
              <input
                v-model="exam.title"
                @blur="saveTitle(exam)"
                class="text-base md:text-lg font-semibold w-full border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent transition-colors mb-1 text-slate-800"
              />

              <div class="text-slate-500 text-xs md:text-sm flex flex-wrap gap-2 md:gap-3 items-center mt-1">
                <select
                  v-model="exam.asignatura"
                  @change="handleAsignaturaChange(exam)"
                  class="border border-slate-200 bg-slate-50 rounded px-2 py-1 focus:ring-2 focus:ring-blue-100 outline-none max-w-[140px] truncate"
                >
                  <option value="">Sin asignatura</option>
                  <option v-for="a in asignaturas" :key="a" :value="a">{{ a }}</option>
                </select>

                <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium truncate">{{ exam.tipo }}</span>
                <span class="text-slate-400 whitespace-nowrap">· {{ exam.numPreguntas }} pregs.</span>
              </div>
            </div>

            <div class="flex flex-row items-center gap-2 md:gap-3 justify-end lg:self-center mt-1 lg:mt-0">
              <RouterLink
                :to="`/examen/${exam._id}`"
                class="px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-700 transition shadow-sm"
              >
                Abrir
              </RouterLink>

              <button
                @click="toggleFav(exam)"
                class="p-1.5 md:p-2 text-lg md:text-xl hover:scale-110 transition"
                :class="exam.favorito ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'"
              >
                {{ exam.favorito ? '★' : '☆' }}
              </button>

              <button
                @click="removeExam(exam._id)"
                class="p-1.5 md:p-2 text-slate-400 hover:text-red-600 transition text-base md:text-lg"
              >
                🗑
              </button>
            </div>
          </div>

          <div
            v-if="!filteredExams.length"
            class="text-center py-10 md:py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300"
          >
            <p class="text-slate-500 mb-2 text-sm md:text-base">No hay exámenes en esta sección.</p>
            <RouterLink to="/" class="text-blue-600 font-medium hover:underline text-sm md:text-base">
              Crear nuevo examen
            </RouterLink>
          </div>

          <div class="mt-6 md:mt-8 flex justify-center w-full min-h-[60px]" ref="bottomAd">
          </div>

        </main>
      </div>

      <div class="hidden xl:flex justify-center w-[160px] flex-shrink-0 sticky top-4" ref="rightAd">
      </div>

    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  getExams,
  deleteExam,
  toggleFavorite,
  updateExamAsignatura,
  updateExamTitle
} from '@/services/examService'
import { userStore } from '@/stores/userStores'
import Header from '@/components/HeaderCompleto.vue'
// 4. AÑADIDO: Importación del Footer
import Footer from '@/components/FooterComponent.vue'

const exams = ref([])
const asignaturas = ref([])
const openAsignaturas = ref({})
const tab = ref('historial')

// Referencias para publicidad
const leftAd = ref(null)
const rightAd = ref(null)
const bottomAd = ref(null)

userStore.loadSession()

onMounted(async () => {
  // 1. Cargar exámenes
  exams.value = await getExams()

  // 2. Extraer asignaturas únicas de los exámenes cargados
  asignaturas.value = [...new Set(exams.value.map(e => e.asignatura).filter(Boolean))]

  // 3. Inicializar estado de acordeón
  asignaturas.value.forEach(a => { openAsignaturas.value[a] = false })

  // 4. Cargar anuncios
  cargarAnuncios()
})

/* =========================================
   LÓGICA DE PUBLICIDAD AISLADA
   ========================================= */
function cargarAnuncios() {
  const sideConfig = {
    key: 'c767c5331b742c5410e5e3d193dc4291',
    format: 'iframe',
    height: 600,
    width: 160,
    params: {}
  }
  const sideScript = 'https://www.highperformanceformat.com/c767c5331b742c5410e5e3d193dc4291/invoke.js'

  const width = window.innerWidth
  let bottomConfig = {}
  let bottomScript = ''

  if (width >= 500) {
    bottomConfig = {
      key: 'a5b39c8d227fe8cf72a19bb7e4c104ed',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {}
    }
    bottomScript = 'https://www.highperformanceformat.com/a5b39c8d227fe8cf72a19bb7e4c104ed/invoke.js'
  } else {
    bottomConfig = {
      key: '61c5ff75921e650e6548be96f6641978',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {}
    }
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

/* =========================================
   LÓGICA DE ASIGNATURAS Y EXÁMENES
   ========================================= */

const filteredExams = computed(() => tab.value === 'favoritos' ? exams.value.filter(e => e.favorito) : exams.value)
const examsByAsignatura = (asig) => exams.value.filter(e => e.asignatura === asig)
const toggleAsignatura = (asig) => { openAsignaturas.value[asig] = !openAsignaturas.value[asig] }

const addAsignatura = () => {
  const name = prompt('Nombre de la nueva asignatura:')
  if (!name) return
  if (!asignaturas.value.includes(name)) {
    asignaturas.value.push(name)
    openAsignaturas.value[name] = true // La abrimos automáticamente al crearla
  }
}

// 🔥 CAMBIO IMPORTANTE: Lógica de borrado persistente
const removeAsignatura = async (asig) => {
  if (!confirm(`¿Eliminar la asignatura "${asig}" y desasignar todos los exámenes?`)) return

  // 1. Identificar exámenes afectados
  const examsToUpdate = exams.value.filter(e => e.asignatura === asig)

  try {
    // 2. Actualizar en Base de Datos (Backend)
    // Hacemos todas las peticiones en paralelo para que sea rápido
    await Promise.all(examsToUpdate.map(exam =>
        updateExamAsignatura(exam._id, '')
    ))

    // 3. Actualizar estado Local (Frontend) solo si el backend respondió bien
    exams.value.forEach(e => {
      if (e.asignatura === asig) e.asignatura = ''
    })

    asignaturas.value = asignaturas.value.filter(a => a !== asig)
    delete openAsignaturas.value[asig]

  } catch (error) {
    console.error("Error al borrar asignatura:", error)
    alert("Hubo un error al guardar los cambios. Revisa tu conexión.")
  }
}

const handleAsignaturaChange = async (exam) => {
  try {
    await updateExamAsignatura(exam._id, exam.asignatura)

    // Si la asignatura seleccionada no estaba en la lista visual, la añadimos al momento
    if (exam.asignatura && !asignaturas.value.includes(exam.asignatura)) {
        asignaturas.value.push(exam.asignatura)
        openAsignaturas.value[exam.asignatura] = true
    }
  } catch {
    alert('No se pudo guardar la asignatura')
  }
}

const removeExam = async (id) => {
  if (!confirm('¿Eliminar examen?')) return
  await deleteExam(id)
  exams.value = exams.value.filter(e => e._id !== id)
}

const toggleFav = async (exam) => {
  const updated = await toggleFavorite(exam._id)
  exam.favorito = updated.favorito
}

const tabClass = (name) => `
  px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all duration-200
  ${tab.value === name ? 'bg-blue-600 text-white shadow-md transform scale-105' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
`

const saveTitle = async (exam) => {
  try {
    await updateExamTitle(exam._id, exam.title)
  } catch {
    alert('No se pudo actualizar el título')
  }
}
</script>
