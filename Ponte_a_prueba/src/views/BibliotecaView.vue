<template>
  <div class="min-h-screen flex flex-col font-sans text-slate-300 bg-slate-950 overflow-hidden relative selection:bg-indigo-500 selection:text-white">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.03] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-900/30 rounded-full blur-[100px] animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>
      <div class="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-screen will-change-transform"></div>

      <div class="absolute top-[15%] left-[5%] text-slate-700 text-9xl opacity-20 animate-float will-change-transform" aria-hidden="true">
        ✎
      </div>
      <div class="absolute bottom-[20%] right-[10%] text-indigo-900 text-9xl opacity-30 animate-float animation-delay-1000 will-change-transform" aria-hidden="true">
        📘
      </div>
    </div>

    <div class="relative z-20">
        <Header />
    </div>

    <div class="flex-grow w-full flex justify-center items-start px-4 md:px-6 py-8 relative z-10 animate-fade-in-up">

      <div class="w-full max-w-6xl flex flex-col md:flex-row gap-8">

        <aside class="w-full md:w-72 flex flex-col h-fit bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-2xl shadow-black/20 p-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-70"></div>

          <div class="flex justify-between items-center mb-6">
            <h2 class="font-bold text-slate-100 text-lg tracking-tight">📘 Asignaturas</h2>
            <button
              v-if="asignaturas.length"
              @click="addAsignatura()"
              type="button"
              class="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              aria-label="Añadir nueva asignatura"
            >
              ➕ Añadir
            </button>
          </div>

          <div v-if="asignaturas.length" class="space-y-2">
            <div
              v-for="asig in asignaturas"
              :key="asig"
              class="group border border-transparent hover:border-white/10 rounded-xl p-2 transition-all hover:bg-white/5"
            >
              <div class="flex justify-between items-center">
                <button
                  @click="toggleAsignatura(asig)"
                  type="button"
                  class="font-semibold flex-1 text-left text-slate-400 group-hover:text-indigo-300 text-sm transition-colors flex items-center justify-between"
                  :aria-expanded="!!openAsignaturas[asig]"
                  :aria-controls="'list-' + asig.replace(/\s+/g, '-')"
                >
                  {{ asig }}
                  <span class="ml-1 text-[10px] opacity-50" aria-hidden="true">
                    {{ openAsignaturas[asig] ? '▼' : '▶' }}
                  </span>
                </button>

                <button
                  @click="removeAsignatura(asig)"
                  type="button"
                  class="text-slate-600 hover:text-red-400 text-xs px-2 py-1 rounded-md hover:bg-red-900/20 transition-colors"
                  title="Borrar asignatura y desasignar exámenes"
                  aria-label="Eliminar asignatura"
                >
                  🗑
                </button>
              </div>

              <ul
                v-if="openAsignaturas[asig]"
                :id="'list-' + asig.replace(/\s+/g, '-')"
                class="text-xs text-slate-500 ml-2 mt-2 border-l-2 border-slate-700 pl-3 space-y-1.5"
              >
                <li
                  v-for="exam in examsByAsignatura(asig)"
                  :key="exam._id"
                  class="break-words"
                >
                  <span class="text-indigo-500 mr-1" aria-hidden="true">•</span> {{ exam.title }}
                </li>
                <li v-if="!examsByAsignatura(asig).length" class="italic text-slate-600">
                  Sin exámenes
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="flex flex-1 justify-center items-center py-8 flex-col gap-2">
             <div class="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-xl mb-2 animate-float border border-white/5" aria-hidden="true">📚</div>
            <button
              @click="addAsignatura()"
              type="button"
              class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/20"
            >
              Crear tu primera asignatura
            </button>
          </div>
        </aside>

        <main class="flex-1 min-w-0">

          <header class="mb-8">
              <h1 class="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight mb-2">Biblioteca <span class="text-indigo-500">.</span></h1>
              <p class="text-slate-400">Gestiona tus retos y repasa tu historial.</p>
          </header>

          <div class="flex p-1.5 bg-slate-900/80 backdrop-blur-sm rounded-2xl w-fit mb-8 gap-1 border border-white/10" role="tablist">
            <button
              @click="tab = 'historial'"
              type="button"
              role="tab"
              :aria-selected="tab === 'historial'"
              :class="tab === 'historial' ? 'bg-slate-800 text-indigo-400 shadow-sm font-bold ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'"
              class="px-6 py-2.5 rounded-xl text-sm transition-all duration-300"
            >
              🕒 Historial
            </button>

            <button
              @click="tab = 'favoritos'"
              type="button"
              role="tab"
              :aria-selected="tab === 'favoritos'"
              :class="tab === 'favoritos' ? 'bg-slate-800 text-indigo-400 shadow-sm font-bold ring-1 ring-white/5' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'"
              class="px-6 py-2.5 rounded-xl text-sm transition-all duration-300"
            >
              ⭐ Favoritos
            </button>
          </div>

          <div class="space-y-4 list-container">
            <transition-group name="slide-fade">
                <div
                    v-for="exam in filteredExams"
                    :key="exam._id"
                    class="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 md:p-6 shadow-lg hover:shadow-indigo-500/10 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 relative overflow-hidden"
                >
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>

                    <div class="flex-1 w-full relative z-10">
                    <input
                        v-model="exam.title"
                        @blur="saveTitle(exam)"
                        aria-label="Título del examen"
                        class="text-lg md:text-xl font-bold w-full bg-transparent border-b border-transparent hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none transition-colors mb-2 text-slate-200 placeholder-slate-600 py-1"
                    />

                    <div class="flex flex-wrap gap-2 md:gap-3 items-center mt-1">
                        <div class="relative group/select">
                            <select
                            v-model="exam.asignatura"
                            @change="handleAsignaturaChange(exam)"
                            aria-label="Asignar asignatura"
                            class="appearance-none cursor-pointer border border-white/10 bg-slate-950/50 hover:bg-slate-900 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all max-w-[150px] truncate"
                            >
                            <option value="" class="bg-slate-900 text-slate-300">Sin asignatura</option>
                            <option v-for="a in asignaturas" :key="a" :value="a" class="bg-slate-900 text-slate-300">{{ a }}</option>
                            </select>
                            <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs" aria-hidden="true">▼</div>
                        </div>

                        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {{ exam.tipo }}
                        </span>
                        <span class="text-xs text-slate-500 font-medium">
                            <i class="mr-1" aria-hidden="true">📝</i>{{ exam.numPreguntas }} pregs.
                        </span>
                    </div>
                    </div>

                    <div class="flex flex-row items-center gap-3 justify-end lg:self-center mt-1 lg:mt-0 relative z-10 border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0 w-full lg:w-auto">

                    <button
                        @click="toggleFav(exam)"
                        type="button"
                        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-800 border border-white/5 hover:border-yellow-500/50 shadow-sm"
                        :class="exam.favorito ? 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30' : 'text-slate-600 hover:text-yellow-400'"
                        :title="exam.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                        :aria-label="exam.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                        :aria-pressed="exam.favorito"
                    >
                        <span class="text-lg leading-none mt-1" aria-hidden="true">{{ exam.favorito ? '★' : '☆' }}</span>
                    </button>

                    <button
                        @click="removeExam(exam._id)"
                        type="button"
                        class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-slate-800 border border-white/5 hover:border-red-500/30 hover:bg-red-900/20 text-slate-600 hover:text-red-400 shadow-sm"
                        title="Eliminar examen"
                        aria-label="Eliminar examen"
                    >
                        <span class="text-sm" aria-hidden="true">🗑</span>
                    </button>

                    <RouterLink
                        :to="`/examen/${exam._id}`"
                        class="ml-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden group/btn relative"
                    >
                        <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer"></div>
                        <span class="relative z-10">Abrir</span> <span class="text-xs relative z-10" aria-hidden="true">→</span>
                    </RouterLink>
                    </div>
                </div>
            </transition-group>
          </div>

          <div
            v-if="!filteredExams.length"
            class="text-center py-16 px-6 bg-slate-900/30 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-700 mt-4 animate-slide-up-fade"
          >
            <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-slate-600 animate-float border border-white/5" aria-hidden="true">📭</div>
            <p class="text-slate-300 font-medium mb-1">No hay exámenes en esta sección.</p>
            <p class="text-slate-500 text-sm mb-6">Parece que aún no has empezado.</p>
            <RouterLink to="/" class="inline-flex px-6 py-3 bg-slate-800 text-indigo-400 font-bold rounded-xl shadow-md border border-white/10 hover:bg-slate-700 transition-all">
              Crear nuevo reto
            </RouterLink>
          </div>

        </main>
      </div>

    </div>

    <div class="relative z-20">
        <Footer />
    </div>
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
import Footer from '@/components/FooterComponent.vue'

const exams = ref([])
const asignaturas = ref([])
const openAsignaturas = ref({})
const tab = ref('historial')

userStore.loadSession()

onMounted(async () => {
  // ✅ OPTIMIZACIÓN: SEO - Títulos y Meta
  document.title = "Tu Biblioteca - Historial de Exámenes";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Gestiona tu historial de exámenes, organiza tus asignaturas y repasa tus retos favoritos.";

  // 1. Cargar exámenes
  exams.value = await getExams()

  // 2. Extraer asignaturas únicas
  asignaturas.value = [...new Set(exams.value.map(e => e.asignatura).filter(Boolean))]

  // 3. Inicializar acordeón
  asignaturas.value.forEach(a => { openAsignaturas.value[a] = false })
})

/* =========================================
   LÓGICA DE ASIGNATURAS Y EXÁMENES
   ========================================= */

const filteredExams = computed(() => tab.value === 'favoritos' ? exams.value.filter(e => e.favorito) : exams.value)
// Nota: Usar métodos en template no es ideal, pero para listas pequeñas es seguro.
const examsByAsignatura = (asig) => exams.value.filter(e => e.asignatura === asig)
const toggleAsignatura = (asig) => { openAsignaturas.value[asig] = !openAsignaturas.value[asig] }

const addAsignatura = () => {
  const name = prompt('Nombre de la nueva asignatura:')
  if (!name) return
  if (!asignaturas.value.includes(name)) {
    asignaturas.value.push(name)
    openAsignaturas.value[name] = true
  }
}

const removeAsignatura = async (asig) => {
  if (!confirm(`¿Eliminar la asignatura "${asig}" y desasignar todos los exámenes?`)) return

  const examsToUpdate = exams.value.filter(e => e.asignatura === asig)

  try {
    await Promise.all(examsToUpdate.map(exam =>
        updateExamAsignatura(exam._id, '')
    ))

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

const saveTitle = async (exam) => {
  try {
    await updateExamTitle(exam._id, exam.title)
  } catch {
    alert('No se pudo actualizar el título')
  }
}
</script>

<style scoped>
/* =========================================
   1. ESTILOS BASE Y RENDIMIENTO
   ========================================= */

/* Mejora de renderizado para listas largas */
.list-container {
  content-visibility: auto; /* El navegador no renderiza lo que no está en pantalla */
  contain-intrinsic-size: 1000px; /* Tamaño estimado para evitar saltos de scroll */
}

/* Optimización GPU para elementos animados */
.will-change-transform {
    will-change: transform;
}

/* Patrón de cuadrícula */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* =========================================
   2. ANIMACIONES
   ========================================= */

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animation-delay-1000 {
  animation-delay: 1s;
}

.animate-blob {
  animation: blob 10s infinite;
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

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

.animate-slide-up-fade {
  animation: slideUpFade 0.6s ease-out;
}

/* Transiciones Vue */
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

/* =========================================
   3. KEYFRAMES
   ========================================= */

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
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