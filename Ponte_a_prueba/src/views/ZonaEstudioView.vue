<template>
  <div class="flex flex-col h-screen overflow-hidden font-sans text-slate-300 bg-slate-950 selection:bg-indigo-500 selection:text-white relative">

    <div class="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div class="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>

      <div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] animate-blob"></div>
      <div class="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
    </div>

    <Header class="flex-shrink-0 relative z-20" />

    <div class="flex-1 flex overflow-hidden relative z-10">

      <transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showSidebar" @click="showSidebar = false" class="fixed inset-0 bg-black/80 z-30 md:hidden backdrop-blur-sm"></div>
      </transition>

      <aside
        class="fixed md:static inset-y-0 left-0 w-[85vw] md:w-80 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 text-slate-400 flex flex-col z-40
               transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none"
        :class="showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        <div class="p-6 pb-4 shrink-0">
          <div class="flex items-center justify-between mb-8">
            <h1 class="font-serif text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <IconNotebook class="w-8 h-8 text-indigo-500" />
              <span>Notas<span class="text-indigo-500">.</span></span>
            </h1>
            <button @click="showSidebar = false" class="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
              <IconX class="w-6 h-6" />
            </button>
          </div>

          <div class="flex gap-2 mb-8">
              <button @click="addItemToSection('Documento')" class="flex-1 py-3 bg-slate-800/50 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-xl shadow-lg border border-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group hover:border-indigo-500">
                  <IconFile class="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" /> <span class="hidden sm:inline">Doc</span>
              </button>
               <button @click="addItemToSection('Post-it')" class="flex-1 py-3 bg-slate-800/50 hover:bg-amber-500 hover:text-white text-slate-300 rounded-xl shadow-lg border border-white/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group hover:border-amber-500">
                  <IconSticky class="w-4 h-4 text-amber-400 group-hover:text-white transition-colors" /> <span class="hidden sm:inline">Post</span>
              </button>
          </div>

          <div class="relative group mb-4">
            <IconSearch class="w-4 h-4 text-slate-500 absolute left-3 top-2.5 transition-colors group-focus-within:text-indigo-400" />
            <input v-model="searchQuery" type="text" placeholder="Buscar..." class="w-full pl-9 pr-4 py-2 bg-slate-950/50 border border-white/5 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all text-sm">
          </div>

          <button
            @click="currentView = 'calendar'; selectedItem = null; showSidebar = false"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition-all duration-200 border"
            :class="currentView === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 border-transparent' : 'bg-slate-800/30 text-slate-400 border-transparent hover:bg-indigo-500/10 hover:text-indigo-400 hover:border-indigo-500/20'"
          >
            <IconCalendar class="w-5 h-5" />
            <span class="font-bold text-sm uppercase tracking-wider">Calendario</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6">
          <div v-for="section in filteredSections" :key="section.type" class="mb-6">
            <h2 class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-3 px-2">{{ section.title }}</h2>

            <div class="space-y-2">
              <div
                v-for="item in section.items"
                :key="item.id"
                draggable="true"
                @dragstart="onDragStart($event, item)"
                @click="selectItem(item); currentView = 'editor'; showSidebar = false"
                class="group relative px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 border"
                :class="selectedItem?.id === item.id ? 'bg-indigo-500/10 shadow-md border-indigo-500/50 ring-1 ring-indigo-500/20' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5 text-slate-400'"
              >
                  <div class="flex justify-between items-start">
                      <span class="font-medium text-sm truncate pr-4" :class="selectedItem?.id === item.id ? 'text-indigo-300' : 'text-slate-300 group-hover:text-slate-200'">{{ item.title || 'Sin Título' }}</span>
                      <component :is="getIconByType(item.type)" class="w-3.5 h-3.5 mt-0.5 shrink-0" :class="getColorByType(item.type)"/>
                  </div>
                  <span class="text-[10px] opacity-40 mt-1 block font-mono">{{ formatDate(item.updatedAt) }}</span>
                  <button @click.stop="deleteItemFromSection(item.id, section.type)" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity md:group-hover:opacity-100 opacity-100 md:opacity-0">
                    <IconTrash class="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 flex flex-col relative bg-slate-900/50 backdrop-blur-sm overflow-hidden w-full">

        <div class="md:hidden flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur border-b border-white/10 shrink-0 shadow-sm z-20">
          <button @click="showSidebar = true" class="text-slate-400 hover:text-indigo-400">
            <IconMenu class="w-6 h-6" />
          </button>
          <span class="text-sm font-bold tracking-widest uppercase text-slate-500">
            {{ currentView === 'calendar' ? 'Calendario' : (selectedItem?.type || 'App Notas') }}
          </span>
          <div class="w-6"></div>
        </div>

        <div v-if="currentView === 'calendar'" class="flex-1 flex flex-col p-2 md:p-6 overflow-hidden animate-fade-in-up">

          <div class="flex items-center justify-between mb-4 md:mb-6 bg-slate-800/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/10 shadow-lg shrink-0">
            <h2 class="text-lg md:text-2xl font-serif font-bold text-slate-200 capitalize">{{ currentMonthName }} <span class="hidden sm:inline text-indigo-400 font-sans">{{ currentYear }}</span></h2>
            <div class="flex gap-2">
              <button @click="changeMonth(-1)" class="p-1.5 md:p-2 hover:bg-white/5 text-slate-400 hover:text-indigo-400 rounded-xl transition-colors"><IconLeft /></button>
              <button @click="changeMonth(1)" class="p-1.5 md:p-2 hover:bg-white/5 text-slate-400 hover:text-indigo-400 rounded-xl transition-colors"><IconRight /></button>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-7 grid-rows-[auto_1fr_1fr_1fr_1fr_1fr_1fr] md:grid-rows-6 gap-px bg-slate-700/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-0 ring-1 ring-white/5">
            <div v-for="dayName in weekDays" :key="dayName" class="bg-slate-900/90 p-1 md:p-2 text-center text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center">{{ dayName }}</div>

            <div
              v-for="(day, index) in calendarDays" :key="index"
              @dragover.prevent @drop="onDrop($event, day.dateStr)"
              class="min-h-[60px] md:min-h-[100px] p-1 md:p-2 transition-colors relative group flex flex-col overflow-hidden hover:bg-white/5"
              :class="[day.isCurrentMonth ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-900/80 text-slate-600', isToday(day.dateStr) ? 'bg-indigo-900/20 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]' : '']"
            >
              <span class="text-[10px] md:text-xs font-mono font-bold z-10 pointer-events-none" :class="isToday(day.dateStr) ? 'text-indigo-400' : 'opacity-30'">{{ day.dayNumber }}</span>

              <div class="absolute inset-0 p-1 flex flex-col justify-end">
                  <div class="flex flex-col gap-1 z-20 w-full max-w-[70%]">
                    <div
                        v-for="item in getDocsForDate(day.dateStr)"
                        :key="item.id"
                        draggable="true"
                        @dragstart="onDragStart($event, item)"
                        @click="selectItem(item); currentView = 'editor'"
                        class="cursor-grab active:cursor-grabbing text-[8px] md:text-[10px] bg-slate-700 border border-white/10 text-indigo-300 px-1.5 py-0.5 rounded-md truncate shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                    >
                        📄 {{ item.title || 'Doc' }}
                    </div>
                  </div>

                  <div
                    v-if="getPostItForDate(day.dateStr)"
                    draggable="true"
                    @dragstart="onDragStart($event, getPostItForDate(day.dateStr))"
                    @click="selectItem(getPostItForDate(day.dateStr)); currentView = 'editor'"
                    class="absolute top-1 right-1 w-[65%] aspect-square max-w-[120px] p-2 rounded shadow-md transform rotate-2 cursor-grab active:cursor-grabbing transition-transform hover:scale-110 hover:rotate-0 hover:z-30 border border-black/20 flex items-center justify-center text-center overflow-hidden"
                    :class="getPostItForDate(day.dateStr).color"
                  >
                      <p class="text-[10px] md:text-sm leading-tight font-handwriting font-bold text-slate-900/90 break-words line-clamp-4 pointer-events-none">
                        {{ getPostItForDate(day.dateStr).content || getPostItForDate(day.dateStr).title || 'Nota' }}
                      </p>
                  </div>
              </div>

            </div>
          </div>
        </div>

        <div v-else-if="selectedItem" class="flex-1 flex flex-col h-full min-h-0 animate-fade-in">
            <header class="h-12 md:h-14 flex items-center justify-between px-4 md:px-6 shrink-0 bg-slate-900/60 backdrop-blur border-b border-white/5">
                <div class="flex items-center gap-4">
                      <span class="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] md:text-xs font-bold text-indigo-300 uppercase tracking-widest">{{ selectedItem.type }}</span>
                      <div v-if="isSaving" class="text-[10px] md:text-xs text-indigo-400 flex items-center gap-2"><IconLoader class="w-3 h-3 animate-spin" /> <span class="hidden sm:inline">Guardando...</span></div>
                      <div v-else class="text-[10px] md:text-xs text-emerald-400 flex items-center gap-2"><IconCheck class="w-3 h-3" /> <span class="hidden sm:inline">Guardado</span></div>
                </div>

                <div v-if="selectedItem.type === 'Post-it'" class="flex gap-2">
                  <button v-for="color in postItColors" :key="color.bg" @click="selectedItem.color = color.bg; triggerAutoSave()" class="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm ring-2 ring-offset-2 ring-offset-slate-900 hover:scale-110 transition-transform" :class="[color.bg, selectedItem.color === color.bg ? 'ring-slate-400' : 'ring-transparent']"></button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto custom-scrollbar flex justify-center p-2 md:p-10 relative">

                <div v-if="selectedItem.type === 'Documento'" class="w-full max-w-[850px] bg-[#1e293b] text-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 min-h-[60vh] md:min-h-[1000px] animate-slide-up-fade relative mx-auto flex flex-col rounded-sm">
                    <div class="md:h-24 px-4 py-4 md:px-12 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-slate-700 mb-6 md:mb-10 gap-4">
                          <div class="md:pb-4 flex-1">
                            <h3 class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Título</h3>
                             <input v-model="selectedItem.title" @input="triggerAutoSave" placeholder="Título del documento..." class="w-full bg-transparent text-xl md:text-3xl font-serif font-bold text-slate-100 placeholder:text-slate-600 border-none p-0 focus:ring-0" />
                          </div>
                          <div class="md:pb-4 text-left md:text-right">
                             <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Última ed.</div>
                             <div class="text-xs md:text-sm font-serif text-slate-500">{{ formatDate(selectedItem.updatedAt) }}</div>
                          </div>
                    </div>
                    <div class="px-4 md:px-12 pb-12 flex-1">
                        <textarea v-model="selectedItem.content" @input="triggerAutoSave" @keydown.tab.prevent="handleTab" placeholder="Empieza a escribir..." class="w-full h-full min-h-[400px] bg-transparent resize-none border-none focus:outline-none focus:ring-0 text-base md:text-lg text-slate-300 leading-7 md:leading-8 font-serif p-0 placeholder:text-slate-600 selection:bg-indigo-500 selection:text-white"></textarea>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center w-full h-full py-10 px-4">
                      <div class="relative w-full max-w-[350px] aspect-square p-6 md:p-8 shadow-2xl transition-colors duration-300 rotate-1 animate-pop-in flex flex-col" :class="selectedItem.color">
                        <div class="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 w-24 md:w-32 h-8 md:h-10 bg-slate-900/30 backdrop-blur-sm transform -rotate-1 shadow-sm border border-white/10"></div>

                        <input v-model="selectedItem.title" @input="triggerAutoSave" placeholder="Asunto..." class="w-full bg-transparent text-2xl md:text-3xl font-bold mb-4 text-slate-900/80 placeholder-slate-900/20 border-b border-slate-900/5 focus:border-slate-900/20 focus:outline-none text-center font-handwriting" />
                        <textarea v-model="selectedItem.content" @input="triggerAutoSave" placeholder="Escribe tu nota..." class="flex-1 w-full bg-transparent resize-none border-none focus:outline-none text-xl md:text-2xl font-bold text-slate-900/80 font-handwriting text-center leading-normal placeholder-slate-900/20"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center animate-float opacity-60">
            <div class="w-24 h-24 bg-slate-800/50 backdrop-blur rounded-full flex items-center justify-center mb-6 shadow-lg border border-white/5">
                <IconNotebook class="w-10 h-10 text-indigo-400" />
            </div>
            <h1 class="font-serif text-xl md:text-3xl text-slate-300 mb-2">Selecciona un elemento</h1>
            <p class="text-slate-500 text-sm">O crea uno nuevo desde el menú</p>
            <button @click="showSidebar = true" class="mt-8 md:hidden px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg border border-indigo-500/50">Abrir Menú</button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { userStore } from '@/stores/userStores'
import { loadNotes, saveNote, deleteNote } from '@/services/notesService'
import Header from '@/components/HeaderCompleto.vue'
import {
  FileText as IconFile, StickyNote as IconSticky, Search as IconSearch,
  Trash2 as IconTrash, Check as IconCheck, Loader2 as IconLoader,
  BookOpen as IconNotebook, Calendar as IconCalendar, ChevronLeft as IconLeft,
  ChevronRight as IconRight, Menu as IconMenu, X as IconX
} from 'lucide-vue-next'

const showSidebar = ref(false)
const currentView = ref('calendar')
const selectedItem = ref(null)
const searchQuery = ref('')
const isSaving = ref(false)
let saveTimeout = null

// Configuración Calendario
const viewDate = ref(new Date())
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const postItColors = [
  { bg: 'bg-[#fef08a]' }, { bg: 'bg-[#bbf7d0]' }, { bg: 'bg-[#bfdbfe]' }, { bg: 'bg-[#fbcfe8]' }, { bg: 'bg-[#ddd6fe]' }
]

const sections = ref([
  { type: 'Documento', title: 'Mis Documentos', items: [] },
  { type: 'Post-it', title: 'Recordatorios', items: [] }
])

// PERSISTENCIA: CARGA
onMounted(async () => {
  if (!userStore.token) return
  try {
      const notes = await loadNotes()
      sections.value[0].items = []
      sections.value[1].items = []

      notes.forEach(note => {
        const section = sections.value.find(s => s.type === note.type)
        if (section) section.items.push(note)
      })
  } catch (e) {
      console.error("Error cargando notas:", e)
  }
})

// PERSISTENCIA: GUARDADO
const triggerAutoSave = () => {
  if (!selectedItem.value) return
  isSaving.value = true
  selectedItem.value.updatedAt = new Date().toISOString()

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      const savedNote = await saveNote(selectedItem.value)
      if (!selectedItem.value.idBackend && savedNote.idBackend) {
          selectedItem.value.idBackend = savedNote.idBackend
      }
    } catch (e) {
      console.error(e)
    } finally {
      isSaving.value = false
    }
  }, 700)
}

// PERSISTENCIA: ELIMINACIÓN
const deleteItemFromSection = async (id, sectionType) => {
  const section = sections.value.find(s => s.type === sectionType)
  if (!section) return
  const item = section.items.find(i => i.id === id)
  if (!item || !confirm('¿Eliminar definitivamente?')) return

  try {
    if (item.idBackend) {
        await deleteNote(item.idBackend)
    }
  } catch (e) {
    console.error(e)
  }

  section.items = section.items.filter(i => i.id !== id)
  if (selectedItem.value?.id === id) selectedItem.value = null
}

const addItemToSection = (type) => {
  const section = sections.value.find(s => s.type === type)
  if (!section) return
  const newItem = {
    id: uuidv4(),
    idBackend: null,
    type,
    title: '',
    content: '',
    updatedAt: new Date().toISOString(),
    calendarDate: null,
    color: type === 'Post-it' ? 'bg-[#fef08a]' : null,
  }
  section.items.unshift(newItem)
  selectedItem.value = newItem
  triggerAutoSave()
  if(window.innerWidth < 768) showSidebar.value = false
}

// Lógica de Calendario
const currentMonthName = computed(() => viewDate.value.toLocaleString('es-ES', { month: 'long' }))
const currentYear = computed(() => viewDate.value.getFullYear())
const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear(); const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0)
  let startDay = firstDay.getDay() - 1; if (startDay === -1) startDay = 6
  const days = []; const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay; i > 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i + 1)
    days.push({ dayNumber: d.getDate(), dateStr: d.toISOString().split('T')[0], isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    days.push({ dayNumber: i, dateStr: d.toISOString().split('T')[0], isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ dayNumber: i, dateStr: d.toISOString().split('T')[0], isCurrentMonth: false })
  }
  return days
})

const changeMonth = (offset) => { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + offset, 1) }
const isToday = (dateStr) => dateStr === new Date().toISOString().split('T')[0]

// Helpers para renderizado en plantilla
const getDocsForDate = (dateStr) => {
    return sections.value.find(s => s.type === 'Documento').items.filter(item => item.calendarDate === dateStr)
}
const getPostItForDate = (dateStr) => {
    return sections.value.find(s => s.type === 'Post-it').items.find(item => item.calendarDate === dateStr)
}

// Drag & Drop
const onDragStart = (e, item) => {
  e.dataTransfer.setData('itemId', item.id)
  e.dataTransfer.effectAllowed = 'move'
}

const onDrop = (e, dateStr) => {
  const itemId = e.dataTransfer.getData('itemId')
  const allItems = sections.value.flatMap(s => s.items)
  const item = allItems.find(i => i.id === itemId)

  if (item) {
    if (item.type === 'Post-it') {
        const existingPostIt = sections.value
            .find(s => s.type === 'Post-it').items
            .find(i => i.calendarDate === dateStr && i.id !== item.id)

        if (existingPostIt) {
            alert('Solo se permite un Post-it por día.')
            return
        }
    }
    item.calendarDate = dateStr
    selectedItem.value = item
    triggerAutoSave()
  }
}

// Funciones Auxiliares
const handleTab = (e) => {
  const start = e.target.selectionStart; const end = e.target.selectionEnd
  selectedItem.value.content = selectedItem.value.content.substring(0, start) + "\t" + selectedItem.value.content.substring(end)
  nextTick(() => { e.target.selectionStart = e.target.selectionEnd = start + 1 })
  triggerAutoSave()
}
const selectItem = (item) => { selectedItem.value = item }
const filteredSections = computed(() => {
  if (!searchQuery.value) return sections.value
  const q = searchQuery.value.toLowerCase()
  return sections.value.map(s => ({ ...s, items: s.items.filter(i => i.title?.toLowerCase().includes(q) || i.content?.toLowerCase().includes(q))}))
})
const getIconByType = (type) => type === 'Documento' ? IconFile : IconSticky
const getColorByType = (type) => type === 'Documento' ? 'text-indigo-400' : 'text-amber-400'
const formatDate = (iso) => iso ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(iso)) : ''
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

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUpFade {
  from { transform: translateY(40px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes popIn {
    from { opacity: 0; transform: scale(0.9) rotate(0deg); }
    to { opacity: 1; transform: scale(1) rotate(1deg); }
}
</style>
