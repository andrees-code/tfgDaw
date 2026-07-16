<template>
  <div class="flex flex-col h-screen overflow-hidden font-sans text-slate-300 bg-slate-950 selection:bg-indigo-500 selection:text-white relative">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen will-change-transform"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>
      <div class="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000 mix-blend-screen will-change-transform"></div>
    </div>

    <Header class="flex-shrink-0 relative z-20" />

    <div class="flex-1 flex overflow-hidden relative z-10">

      <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showSidebar" @click="showSidebar = false" class="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm" aria-hidden="true"></div>
      </transition>

      <!-- SIDEBAR -->
      <aside
        class="fixed md:static inset-y-0 left-0 w-[85vw] md:w-80 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 text-slate-400 flex flex-col z-40
               transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none"
        :class="showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <div class="p-6 pb-4 shrink-0">
          <div class="flex items-center justify-between mb-6">
            <h1 class="font-serif text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <IconNotebook class="w-8 h-8 text-indigo-500" aria-hidden="true" />
              <span>Estudio<span class="text-indigo-500">.</span></span>
            </h1>
            <button @click="showSidebar = false" class="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors" aria-label="Cerrar menú">
              <IconX class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div class="flex gap-2 mb-6">
              <button @click="newNote('Documento')" class="flex-1 py-3 bg-slate-800/50 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl shadow-lg border border-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group hover:border-indigo-500" aria-label="Crear nuevo documento">
                  <IconFile class="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" aria-hidden="true" /> <span class="hidden sm:inline">Doc</span>
              </button>
               <button @click="newNote('Post-it')" class="flex-1 py-3 bg-slate-800/50 hover:bg-amber-500 hover:text-white text-slate-300 rounded-xl shadow-lg border border-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group hover:border-amber-500" aria-label="Crear nuevo post-it">
                  <IconSticky class="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" aria-hidden="true" /> <span class="hidden sm:inline">Post</span>
              </button>
              <button @click="newFolder(null)" class="flex-1 py-3 bg-slate-800/50 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl shadow-lg border border-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group hover:border-indigo-500" aria-label="Crear nueva carpeta">
                  <IconFolderPlus class="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" aria-hidden="true" /> <span class="hidden sm:inline">Carpeta</span>
              </button>
          </div>

          <div class="relative group mb-4">
            <IconSearch class="w-4 h-4 text-slate-500 absolute left-3 top-2.5 transition-colors group-focus-within:text-indigo-400" aria-hidden="true" />
            <input v-model="searchQuery" type="text" placeholder="Buscar..." class="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all text-sm" aria-label="Buscar notas">
          </div>

          <button
            @click="currentView = 'calendar'; selectedItem = null; showSidebar = false"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border"
            :class="currentView === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 border-transparent' : 'bg-slate-800/30 text-slate-400 border-transparent hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20'"
            aria-label="Ver calendario"
          >
            <IconCalendar class="w-5 h-5" aria-hidden="true" />
            <span class="font-bold text-sm uppercase tracking-wider">Calendario</span>
          </button>
        </div>

        <!-- ÁRBOL DE CARPETAS + NOTAS -->
        <div
          class="flex-1 overflow-y-auto px-3 custom-scrollbar pb-6"
          @dragenter.prevent
          @dragover.prevent
          @drop="onDropToRoot"
        >
          <!-- Resultados de búsqueda (lista plana) -->
          <template v-if="searchQuery.trim()">
            <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-3 px-2">Resultados</h2>
            <div v-if="!filteredNotes.length" class="px-2 text-xs text-slate-600">Sin coincidencias.</div>
            <div class="space-y-1">
              <div
                v-for="note in filteredNotes"
                :key="note.id"
                @click="selectNote(note)"
                class="group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all border"
                :class="selectedItem?.id === note.id ? 'bg-indigo-500/10 border-indigo-500/40' : 'border-transparent hover:bg-white/5'"
              >
                <component :is="note.type === 'Documento' ? IconFile : IconSticky" class="w-3.5 h-3.5 shrink-0" :class="note.type === 'Documento' ? 'text-indigo-400' : 'text-amber-400'" aria-hidden="true" />
                <span class="flex-1 min-w-0 text-sm truncate" :class="selectedItem?.id === note.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'">{{ note.title || 'Sin título' }}</span>
              </div>
            </div>
          </template>

          <!-- Árbol normal -->
          <template v-else>
            <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-2 px-2">Mis carpetas</h2>

            <!-- Input inline para crear carpeta raíz -->
            <div v-if="creatingIn === 'root'" class="flex items-center gap-1.5 px-2 py-1 mb-1">
              <IconFolderPlus class="w-4 h-4 shrink-0 text-indigo-400/60" aria-hidden="true" />
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

            <FolderTree :nodes="folderTree" />

            <div v-if="!folderTree.length && creatingIn !== 'root'" class="px-2 mb-3 text-xs text-slate-600">Crea carpetas para organizarte.</div>

            <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-4 mb-2 px-2">Sin carpeta</h2>
            <div class="space-y-0.5">
              <div
                v-for="note in rootNotes"
                :key="note.id"
                draggable="true"
                @dragstart="onDragStartNote($event, note)"
                @click="selectNote(note)"
                class="group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all border"
                :class="selectedItem?.id === note.id ? 'bg-indigo-500/10 border-indigo-500/40' : 'border-transparent hover:bg-white/5'"
              >
                <component :is="note.type === 'Documento' ? IconFile : IconSticky" class="w-3.5 h-3.5 shrink-0" :class="note.type === 'Documento' ? 'text-indigo-400' : 'text-amber-400'" aria-hidden="true" />
                <span class="flex-1 min-w-0 text-sm truncate" :class="selectedItem?.id === note.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'">{{ note.title || 'Sin título' }}</span>
                <button @click.stop="handleRemoveNote(note)" class="hidden group-hover:block p-1 text-slate-600 hover:text-red-400 transition-colors shrink-0" aria-label="Eliminar nota">
                  <IconTrash class="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div v-if="!rootNotes.length" class="px-2 text-xs text-slate-600">Arrastra notas aquí para sacarlas de una carpeta.</div>

            <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mt-4 mb-2 px-2">⭐ Exámenes favoritos</h2>
            <div class="space-y-0.5">
              <RouterLink
                v-for="exam in favoriteExams"
                :key="exam._id"
                :to="`/examen/${exam._id}`"
                draggable="true"
                @dragstart="onDragStartExam($event, exam)"
                class="group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5"
              >
                <span class="text-yellow-400 text-xs shrink-0" aria-hidden="true">★</span>
                <span class="flex-1 min-w-0 text-sm truncate text-slate-400 group-hover:text-slate-300">{{ exam.title || 'Sin título' }}</span>
              </RouterLink>
            </div>
            <div v-if="!favoriteExams.length" class="px-2 py-3 text-xs text-slate-600 leading-relaxed">
              No tienes exámenes favoritos. Marca un examen con ★ en la Biblioteca para verlo aquí.
            </div>
          </template>
        </div>
      </aside>

      <!-- ÁREA PRINCIPAL -->
      <main class="flex-1 flex flex-col relative bg-slate-900/50 backdrop-blur-sm overflow-hidden w-full">

        <div class="md:hidden flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur border-b border-white/10 shrink-0 shadow-sm z-20">
          <button @click="showSidebar = true" class="text-slate-400 hover:text-indigo-400" aria-label="Abrir menú de notas">
            <IconMenu class="w-6 h-6" aria-hidden="true" />
          </button>
          <span class="text-sm font-bold tracking-widest uppercase text-slate-500">
            {{ currentView === 'calendar' ? 'Calendario' : (selectedItem?.type || 'Zona de Estudio') }}
          </span>
          <div class="w-6"></div>
        </div>

        <!-- CALENDARIO -->
        <StudyCalendar v-if="currentView === 'calendar'" />

        <!-- EDITOR -->
        <div v-else-if="selectedItem" class="flex-1 flex flex-col h-full min-h-0 animate-fade-in">
            <header class="h-12 md:h-14 flex items-center justify-between px-4 md:px-6 shrink-0 bg-slate-900/60 backdrop-blur border-b border-white/5">
                <div class="flex items-center gap-4">
                      <span class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] md:text-xs font-bold text-indigo-300 uppercase tracking-widest">{{ selectedItem.type }}</span>
                      <div v-if="isSaving" class="text-[10px] md:text-xs text-indigo-400 flex items-center gap-2"><IconLoader class="w-3 h-3 animate-spin" aria-hidden="true" /> <span class="hidden sm:inline">Guardando...</span></div>
                      <div v-else class="text-[10px] md:text-xs text-emerald-400 flex items-center gap-2"><IconCheck class="w-3 h-3" aria-hidden="true" /> <span class="hidden sm:inline">Guardado</span></div>
                </div>

                <div v-if="selectedItem.type === 'Post-it'" class="flex gap-2">
                  <button v-for="color in postItColors" :key="color.bg" @click="selectedItem.color = color.bg; scheduleNoteSave(selectedItem)" class="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-slate-900 hover:scale-110 transition-transform" :class="[color.bg, selectedItem.color === color.bg ? 'ring-slate-400' : 'ring-transparent']" :aria-label="'Cambiar color a ' + color.bg"></button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto custom-scrollbar flex justify-center p-2 md:p-10 relative">

                <!-- DOCUMENTO (editor rico) -->
                <div v-if="selectedItem.type === 'Documento'" class="w-full max-w-[850px] bg-[#1e293b] text-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 min-h-[60vh] md:min-h-[1000px] animate-slide-up-fade relative mx-auto flex flex-col rounded-sm">
                    <div class="px-4 py-4 md:px-12 md:pt-8 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-700 gap-4">
                          <div class="md:pb-4 flex-1">
                            <h3 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Título</h3>
                             <input v-model="selectedItem.title" @input="scheduleNoteSave(selectedItem)" placeholder="Título del documento..." class="w-full bg-transparent text-xl md:text-3xl font-serif font-bold text-slate-100 placeholder:text-slate-600 border-none p-0 focus:ring-0 focus:outline-none" aria-label="Título del documento" />
                          </div>
                          <div class="md:pb-4 text-left md:text-right">
                             <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Última ed.</div>
                             <div class="text-xs md:text-sm font-serif text-slate-500">{{ formatDate(selectedItem.updatedAt) }}</div>
                          </div>
                    </div>
                    <div class="px-4 md:px-12 pb-12 flex-1 flex flex-col min-h-0">
                        <RichTextEditor
                          :key="selectedItem.id"
                          :model-value="selectedItem.content"
                          @update:model-value="onContentUpdate"
                        />
                    </div>
                </div>

                <!-- POST-IT -->
                <div v-else class="flex flex-col items-center justify-center w-full h-full py-10 px-4">
                      <div class="relative w-full max-w-[350px] aspect-square p-6 md:p-8 shadow-2xl transition-colors duration-300 rotate-1 animate-pop-in flex flex-col" :class="selectedItem.color">
                        <div class="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-24 md:w-32 h-8 md:h-10 bg-slate-900/30 backdrop-blur-sm transform -rotate-1 shadow-sm border border-white/10"></div>

                        <input v-model="selectedItem.title" @input="scheduleNoteSave(selectedItem)" placeholder="Asunto..." class="w-full bg-transparent text-2xl md:text-3xl font-bold mb-4 text-slate-900/80 placeholder-slate-900/20 border-b border-slate-900/5 focus:border-slate-900/20 focus:outline-none text-center font-handwriting" aria-label="Asunto de la nota" />
                        <textarea v-model="selectedItem.content" @input="scheduleNoteSave(selectedItem)" placeholder="Escribe tu nota..." class="flex-1 w-full bg-transparent resize-none border-none focus:outline-none text-xl md:text-2xl font-bold text-slate-900/80 font-handwriting text-center leading-normal placeholder-slate-900/20" aria-label="Contenido de la nota"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <!-- VACÍO -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center animate-float opacity-60">
            <div class="w-24 h-24 bg-slate-800/50 backdrop-blur rounded-full flex items-center justify-center mb-6 shadow-lg border border-white/5">
                <IconNotebook class="w-10 h-10 text-indigo-400" aria-hidden="true" />
            </div>
            <h1 class="font-serif text-xl md:text-3xl text-slate-300 mb-2">Selecciona un elemento</h1>
            <p class="text-slate-500 text-sm">O crea uno nuevo desde el menú</p>
            <button @click="showSidebar = true" class="mt-8 md:hidden px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg border border-indigo-500/50">Abrir Menú</button>
        </div>
      </main>
    </div>

    <!-- EXPLORADOR DE ARCHIVOS (estilo Windows) -->
    <button
      type="button"
      class="fixed bottom-4 left-4 z-30 flex flex-col items-center gap-1 group"
      aria-label="Abrir explorador de archivos"
      title="Explorador de archivos"
      @click="showExplorer = true"
    >
      <span class="w-14 h-14 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center group-hover:bg-indigo-600/80 group-hover:scale-105 transition-all">
        <IconFolderOpen class="w-7 h-7 text-amber-400 group-hover:text-white" aria-hidden="true" />
      </span>
      <span class="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">Explorador</span>
    </button>

    <FileExplorerWindow v-if="showExplorer" @close="showExplorer = false" />

    <!-- PAPELERA (justo a la derecha del explorador) -->
    <button
      type="button"
      class="fixed bottom-4 left-24 z-30 flex flex-col items-center gap-1 group"
      aria-label="Abrir papelera"
      title="Papelera"
      @click="showBin = true"
    >
      <span class="relative w-14 h-14 rounded-2xl bg-slate-800/80 backdrop-blur-xl border border-white/10 shadow-lg flex items-center justify-center group-hover:bg-slate-700 group-hover:scale-105 transition-all">
        <IconTrashBin class="w-7 h-7 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
        <span v-if="trash.length" class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-slate-900">{{ trash.length }}</span>
      </span>
      <span class="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">Papelera</span>
    </button>

    <RecycleBinWindow v-if="showBin" @close="showBin = false" />

    <!-- MODAL DE DÍA: detalle (día con elementos) y menú de añadir/editar -->
    <CalendarDayDetailModal v-if="dayDetailDate" :date="dayDetailDate" @close="dayDetailDate = null" />
    <CalendarDayModal v-if="dayModalDate" :date="dayModalDate" @close="dayModalDate = null" />

    <!-- TOAST DE ERRORES -->
    <Transition name="toast">
      <div v-if="toast" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 bg-red-900/90 backdrop-blur border border-red-500/40 text-red-200 text-sm font-medium rounded-2xl shadow-2xl flex items-center gap-3 max-w-[90vw]" role="alert">
        <i class="fa-solid fa-circle-exclamation shrink-0" aria-hidden="true"></i>
        <span class="truncate">{{ toast }}</span>
        <button type="button" class="p-1 text-red-300/60 hover:text-red-100 shrink-0" aria-label="Cerrar aviso" @click="toast = null">✕</button>
      </div>
    </Transition>

    <!-- AVISO DE CONEXIÓN -->
    <div v-if="loadFailed" class="fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 bg-amber-900/90 backdrop-blur border border-amber-500/40 text-amber-200 text-sm font-medium rounded-2xl shadow-2xl flex items-center gap-3 max-w-[90vw]" role="alert">
      <i class="fa-solid fa-plug-circle-xmark shrink-0" aria-hidden="true"></i>
      <span>No se pudo conectar con el servidor. Comprueba que el backend esté en marcha.</span>
      <button type="button" class="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shrink-0" @click="retryLoad">Reintentar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, provide, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userStore } from '@/stores/userStores'
import { useStudyData } from '@/composables/useStudyData'
import Header from '@/components/HeaderCompleto.vue'
import FolderTree from '@/components/estudio/FolderTree.vue'
import StudyCalendar from '@/components/estudio/StudyCalendar.vue'
import CalendarDayModal from '@/components/estudio/CalendarDayModal.vue'
import CalendarDayDetailModal from '@/components/estudio/CalendarDayDetailModal.vue'
import FileExplorerWindow from '@/components/estudio/FileExplorerWindow.vue'
import RecycleBinWindow from '@/components/estudio/RecycleBinWindow.vue'
import RichTextEditor from '@/components/estudio/RichTextEditor.vue'
import {
  FileText as IconFile, StickyNote as IconSticky, Search as IconSearch,
  Trash2 as IconTrash, Check as IconCheck, Loader2 as IconLoader,
  BookOpen as IconNotebook, Calendar as IconCalendar,
  Menu as IconMenu, X as IconX, FolderPlus as IconFolderPlus,
  FolderOpen as IconFolderOpen, Trash2 as IconTrashBin,
} from 'lucide-vue-next'

const study = useStudyData()
const { folders, notes, exams, trash, folderTree, rootNotes, isSaving, scheduleNoteSave } = study
const route = useRoute()

// Sección "Exámenes favoritos": solo los marcados con ★ en la Biblioteca
const favoriteExams = computed(() => exams.value.filter(e => e.favorito))

const showSidebar = ref(false)
const currentView = ref('calendar')
const selectedItem = ref(null)
const searchQuery = ref('')
const dayModalDate = ref(null)
const dayDetailDate = ref(null)
const showExplorer = ref(false)
const showBin = ref(false)
const expandedMap = reactive({})
const creatingIn = ref(null) // 'root' | folderId | null
const rootFolderName = ref('')
const loadFailed = ref(false)

// Toast de errores: muestra los fallos de las operaciones (antes eran silenciosos)
const toast = ref(null)
let toastTimer = null
function showToast(msg) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = null }, 5000)
}
watch(study.opError, (msg) => {
  if (msg) {
    showToast(msg)
    study.opError.value = null
  }
})

const postItColors = [
  { bg: 'bg-[#fef08a]' }, { bg: 'bg-[#bbf7d0]' }, { bg: 'bg-[#bfdbfe]' }, { bg: 'bg-[#fbcfe8]' }, { bg: 'bg-[#ddd6fe]' }
]

onMounted(async () => {
  // ✅ SEO Local
  document.title = "Zona de Estudio - Carpetas, Notas y Calendario";

  if (!userStore.token) return
  await retryLoad()

  // Abrir una nota concreta si venimos desde la Biblioteca (/estudio?note=<id>)
  const noteId = route.query.note
  if (noteId) {
    const note = notes.value.find(n => n.id === noteId || n.idBackend === noteId)
    if (note) {
      if (note.folderId) expandFolderChain(note.folderId)
      selectNote(note)
    }
  }
})

// Expande la carpeta y todas sus ancestras para que la nota sea visible en el árbol
function expandFolderChain(folderId) {
  let cur = folderId
  while (cur) {
    expandedMap[cur] = true
    const f = folders.value.find(x => x.id === cur)
    cur = f ? f.parentId : null
  }
}

async function retryLoad() {
  loadFailed.value = false
  try {
    await study.loadAll()
  } catch (e) {
    console.error("Error cargando la zona de estudio:", e)
    loadFailed.value = true
  }
}

// ----- Selección y creación -----
function selectNote(note) {
  selectedItem.value = note
  currentView.value = 'editor'
  if (window.innerWidth < 768) showSidebar.value = false
}

function newNote(type, folderId = null) {
  const note = study.createNote(type, folderId)
  if (folderId) expandedMap[folderId] = true
  selectNote(note)
}

// Abre el input inline de creación de carpeta (en raíz o dentro de una carpeta)
function newFolder(parentId = null) {
  creatingIn.value = parentId ?? 'root'
  if (parentId) expandedMap[parentId] = true
}

// Confirma la creación (llamado desde el input inline propio o el de FolderTree)
async function confirmCreateFolder(name) {
  const target = creatingIn.value
  creatingIn.value = null
  if (!target || !name || !name.trim()) return
  await study.addFolder(name.trim(), target === 'root' ? null : target)
  if (target !== 'root') expandedMap[target] = true
}

function submitRootFolder() {
  const name = rootFolderName.value
  rootFolderName.value = ''
  if (creatingIn.value === 'root') confirmCreateFolder(name)
}

async function handleRemoveNote(note) {
  if (!confirm('¿Eliminar definitivamente?')) return
  await study.removeNote(note)
  if (selectedItem.value?.id === note.id) selectedItem.value = null
}

function onContentUpdate(html) {
  if (!selectedItem.value) return
  selectedItem.value.content = html
  scheduleNoteSave(selectedItem.value)
}

function openDay(dateStr) {
  dayDetailDate.value = null
  dayModalDate.value = dateStr
}

function openDayDetail(dateStr) {
  dayModalDate.value = null
  dayDetailDate.value = dateStr
}

// ----- Drag & drop a la raíz (sacar de carpetas) -----
function onDragStartNote(e, note) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'note', id: note.id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDragStartExam(e, exam) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'exam', id: exam._id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDropToRoot(e) {
  let payload
  try {
    payload = JSON.parse(e.dataTransfer.getData('text/plain'))
  } catch {
    return
  }
  if (!payload) return
  if (payload.kind === 'note') {
    const note = notes.value.find(n => n.id === payload.id)
    if (note && note.folderId) study.moveNoteToFolder(note, null)
  } else if (payload.kind === 'exam') {
    const exam = exams.value.find(e => e._id === payload.id)
    if (exam && exam.folderId) study.moveExamToFolder(exam, null)
  } else if (payload.kind === 'folder') {
    const folder = folders.value.find(f => f.id === payload.id)
    if (folder && folder.parentId) study.moveFolder(folder, null)
  }
}

// ----- Búsqueda -----
const filteredNotes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return []
  return notes.value.filter(n =>
    n.title?.toLowerCase().includes(q) || n.content?.toLowerCase().includes(q)
  )
})

const formatDate = (iso) => iso ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(iso)) : ''

// Contexto compartido con FolderTree, StudyCalendar y CalendarDayModal
provide('studyCtx', {
  ...study,
  expandedMap,
  selectedItem,
  selectNote,
  newNote,
  newFolder,
  creatingIn,
  confirmCreateFolder,
  handleRemoveNote,
  openDay,
  openDayDetail,
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@300;400;500;600&family=Caveat:wght@600;700&display=swap');

/* Fuentes Base */
.font-sans { font-family: 'Inter', sans-serif; }
.font-serif { font-family: 'Merriweather', serif; }
.font-handwriting { font-family: 'Caveat', cursive; }

/* Scrollbar Personalizado (Versión Dark) */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #64748b; }

/* Patrón de fondo (Grid Blanco SVG) */
.bg-grid-white {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23ffffff'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}

/* Animaciones */
.will-change-transform { will-change: transform; }

.animate-blob {
  animation: blob 10s infinite alternate;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
.animate-slide-up-fade {
    animation: slideUpFade 0.6s ease-out;
}
.animate-pop-in {
    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  50% { transform: translate(30px, -50px) scale(1.1); }
  100% { transform: translate(-20px, 20px) scale(0.9); }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpFade {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes popIn {
    from { opacity: 0; transform: scale(0.9) rotate(0deg); }
    to { opacity: 1; transform: scale(1) rotate(1deg); }
}

/* Transición del toast de errores */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 10px); }
</style>
