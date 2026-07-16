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
            <h2 class="font-bold text-slate-100 text-lg tracking-tight">📁 Carpetas</h2>
            <button
              @click="newFolder(null)"
              type="button"
              class="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              aria-label="Añadir nueva carpeta"
            >
              ➕ Carpeta
            </button>
          </div>

          <button
            v-if="selectedFolderId"
            @click="selectedFolderId = ''"
            type="button"
            class="w-full text-left text-xs font-bold text-indigo-400 hover:text-indigo-300 px-2 py-1.5 mb-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            ✕ Ver todos los exámenes
          </button>

          <!-- Input inline para crear carpeta raíz -->
          <div v-if="creatingIn === 'root'" class="flex items-center gap-1.5 px-2 py-1 mb-1">
            <span class="text-indigo-400/60 text-sm" aria-hidden="true">📁</span>
            <input
              :ref="el => el && el.focus()"
              v-model="rootFolderName"
              type="text"
              placeholder="Nombre de la carpeta..."
              class="flex-1 min-w-0 bg-slate-950/70 border border-indigo-500/40 rounded-md px-1.5 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
              @keydown.enter.prevent="submitRootFolder"
              @keydown.esc="creatingIn = null; rootFolderName = ''"
              @blur="submitRootFolder"
              aria-label="Nombre de la nueva carpeta"
            />
          </div>

          <div
            class="space-y-1 min-h-[40px] rounded-xl transition-colors"
            :class="rootDragOver ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : ''"
            @dragenter.prevent
            @dragover.prevent="rootDragOver = true"
            @dragleave="rootDragOver = false"
            @drop="onDropToRoot"
          >
            <ExamFolderTree :nodes="folderTree" />
            <div v-if="!folderTree.length && creatingIn !== 'root'" class="px-2 py-6 text-center text-xs text-slate-600">
              Crea carpetas para organizar tus exámenes.
            </div>
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

          <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" aria-hidden="true">🔍</span>
              <input
                v-model="search"
                type="text"
                placeholder="Buscar por título..."
                aria-label="Buscar examen por título"
                class="w-full pl-9 pr-3 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
              />
            </div>

            <select
              v-model="sortBy"
              aria-label="Ordenar exámenes"
              class="px-3 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="az">Título (A-Z)</option>
              <option value="za">Título (Z-A)</option>
            </select>

            <span class="text-xs text-slate-500 font-medium whitespace-nowrap px-1">
              {{ filteredExams.length }} examen{{ filteredExams.length === 1 ? '' : 'es' }}
            </span>
          </div>

          <div class="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl divide-y divide-white/5 overflow-hidden shadow-lg list-container">
            <transition-group name="slide-fade">
                <div
                    v-for="exam in filteredExams"
                    :key="exam._id"
                    draggable="true"
                    @dragstart="onDragStartExam($event, exam)"
                    class="group flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-200 cursor-grab active:cursor-grabbing"
                >
                    <div class="text-xl shrink-0" aria-hidden="true">{{ typeIcon(exam.tipo) }}</div>

                    <div class="flex-1 min-w-0">
                      <input
                          v-model="exam.title"
                          @blur="saveTitle(exam)"
                          aria-label="Editar título del examen"
                          class="block w-full bg-transparent text-sm md:text-base font-semibold text-slate-200 placeholder-slate-500 border-b border-transparent hover:border-indigo-500/40 focus:border-indigo-500 focus:outline-none transition-colors truncate"
                      />
                      <div class="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-0.5 text-xs text-slate-500">
                          <span class="text-purple-300">{{ exam.tipo }}</span>
                          <span aria-hidden="true">·</span>
                          <span>{{ exam.numPreguntas }} pregs.</span>
                          <span aria-hidden="true">·</span>
                          <span>{{ formatDate(exam.createdAt) }}</span>
                          <template v-if="folderName(exam)">
                            <span aria-hidden="true">·</span>
                            <span class="text-indigo-400 font-medium truncate max-w-[120px]" title="Arrastra el examen a otra carpeta en la barra lateral">📁 {{ folderName(exam) }}</span>
                          </template>
                      </div>
                    </div>

                    <div class="hidden md:block shrink-0 relative">
                        <select
                        :value="exam.folderId || ''"
                        @change="onExamFolderSelect(exam, $event.target.value)"
                        @click.stop
                        aria-label="Guardar examen en carpeta"
                        class="appearance-none cursor-pointer border border-white/10 bg-slate-950/50 hover:bg-slate-900 rounded-lg pl-2.5 pr-7 py-1.5 text-[11px] font-bold text-slate-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 outline-none transition-all max-w-[150px] truncate"
                        >
                        <option value="" class="bg-slate-900 text-slate-300">📂 Sin carpeta</option>
                        <option v-for="opt in folderOptions" :key="opt.id" :value="opt.id" class="bg-slate-900 text-slate-300">{{ opt.label }}</option>
                        </select>
                        <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs" aria-hidden="true">▼</div>
                    </div>

                    <div class="flex items-center gap-1 shrink-0">

                    <button
                        @click="toggleFav(exam)"
                        type="button"
                        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-yellow-900/20"
                        :class="exam.favorito ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'"
                        :title="exam.favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'"
                        :aria-label="exam.favorito ? 'Quitar examen de favoritos' : 'Añadir examen a favoritos'"
                        :aria-pressed="exam.favorito"
                    >
                        <span class="text-base leading-none" aria-hidden="true">{{ exam.favorito ? '★' : '☆' }}</span>
                    </button>

                    <button
                        @click="removeExam(exam._id)"
                        type="button"
                        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-slate-600 hover:text-red-400 hover:bg-red-900/20"
                        title="Eliminar examen"
                        aria-label="Eliminar examen"
                    >
                        <span class="text-sm" aria-hidden="true">🗑</span>
                    </button>

                    <RouterLink
                        :to="`/examen/${exam._id}`"
                        class="ml-1 px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-indigo-500 transition-all shadow-md shadow-indigo-900/20 flex items-center gap-1.5 whitespace-nowrap"
                    >
                        Abrir <span aria-hidden="true">→</span>
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
import { ref, reactive, onMounted, computed, provide } from 'vue'
import {
  deleteExam,
  toggleFavorite,
  updateExamTitle
} from '@/services/examService'
import { useExamLibrary } from '@/composables/useExamLibrary'
import { userStore } from '@/stores/userStores'
import Header from '@/components/HeaderCompleto.vue'
import Footer from '@/components/FooterComponent.vue'
import ExamFolderTree from '@/components/biblioteca/ExamFolderTree.vue'

const lib = useExamLibrary()
const { exams, folders, folderTree, folderOptions, addFolder, renameFolder, moveFolder, removeFolder, moveExamToFolder } = lib

const tab = ref('historial')
const search = ref('')
const sortBy = ref('recientes')
const selectedFolderId = ref('')
const expandedMap = reactive({})
const creatingIn = ref(null) // 'root' | folderId | null
const rootFolderName = ref('')
const rootDragOver = ref(false)

// Carga de sesión sin bloqueo
try {
  userStore.loadSession()
} catch (e) {
  console.error("Sesión no cargada:", e)
}

onMounted(async () => {
  // ✅ SEO: Títulos dinámicos
  document.title = "Tu Biblioteca - Historial de Exámenes";
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Gestiona tu historial de exámenes, organiza tus carpetas y repasa tus retos favoritos.";

  await lib.loadAll()
})

/* =========================================
   LÓGICA DE CARPETAS Y EXÁMENES
   ========================================= */

const filteredExams = computed(() => {
  let list = tab.value === 'favoritos' ? exams.value.filter(e => e.favorito) : exams.value

  if (selectedFolderId.value) {
    list = list.filter(e => e.folderId === selectedFolderId.value)
  }

  const term = search.value.trim().toLowerCase()
  if (term) {
    list = list.filter(e => e.title?.toLowerCase().includes(term))
  }

  list = [...list].sort((a, b) => {
    if (sortBy.value === 'az') return (a.title || '').localeCompare(b.title || '')
    if (sortBy.value === 'za') return (b.title || '').localeCompare(a.title || '')
    if (sortBy.value === 'antiguos') return new Date(a.createdAt) - new Date(b.createdAt)
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  return list
})

const folderName = (exam) => folders.value.find(f => f.id === exam.folderId)?.name || ''

const TYPE_ICONS = {
  'Test (4 opciones)': '📝',
  'Verdadero/Falso': '✅',
  'Respuestas cortas': '✏️',
  'Respuestas largas': '📄',
}
const typeIcon = (tipo) => TYPE_ICONS[tipo] || '📘'

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

// ----- Carpetas: creación inline -----
function newFolder(parentId = null) {
  creatingIn.value = parentId ?? 'root'
  if (parentId) expandedMap[parentId] = true
}

async function confirmCreateFolder(name) {
  const target = creatingIn.value
  creatingIn.value = null
  if (!target || !name || !name.trim()) return
  await lib.addFolder(name.trim(), target === 'root' ? null : target)
  if (target !== 'root') expandedMap[target] = true
}

function submitRootFolder() {
  const name = rootFolderName.value
  rootFolderName.value = ''
  if (creatingIn.value === 'root') confirmCreateFolder(name)
}

function toggleFolder(folderId) {
  expandedMap[folderId] = !expandedMap[folderId]
  selectedFolderId.value = selectedFolderId.value === folderId ? '' : folderId
}

// ----- Drag & drop -----
function onDragStartExam(e, exam) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'exam', id: exam._id }))
  e.dataTransfer.effectAllowed = 'move'
}

// Guardar examen en la carpeta elegida en el desplegable ('' = raíz)
function onExamFolderSelect(exam, value) {
  moveExamToFolder(exam, value || null)
}

function onDropToRoot(e) {
  rootDragOver.value = false
  let payload
  try {
    payload = JSON.parse(e.dataTransfer.getData('text/plain'))
  } catch {
    return
  }
  if (!payload) return
  if (payload.kind === 'exam') {
    const exam = exams.value.find(ex => ex._id === payload.id)
    if (exam && exam.folderId) moveExamToFolder(exam, null)
  } else if (payload.kind === 'folder') {
    const folder = folders.value.find(f => f.id === payload.id)
    if (folder && folder.parentId) moveFolder(folder, null)
  }
}

provide('examCtx', {
  folders, exams, folderTree,
  expandedMap, selectedFolderId, creatingIn,
  newFolder, confirmCreateFolder, toggleFolder,
  renameFolder, removeFolder, moveFolder, moveExamToFolder,
  onDragStartExam,
})

// ----- Exámenes -----
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUpFade {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>