<template>
  <div>
    <Header />

  <div class="min-h-screen flex bg-[#E8F1FD] font-sans overflow-hidden">

    <!-- Sidebar -->
    <aside class="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
      <div class="p-4 border-b border-slate-100">
        <h1 class="text-xl font-bold flex items-center gap-2 text-[#3978D7] mb-4">
          <IconNotebook class="w-6 h-6" />
          <span>Tus Notas</span>
        </h1>

        <!-- Botones de creación por sección -->
        <div class="grid grid-cols-3 gap-2 mb-4">
          <button @click="addItemToSection('Documento')" class="sidebar-btn bg-blue-50 text-blue-600 hover:bg-blue-100" title="Nuevo Documento">
            <IconFile class="w-5 h-5" />
          </button>
          <button @click="addItemToSection('Nota')" class="sidebar-btn bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="Nueva Nota Rápida">
            <IconList class="w-5 h-5" />
          </button>
          <button @click="addItemToSection('Post-it')" class="sidebar-btn bg-amber-50 text-amber-600 hover:bg-amber-100" title="Nuevo Post-it">
            <IconSticky class="w-5 h-5" />
          </button>
        </div>

        <!-- Buscador -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar..."
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3978D7] transition-all"
          >
          <IconSearch class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <!-- Secciones y notas -->
      <div class="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
        <div v-for="section in filteredSections" :key="section.type">
          <h2 class="text-sm font-semibold text-slate-400 px-2 mb-1">{{ section.title }}</h2>

          <div v-for="item in section.items" :key="item.id"
               @click="selectItem(item)"
               class="group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all border border-transparent"
               :class="selectedItem?.id === item.id ? 'bg-[#D0E2FF] border-[#3978D7] shadow-sm' : 'hover:bg-slate-50 hover:border-slate-200'">

            <div class="flex items-center gap-3 overflow-hidden">
              <component :is="getIconByType(item.type)" class="w-4 h-4 flex-shrink-0" :class="getColorByType(item.type)" />
              <div class="flex flex-col min-w-0">
                <span class="font-medium truncate text-sm" :class="!item.title ? 'text-slate-400 italic' : ''">
                  {{ item.title || 'Sin título' }}
                </span>
                <span class="text-xs text-slate-400 truncate">
                  {{ formatDate(item.updatedAt) }}
                </span>
              </div>
            </div>

            <button @click.stop="deleteItemFromSection(item.id, section.type)" class="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all">
              <IconTrash class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="sections.length === 0" class="text-center p-8 text-slate-400 text-sm">
          <p>No tienes notas aún.</p>
          <p>¡Crea una arriba!</p>
        </div>
      </div>
    </aside>

    <!-- Editor -->
    <main class="flex-1 flex flex-col relative bg-[#E8F1FD]/50">
      <div v-if="selectedItem" class="h-full flex flex-col animate-fadeIn">

        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <span class="bg-slate-100 px-2 py-1 rounded text-xs uppercase tracking-wide font-semibold">{{ selectedItem.type }}</span>
            <span v-if="isSaving" class="text-[#3978D7] flex items-center gap-1">
              <IconLoader class="w-3 h-3 animate-spin" /> Guardando...
            </span>
            <span v-else class="text-green-600 flex items-center gap-1">
              <IconCheck class="w-3 h-3" /> Guardado
            </span>
          </div>

          <div v-if="selectedItem.type === 'Post-it'" class="flex gap-2">
            <button
              v-for="color in postItColors"
              :key="color.bg"
              @click="selectedItem.color = color.bg; triggerAutoSave()"
              class="w-6 h-6 rounded-full border border-slate-200 shadow-sm hover:scale-110 transition"
              :class="color.bg"
            ></button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div class="max-w-4xl mx-auto transition-all duration-300">

            <div v-if="selectedItem.type !== 'Post-it'" class="bg-white min-h-[80vh] shadow-sm border border-slate-200 rounded-2xl p-10">
              <input
                v-model="selectedItem.title"
                @input="triggerAutoSave"
                placeholder="Título del documento..."
                class="w-full text-4xl font-bold text-slate-800 placeholder-slate-300 border-none focus:outline-none focus:ring-0 bg-transparent mb-6"
              >
              <textarea
                v-model="selectedItem.content"
                @input="triggerAutoSave"
                placeholder="Escribe aquí tu contenido..."
                class="w-full h-[60vh] resize-none border-none focus:outline-none focus:ring-0 text-lg text-slate-600 leading-relaxed custom-textarea"
              ></textarea>
            </div>

            <div v-else class="flex justify-center items-center h-full pt-10">
              <div
                class="w-96 aspect-square shadow-xl rotate-1 transition-colors duration-300 p-6 flex flex-col relative"
                :class="selectedItem.color || 'bg-yellow-200'"
              >
                <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 shadow-md border-2 border-white z-10"></div>

                <input
                  v-model="selectedItem.title"
                  @input="triggerAutoSave"
                  placeholder="Asunto..."
                  class="bg-transparent border-b border-black/10 w-full mb-4 px-2 py-1 font-bold text-slate-800 placeholder-slate-500/50 focus:outline-none"
                >
                <textarea
                  v-model="selectedItem.content"
                  @input="triggerAutoSave"
                  placeholder="No olvidar..."
                  class="flex-1 bg-transparent border-none focus:outline-none resize-none text-slate-800 placeholder-slate-600/50 text-xl font-handwriting leading-loose"
                ></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-slate-300">
        <IconNotebook class="w-24 h-24 mb-4 text-slate-200" />
        <p class="text-lg font-medium text-slate-400">Selecciona o crea un elemento para empezar</p>
      </div>

    </main>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { userStore } from '@/stores/userStores'
import { loadNotes, saveNote, deleteNote } from '@/services/notesService'
import Header from '@/components/HeaderCompleto.vue'

// ICONOS
import {
  FileText as IconFile,
  StickyNote as IconSticky,
  List as IconList,
  Search as IconSearch,
  Trash2 as IconTrash,
  Check as IconCheck,
  Loader2 as IconLoader,
  BookOpen as IconNotebook
} from 'lucide-vue-next'

// ===============================
// ESTADO
// ===============================
const sections = ref([
  { type: 'Documento', title: 'Documentos', items: [] },
  { type: 'Nota', title: 'Notas rápidas', items: [] },
  { type: 'Post-it', title: 'Post-its', items: [] }
])

const selectedItem = ref(null)
const searchQuery = ref('')
const isSaving = ref(false)

let saveTimeout = null

const postItColors = [
  { bg: 'bg-yellow-200' },
  { bg: 'bg-green-200' },
  { bg: 'bg-blue-200' },
  { bg: 'bg-pink-200' },
  { bg: 'bg-purple-200' }
]

// ===============================
// CARGA INICIAL
// ===============================
onMounted(async () => {
  if (!userStore.token) return

  const notes = await loadNotes()
  notes.forEach(note => {
    const section = sections.value.find(s => s.type === note.type)
    if (section) section.items.push(note)
  })
})

// ===============================
// AUTOSAVE (UNA NOTA)
// ===============================
const triggerAutoSave = () => {
  if (!selectedItem.value) return

  isSaving.value = true
  selectedItem.value.updatedAt = new Date().toISOString()

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      await saveNote(selectedItem.value)
    } catch (e) {
      console.error('Error guardando nota:', e)
    } finally {
      isSaving.value = false
    }
  }, 700)
}

// ===============================
// CRUD
// ===============================
const addItemToSection = (type) => {
  const section = sections.value.find(s => s.type === type)
  if (!section) return

  const newItem = {
    id: uuidv4(),
    type,
    title: '',
    content: '',
    updatedAt: new Date().toISOString(),
    color: type === 'Post-it' ? 'bg-yellow-200' : null,
    idBackend: null,
  }

  section.items.unshift(newItem)
  selectedItem.value = newItem
  triggerAutoSave()
}

const selectItem = (item) => {
  selectedItem.value = item
}

const deleteItemFromSection = async (id, sectionType) => {
  const section = sections.value.find(s => s.type === sectionType)
  if (!section) return

  const item = section.items.find(i => i.id === id)
  if (!item) return

  if (!confirm('¿Eliminar esta nota?')) return

  try {
    await deleteNote(item.idBackend)
  } catch (e) {
    console.error('Error eliminando nota:', e)
  }

  section.items = section.items.filter(i => i.id !== id)
  if (selectedItem.value?.id === id) {
    selectedItem.value = null
  }
}

// ===============================
// FILTRADO
// ===============================
const filteredSections = computed(() => {
  if (!searchQuery.value) return sections.value
  const q = searchQuery.value.toLowerCase()

  return sections.value.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title?.toLowerCase().includes(q) ||
      item.content?.toLowerCase().includes(q)
    )
  }))
})

// ===============================
// HELPERS
// ===============================
const getIconByType = (type) => {
  if (type === 'Documento') return IconFile
  if (type === 'Post-it') return IconSticky
  return IconList
}

const getColorByType = (type) => {
  if (type === 'Documento') return 'text-blue-500'
  if (type === 'Post-it') return 'text-amber-500'
  return 'text-emerald-500'
}

const formatDate = (iso) => {
  if (!iso) return ''
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(iso))
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400&display=swap');

.font-sans { font-family: 'Inter', sans-serif; }
.font-handwriting { font-family: 'Kalam', cursive; }

.sidebar-btn {
  @apply flex items-center justify-center py-2 rounded-lg transition-colors border border-transparent;
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
