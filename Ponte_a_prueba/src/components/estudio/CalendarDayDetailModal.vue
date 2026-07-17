<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" :aria-label="'Detalle del día ' + date">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')" aria-hidden="true"></div>

    <div class="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-slate-900/95 backdrop-blur-2xl rounded-lg border-2 border-white/20 shadow-2xl ring-1 ring-white/10 overflow-hidden animate-pop-in">

      <!-- Cabecera -->
      <div class="flex items-center justify-between px-6 py-4 border-b-2 border-white/20 shrink-0">
        <div class="min-w-0">
          <h2 class="text-lg font-bold text-slate-100 capitalize truncate">{{ formattedDate }}</h2>
          <p class="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Detalle del día</p>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button type="button" class="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md transition-colors" aria-label="Añadir o editar en el día" @click="openAddMenu">
            <IconPlus class="w-4 h-4" aria-hidden="true" /> Añadir
          </button>
          <button type="button" class="p-2 text-slate-500 hover:text-slate-200 rounded-md hover:bg-white/10 transition-colors" aria-label="Cerrar" @click="$emit('close')">
            <IconX class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">

        <!-- STICKERS -->
        <section v-if="stickers.length">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Stickers</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="st in stickers" :key="st.id" class="text-2xl">{{ st.emoji }}</span>
          </div>
        </section>

        <!-- EVENTOS -->
        <section v-if="events.length">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Eventos</h3>
          <div class="space-y-1.5">
            <div v-for="ev in events" :key="ev.id" class="px-3 py-2 rounded-md bg-slate-950/70 border-2 border-white/15 group">
              <!-- Modo edición -->
              <div v-if="editingId === ev.id" class="flex flex-col gap-2">
                <div class="flex gap-2">
                  <input v-model="editText" type="text" class="flex-1 min-w-0 bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50" aria-label="Título del evento" />
                  <input v-model="editTime" type="time" class="bg-slate-900 border-2 border-white/20 rounded-md px-2 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" aria-label="Hora del evento" />
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex gap-1.5">
                    <button v-for="c in colorPresets" :key="c" type="button" class="w-5 h-5 rounded-full transition-transform hover:scale-110" :style="{ backgroundColor: c }" :class="editColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''" :aria-label="'Color ' + c" @click="editColor = c"></button>
                  </div>
                  <div class="flex gap-1.5">
                    <button type="button" class="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 rounded-md transition-colors" @click="cancelEdit">Cancelar</button>
                    <button type="button" :disabled="!editText.trim()" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-md transition-colors" @click="saveEdit(ev)">Guardar</button>
                  </div>
                </div>
              </div>
              <!-- Modo lectura -->
              <div v-else class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: ev.color || '#6366f1' }" aria-hidden="true"></span>
                <span v-if="ev.time" class="text-xs font-mono font-bold text-indigo-300 shrink-0">{{ ev.time }}</span>
                <span class="flex-1 text-sm text-slate-300 truncate">{{ ev.text }}</span>
                <button type="button" class="p-1 text-slate-600 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all" aria-label="Editar evento" @click="startEdit(ev)">
                  <IconEdit class="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" aria-label="Eliminar evento" @click="ctx.removeCalendarItem(ev)">
                  <IconTrash class="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- NOTAS RÁPIDAS -->
        <section v-if="texts.length">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Notas rápidas</h3>
          <div class="space-y-1.5">
            <div v-for="tx in texts" :key="tx.id" class="px-3 py-2 rounded-md border-2 group" :style="{ borderColor: (tx.color || '#94a3b8') + 'aa', backgroundColor: (tx.color || '#94a3b8') + '15' }">
              <div v-if="editingId === tx.id" class="flex flex-col gap-2">
                <input v-model="editText" type="text" class="w-full bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50" aria-label="Texto de la nota rápida" />
                <div class="flex items-center justify-between gap-2">
                  <div class="flex gap-1.5">
                    <button v-for="c in colorPresets" :key="c" type="button" class="w-5 h-5 rounded-full transition-transform hover:scale-110" :style="{ backgroundColor: c }" :class="editColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''" :aria-label="'Color ' + c" @click="editColor = c"></button>
                  </div>
                  <div class="flex gap-1.5">
                    <button type="button" class="px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 rounded-md transition-colors" @click="cancelEdit">Cancelar</button>
                    <button type="button" :disabled="!editText.trim()" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-md transition-colors" @click="saveEdit(tx)">Guardar</button>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center gap-2">
                <span class="flex-1 text-sm truncate" :style="{ color: tx.color || '#cbd5e1' }">{{ tx.text }}</span>
                <button type="button" class="p-1 text-slate-600 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all" aria-label="Editar nota rápida" @click="startEdit(tx)">
                  <IconEdit class="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" aria-label="Eliminar nota rápida" @click="ctx.removeCalendarItem(tx)">
                  <IconTrash class="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- POST-IT DEL DÍA -->
        <section v-if="linkedPostit">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Post-it del día</h3>
          <div class="flex justify-center">
            <div
              class="relative w-32 h-32 p-3 shadow-lg rotate-1 cursor-pointer transition-transform hover:scale-[1.03] flex flex-col"
              :class="linkedPostit.color"
              @click="openNote(linkedPostit)"
            >
              <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-6 bg-slate-900/30 backdrop-blur-sm -rotate-1 shadow-sm border border-white/10 pointer-events-none" aria-hidden="true"></div>
              <button type="button" class="absolute -top-2 -right-2 p-1 bg-slate-900/70 text-white rounded-full hover:bg-red-500 transition-colors" title="Desvincular del día" aria-label="Desvincular del día" @click.stop="ctx.setNoteDate(linkedPostit, null)">
                <IconUnlink class="w-3 h-3" aria-hidden="true" />
              </button>
              <span class="flex-1 flex items-center justify-center text-center text-sm font-bold text-slate-900/80 font-handwriting leading-tight break-words px-1">{{ linkedPostit.title || 'Sin título' }}</span>
            </div>
          </div>
        </section>

        <!-- DOCUMENTOS DEL DÍA -->
        <section v-if="linkedDocs.length">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Documentos del día</h3>
          <div class="space-y-2">
            <div
              v-for="note in linkedDocs" :key="note.id"
              class="group relative w-full px-4 py-3 rounded-md bg-slate-950/70 border-2 border-white/15 cursor-pointer hover:border-indigo-500/40 transition-colors"
              @click="openNote(note)"
            >
              <div class="flex items-center gap-2 mb-1">
                <IconFile class="w-4 h-4 shrink-0 text-indigo-400" aria-hidden="true" />
                <span class="flex-1 min-w-0 text-sm font-bold text-slate-200 truncate">{{ note.title || 'Sin título' }}</span>
                <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" title="Desvincular del día" aria-label="Desvincular del día" @click.stop="ctx.setNoteDate(note, null)">
                  <IconUnlink class="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
              <p v-if="previewText(note.content)" class="text-xs text-slate-500 line-clamp-2">{{ previewText(note.content) }}</p>
            </div>
          </div>
        </section>

        <!-- EXÁMENES -->
        <section v-if="linkedExams.length">
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Exámenes</h3>
          <div class="space-y-1.5">
            <div v-for="exam in linkedExams" :key="exam._id" class="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950/70 border-2 border-white/15 group">
              <IconBook class="w-4 h-4 shrink-0 text-purple-400" aria-hidden="true" />
              <button type="button" class="flex-1 text-left text-sm text-slate-300 truncate hover:text-indigo-300 transition-colors" @click="openExam(exam)">{{ exam.title || 'Sin título' }}</button>
              <button type="button" class="p-1 text-slate-600 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all" title="Abrir" aria-label="Abrir" @click="openExam(exam)">
                <IconOpen class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Desvincular del día" aria-label="Desvincular del día" @click="ctx.setExamDate(exam, null)">
                <IconUnlink class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useBackCloseOnMount } from '@/composables/useBackClose'
import {
  X as IconX, Plus as IconPlus, Trash2 as IconTrash, Pencil as IconEdit,
  ExternalLink as IconOpen, FileText as IconFile,
  Unlink as IconUnlink, GraduationCap as IconBook,
} from 'lucide-vue-next'

const props = defineProps({
  date: { type: String, required: true },
})
const emit = defineEmits(['close'])
useBackCloseOnMount(() => emit('close'))

const ctx = inject('studyCtx')
const { itemsByDate, notes, exams } = ctx
const router = useRouter()

const colorPresets = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#f87171']

const dayItems = computed(() => itemsByDate.value[props.date] || [])
const stickers = computed(() => dayItems.value.filter(i => i.kind === 'sticker'))
const events = computed(() => dayItems.value.filter(i => i.kind === 'event'))
const texts = computed(() => dayItems.value.filter(i => i.kind === 'text'))

const linkedNotes = computed(() => notes.value.filter(n => n.calendarDate === props.date))
const linkedPostit = computed(() => linkedNotes.value.find(n => n.type === 'Post-it') || null)
const linkedDocs = computed(() => linkedNotes.value.filter(n => n.type === 'Documento'))
const linkedExams = computed(() => exams.value.filter(e => e.calendarDate === props.date))

function previewText(html) {
  return (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
}

const formattedDate = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d))
})

// ----- Edición inline de eventos y notas rápidas -----
const editingId = ref(null)
const editText = ref('')
const editTime = ref('')
const editColor = ref(colorPresets[0])

function startEdit(item) {
  editingId.value = item.id
  editText.value = item.text || ''
  editTime.value = item.time || ''
  editColor.value = item.color || colorPresets[0]
}

function cancelEdit() {
  editingId.value = null
}

function saveEdit(item) {
  if (!editText.value.trim()) return
  const patch = { text: editText.value.trim(), color: editColor.value }
  if (item.kind === 'event') patch.time = editTime.value || undefined
  ctx.editCalendarItem(item, patch)
  editingId.value = null
}

function openNote(note) {
  ctx.selectNote(note)
  emit('close')
}

function openExam(exam) {
  router.push(`/examen/${exam._id}`)
  emit('close')
}

function openAddMenu() {
  ctx.openDay(props.date)
  emit('close')
}
</script>

<style scoped>
.font-handwriting { font-family: 'Caveat', cursive; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }

.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
