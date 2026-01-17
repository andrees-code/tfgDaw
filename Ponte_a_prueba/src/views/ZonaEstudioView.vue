<template>
  <div>
    <Header />
    <div class="h-screen flex bg-[#1e293b] font-sans overflow-hidden selection:bg-blue-500 selection:text-white">

      <div v-if="showSidebar" @click="showSidebar = false" class="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"></div>

      <aside
        class="fixed md:static inset-y-0 left-0 w-80 bg-[#f1f5f9] text-slate-700 flex flex-col z-40 
               transform transition-transform duration-500 md:translate-x-0 border-r border-slate-300 shadow-2xl"
        :class="showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
      >
        
        <div class="p-6 pb-4">
          <h1 class="font-serif text-3xl font-bold text-slate-800 tracking-tight mb-8 flex items-center gap-2">
            <IconNotebook class="w-8 h-8 text-[#0f172a]" />
            <span>Notas<span class="text-blue-600">.</span></span>
          </h1>

          <div class="flex gap-2 mb-8">
              <button @click="addItemToSection('Documento')" class="flex-1 py-3 bg-white hover:bg-blue-600 hover:text-white text-slate-700 rounded shadow-sm border border-slate-300 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group">
                  <IconFile class="w-4 h-4" /> Doc
              </button>
               <button @click="addItemToSection('Post-it')" class="flex-1 py-3 bg-white hover:bg-amber-500 hover:text-white text-slate-700 rounded shadow-sm border border-slate-300 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 group">
                  <IconSticky class="w-4 h-4" /> Post
              </button>
          </div>

          <div class="relative group mb-4">
            <IconSearch class="w-4 h-4 text-slate-400 absolute left-3 top-2.5 transition-colors group-focus-within:text-blue-600" />
            <input v-model="searchQuery" type="text" placeholder="Buscar..." class="w-full pl-9 pr-4 py-2 bg-slate-200 border-none rounded text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm">
          </div>

          <button 
            @click="currentView = 'calendar'; selectedItem = null"
            class="w-full flex items-center gap-3 px-4 py-3 rounded mb-4 transition-all"
            :class="currentView === 'calendar' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'"
          >
            <IconCalendar class="w-5 h-5" />
            <span class="font-bold text-sm uppercase tracking-wider">Calendario</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6">
          <div v-for="section in filteredSections" :key="section.type" class="mb-6">
            <h2 class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3 px-2">{{ section.title }}</h2>

            <div class="space-y-1">
              <div
                v-for="item in section.items"
                :key="item.id"
                draggable="true"
                @dragstart="onDragStart($event, item)"
                @click="selectItem(item); currentView = 'editor'; showSidebar = false"
                class="group relative px-4 py-3 rounded cursor-grab active:cursor-grabbing transition-all duration-200 border border-transparent"
                :class="selectedItem?.id === item.id ? 'bg-white shadow-md text-blue-700 border-slate-200' : 'hover:bg-white hover:shadow-sm text-slate-600 hover:text-slate-900'"
              >
                  <div class="flex justify-between items-start">
                      <span class="font-medium text-sm truncate pr-4">{{ item.title || 'Sin Título' }}</span>
                      <component :is="getIconByType(item.type)" class="w-3.5 h-3.5 mt-0.5" :class="getColorByType(item.type)"/>
                  </div>
                  <span class="text-[10px] opacity-60 mt-1 block">{{ formatDate(item.updatedAt) }}</span>
                  <button @click.stop="deleteItemFromSection(item.id, section.type)" class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconTrash class="w-3.5 h-3.5" />
                  </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 flex flex-col relative bg-[#293548] text-slate-200 overflow-hidden">
        
        <div v-if="currentView === 'calendar'" class="flex-1 flex flex-col p-6 overflow-hidden">
          <div class="flex items-center justify-between mb-6 bg-[#0f172a] p-4 rounded-xl border border-slate-700 shadow-xl">
            <h2 class="text-2xl font-serif font-bold text-white capitalize">{{ currentMonthName }} {{ currentYear }}</h2>
            <div class="flex gap-2">
              <button @click="changeMonth(-1)" class="p-2 hover:bg-slate-700 rounded-lg transition-colors"><IconLeft /></button>
              <button @click="changeMonth(1)" class="p-2 hover:bg-slate-700 rounded-lg transition-colors"><IconRight /></button>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-slate-700 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
            <div v-for="dayName in weekDays" :key="dayName" class="bg-[#1e293b] p-2 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ dayName }}</div>
            <div 
              v-for="(day, index) in calendarDays" :key="index"
              @dragover.prevent @drop="onDrop($event, day.dateStr)"
              class="bg-[#1e293b] min-h-[100px] p-2 transition-colors relative group"
              :class="[day.isCurrentMonth ? 'text-slate-200' : 'text-slate-600 bg-[#1e293b]/50', isToday(day.dateStr) ? 'ring-1 ring-inset ring-blue-500' : '']"
            >
              <span class="text-xs font-mono font-bold">{{ day.dayNumber }}</span>
              <div class="mt-2 space-y-1 overflow-y-auto max-h-[80%] custom-scrollbar-dark">
                <div v-for="item in getItemsByDate(day.dateStr)" :key="item.id" @click="selectItem(item); currentView = 'editor'" class="cursor-pointer transition-transform hover:scale-105">
                  <div v-if="item.type === 'Documento'" class="text-[10px] bg-blue-600/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded truncate">📄 {{ item.title || 'Doc' }}</div>
                  <div v-else :class="item.color" class="p-1.5 rounded shadow-sm text-slate-900 border border-black/5 transform -rotate-2">
                    <p class="text-[9px] leading-tight font-handwriting font-bold line-clamp-2">{{ item.content || item.title || 'Nota...' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="selectedItem" class="flex-1 flex flex-col h-full">
            <header class="h-14 flex items-center justify-between px-6 shrink-0 bg-[#0f172a] border-b border-slate-700">
                <div class="flex items-center gap-4">
                     <span class="text-xs font-mono text-slate-400 uppercase tracking-widest">{{ selectedItem.type }}</span>
                     <div v-if="isSaving" class="text-xs text-blue-400 flex items-center gap-2"><IconLoader class="w-3 h-3 animate-spin" /> Guardando...</div>
                     <div v-else class="text-xs text-emerald-400 flex items-center gap-2"><IconCheck class="w-3 h-3" /> Guardado</div>
                </div>
                <div v-if="selectedItem.type === 'Post-it'" class="flex gap-2">
                  <button v-for="color in postItColors" :key="color.bg" @click="selectedItem.color = color.bg; triggerAutoSave()" class="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-[#0f172a] hover:scale-110 transition-transform" :class="[color.bg, selectedItem.color === color.bg ? 'ring-white' : 'ring-transparent']"></button>
                </div>
            </header>

            <div class="flex-1 overflow-y-auto custom-scrollbar-dark bg-[#334155]/50 flex justify-center p-4 md:p-10">
                <div v-if="selectedItem.type === 'Documento'" class="w-full max-w-[850px] bg-white text-slate-800 shadow-2xl min-h-[1000px] animate-fade-in relative mx-auto">
                    <div class="h-24 px-12 flex items-end justify-between border-b-2 border-slate-100 mb-10">
                         <div class="pb-4">
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Título del documento</h3>
                             <input v-model="selectedItem.title" @input="triggerAutoSave" placeholder="Escribe el título aquí..." class="w-full min-w-[400px] bg-transparent text-2xl font-serif font-bold text-slate-900 placeholder:text-slate-300 border-none p-0 focus:ring-0" />
                         </div>
                         <div class="pb-4 text-right">
                             <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fecha</div>
                             <div class="text-sm font-serif text-slate-600">{{ formatDate(selectedItem.updatedAt) }}</div>
                         </div>
                    </div>
                    <div class="px-12 pb-12">
                        <textarea v-model="selectedItem.content" @input="triggerAutoSave" @keydown.tab.prevent="handleTab" placeholder="Comienza a redactar tu documento..." class="w-full h-[800px] bg-transparent resize-none border-none focus:outline-none focus:ring-0 text-lg text-slate-700 leading-8 font-serif p-0 placeholder:text-slate-300"></textarea>
                    </div>
                </div>

                <div v-else class="flex flex-col items-center justify-center w-full h-full pb-20">
                     <div class="relative w-[350px] h-[350px] p-8 shadow-2xl transition-colors duration-300 rotate-1 animate-pop-in flex flex-col" :class="selectedItem.color">
                        <div class="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/20 backdrop-blur-sm transform -rotate-2 shadow-sm border border-white/30"></div>
                        <input v-model="selectedItem.title" @input="triggerAutoSave" placeholder="Asunto..." class="w-full bg-transparent text-3xl font-bold mb-4 text-slate-800/80 placeholder-slate-900/20 border-b border-slate-900/10 focus:border-slate-900/30 focus:outline-none text-center font-handwriting" />
                        <textarea v-model="selectedItem.content" @input="triggerAutoSave" placeholder="Escribe tu recordatorio..." class="flex-1 w-full bg-transparent resize-none border-none focus:outline-none text-2xl font-bold text-slate-800/80 font-handwriting text-center leading-normal placeholder-slate-900/20"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="flex-1 flex flex-col items-center justify-center opacity-20">
            <IconNotebook class="w-24 h-24 text-slate-100 mb-6" />
            <h1 class="font-serif text-3xl text-slate-300">Selecciona un elemento</h1>
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
  BookOpen as IconNotebook, Calendar as IconCalendar, ChevronLeft as IconLeft, ChevronRight as IconRight
} from 'lucide-vue-next'

const showSidebar = ref(false)
const currentView = ref('editor')
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

// PERSISTENCIA: CARGA (Basado en tu código)
onMounted(async () => {
  if (!userStore.token) return
  const notes = await loadNotes()
  notes.forEach(note => {
    const section = sections.value.find(s => s.type === note.type)
    if (section) section.items.push(note)
  })
})

// PERSISTENCIA: GUARDADO (Basado en tu código)
const triggerAutoSave = () => {
  if (!selectedItem.value) return
  isSaving.value = true
  selectedItem.value.updatedAt = new Date().toISOString()

  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(async () => {
    try {
      await saveNote(selectedItem.value)
    } catch (e) {
      console.error(e)
    } finally {
      isSaving.value = false
    }
  }, 700)
}

// PERSISTENCIA: ELIMINACIÓN (Basado en tu código)
const deleteItemFromSection = async (id, sectionType) => {
  const section = sections.value.find(s => s.type === sectionType)
  if (!section) return
  const item = section.items.find(i => i.id === id)
  if (!item || !confirm('¿Eliminar definitivamente?')) return

  try {
    await deleteNote(item.idBackend)
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
    type,
    title: '', 
    content: '',
    updatedAt: new Date().toISOString(),
    calendarDate: null,
    color: type === 'Post-it' ? 'bg-[#fef08a]' : null,
    idBackend: null,
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
const getItemsByDate = (dateStr) => sections.value.flatMap(s => s.items).filter(item => item.calendarDate === dateStr)

// Drag & Drop
const onDragStart = (e, item) => {
  e.dataTransfer.setData('itemId', item.id)
  e.dataTransfer.effectAllowed = 'move'
}
const onDrop = (e, dateStr) => {
  const itemId = e.dataTransfer.getData('itemId')
  const item = sections.value.flatMap(s => s.items).find(i => i.id === itemId)
  if (item) {
    item.calendarDate = dateStr
    triggerAutoSave() // Guarda el cambio de fecha automáticamente
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
const getColorByType = (type) => type === 'Documento' ? 'text-blue-600' : 'text-amber-500'
const formatDate = (iso) => iso ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(iso)) : ''
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Inter:wght@300;400;500;600&family=Caveat:wght@600;700&display=swap');
.font-sans { font-family: 'Inter', sans-serif; }
.font-serif { font-family: 'Merriweather', serif; }
.font-handwriting { font-family: 'Caveat', cursive; }
.custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
.custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popIn { from { opacity: 0; transform: scale(0.9) rotate(0deg); } to { opacity: 1; transform: scale(1) rotate(1deg); } }
</style>