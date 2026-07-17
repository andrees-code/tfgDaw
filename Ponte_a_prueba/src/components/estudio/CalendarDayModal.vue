<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" :aria-label="'Editar día ' + date">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')" aria-hidden="true"></div>

    <div class="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-slate-900/95 backdrop-blur-2xl rounded-lg border-2 border-white/20 shadow-2xl ring-1 ring-white/10 overflow-hidden animate-pop-in">

      <!-- Cabecera -->
      <div class="flex items-center justify-between px-6 py-4 border-b-2 border-white/20 shrink-0">
        <div>
          <h2 class="text-lg font-bold text-slate-100 capitalize">{{ formattedDate }}</h2>
          <p class="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Organiza tu día</p>
        </div>
        <button type="button" class="p-2 text-slate-500 hover:text-slate-200 rounded-md hover:bg-white/10 transition-colors" aria-label="Cerrar" @click="$emit('close')">
          <IconX class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">

        <!-- STICKERS -->
        <section>
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Stickers
            <span class="ml-1 font-mono" :class="stickers.length >= MAX_STICKERS ? 'text-amber-400' : 'text-slate-600'">{{ stickers.length }}/{{ MAX_STICKERS }}</span>
          </h3>
          <div v-if="stickers.length" class="flex flex-wrap gap-1.5 mb-3">
            <button
              v-for="st in stickers" :key="st.id" type="button"
              class="text-xl p-1 rounded-lg hover:bg-red-500/20 transition-colors group relative"
              :title="'Pulsar para quitar'"
              aria-label="Quitar sticker"
              @click="ctx.removeCalendarItem(st)"
            >
              {{ st.emoji }}
              <IconX class="w-3 h-3 absolute -top-0.5 -right-0.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </button>
          </div>
          <div v-if="stickers.length >= MAX_STICKERS" class="text-xs text-amber-400/80 px-1 py-2">
            Has llegado al máximo de {{ MAX_STICKERS }} stickers por día. Quita alguno para añadir otro.
          </div>
          <div v-else class="grid grid-cols-8 gap-1 p-2 bg-slate-950/50 rounded-md border-2 border-white/15">
            <button
              v-for="emoji in emojiPresets" :key="emoji" type="button"
              class="text-lg p-1.5 rounded-lg hover:bg-indigo-500/20 hover:scale-110 transition-all"
              :aria-label="'Añadir sticker ' + emoji"
              @click="addSticker(emoji)"
            >{{ emoji }}</button>
          </div>
        </section>

        <!-- EVENTOS -->
        <section>
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Eventos</h3>
          <div v-if="events.length" class="space-y-1.5 mb-3">
            <div v-for="ev in events" :key="ev.id" class="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950/70 border-2 border-white/15 group">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: ev.color || '#6366f1' }" aria-hidden="true"></span>
              <span v-if="ev.time" class="text-xs font-mono font-bold text-indigo-300 shrink-0">{{ ev.time }}</span>
              <span class="flex-1 text-sm text-slate-300 truncate">{{ ev.text }}</span>
              <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" aria-label="Eliminar evento" @click="ctx.removeCalendarItem(ev)">
                <IconTrash class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <form class="flex flex-col gap-2 p-3 bg-slate-950/50 rounded-md border-2 border-white/15" @submit.prevent="addEvent">
            <div class="flex gap-2">
              <input v-model="eventTitle" type="text" placeholder="Título del evento..." class="flex-1 min-w-0 bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" aria-label="Título del evento" />
              <input v-model="eventTime" type="time" class="bg-slate-900 border-2 border-white/20 rounded-md px-2 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" aria-label="Hora del evento" />
            </div>
            <div class="flex items-center justify-between gap-2">
              <div class="flex gap-1.5">
                <button
                  v-for="c in colorPresets" :key="c" type="button"
                  class="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  :style="{ backgroundColor: c }"
                  :class="eventColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''"
                  :aria-label="'Color ' + c"
                  @click="eventColor = c"
                ></button>
              </div>
              <button type="submit" :disabled="!eventTitle.trim()" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors">Añadir</button>
            </div>
          </form>
        </section>

        <!-- NOTAS DE TEXTO -->
        <section>
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Notas rápidas</h3>
          <div v-if="texts.length" class="space-y-1.5 mb-3">
            <div v-for="tx in texts" :key="tx.id" class="flex items-center gap-2 px-3 py-2 rounded-md border-2 group" :style="{ borderColor: (tx.color || '#94a3b8') + 'aa', backgroundColor: (tx.color || '#94a3b8') + '15' }">
              <span class="flex-1 text-sm truncate" :style="{ color: tx.color || '#cbd5e1' }">{{ tx.text }}</span>
              <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" aria-label="Eliminar nota rápida" @click="ctx.removeCalendarItem(tx)">
                <IconTrash class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <form class="flex flex-col gap-2 p-3 bg-slate-950/50 rounded-md border-2 border-white/15" @submit.prevent="addText">
            <input v-model="textContent" type="text" placeholder="Escribe una nota rápida..." class="w-full bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" aria-label="Texto de la nota rápida" />
            <div class="flex items-center justify-between gap-2">
              <div class="flex gap-1.5">
                <button
                  v-for="c in colorPresets" :key="c" type="button"
                  class="w-5 h-5 rounded-full transition-transform hover:scale-110"
                  :style="{ backgroundColor: c }"
                  :class="textColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : ''"
                  :aria-label="'Color ' + c"
                  @click="textColor = c"
                ></button>
              </div>
              <button type="submit" :disabled="!textContent.trim()" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors">Añadir</button>
            </div>
          </form>
        </section>

        <!-- DOCUMENTOS / POST-ITS ENLAZADOS -->
        <section>
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Documentos y post-its del día</h3>
          <div v-if="linkedNotes.length" class="space-y-1.5 mb-3">
            <div v-for="note in linkedNotes" :key="note.id" class="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950/70 border-2 border-white/15 group">
              <component :is="note.type === 'Documento' ? IconFile : IconSticky" class="w-4 h-4 shrink-0" :class="note.type === 'Documento' ? 'text-indigo-400' : 'text-amber-400'" aria-hidden="true" />
              <button type="button" class="flex-1 text-left text-sm text-slate-300 truncate hover:text-indigo-300 transition-colors" @click="openNote(note)">{{ note.title || 'Sin título' }}</button>
              <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Desvincular del día" aria-label="Desvincular del día" @click="ctx.setNoteDate(note, null)">
                <IconUnlink class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div v-if="linkableNotes.length" class="flex gap-2">
            <select v-model="noteToLink" class="flex-1 min-w-0 bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" aria-label="Elegir nota para enlazar">
              <option value="" disabled>Enlazar documento o post-it...</option>
              <option v-for="note in linkableNotes" :key="note.id" :value="note.id">
                {{ note.type === 'Documento' ? '📄' : '📌' }} {{ note.title || 'Sin título' }}
              </option>
            </select>
            <button type="button" :disabled="!noteToLink" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors" @click="linkNote">Enlazar</button>
          </div>
          <p v-else-if="!linkedNotes.length" class="text-xs text-slate-600">No tienes documentos ni post-its que enlazar.</p>
        </section>

        <!-- EXÁMENES ENLAZADOS -->
        <section>
          <h3 class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Exámenes del día</h3>
          <div v-if="linkedExams.length" class="space-y-1.5 mb-3">
            <div v-for="exam in linkedExams" :key="exam._id" class="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-950/70 border-2 border-white/15 group">
              <IconBook class="w-4 h-4 shrink-0 text-purple-400" aria-hidden="true" />
              <button type="button" class="flex-1 text-left text-sm text-slate-300 truncate hover:text-indigo-300 transition-colors" @click="openExam(exam)">{{ exam.title || 'Sin título' }}</button>
              <button type="button" class="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all" title="Desvincular del día" aria-label="Desvincular del día" @click="ctx.setExamDate(exam, null)">
                <IconUnlink class="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div v-if="linkableExams.length" class="flex gap-2">
            <select v-model="examToLink" class="flex-1 min-w-0 bg-slate-900 border-2 border-white/20 rounded-md px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50" aria-label="Elegir examen para enlazar">
              <option value="" disabled>Enlazar examen...</option>
              <option v-for="exam in linkableExams" :key="exam._id" :value="exam._id">
                📘 {{ exam.title || 'Sin título' }}
              </option>
            </select>
            <button type="button" :disabled="!examToLink" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-md transition-colors" @click="linkExam">Enlazar</button>
          </div>
          <p v-else-if="!linkedExams.length" class="text-xs text-slate-600">No tienes exámenes que enlazar.</p>
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
  X as IconX, Trash2 as IconTrash, FileText as IconFile,
  StickyNote as IconSticky, Unlink as IconUnlink, GraduationCap as IconBook,
} from 'lucide-vue-next'

const props = defineProps({
  date: { type: String, required: true },
})
const emit = defineEmits(['close'])
useBackCloseOnMount(() => emit('close'))

const ctx = inject('studyCtx')
const { itemsByDate, notes, exams } = ctx
const router = useRouter()

const MAX_STICKERS = 4
const emojiPresets = ['⭐', '🔥', '🎯', '📚', '✅', '💪', '🧠', '☕', '🎉', '😄', '😴', '🚀', '📝', '⏰', '❤️', '🌟', '🍀', '⚡', '🏆', '📖', '🎧', '🧪', '💻', '🌙']
const colorPresets = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#38bdf8', '#f87171']

const eventTitle = ref('')
const eventTime = ref('')
const eventColor = ref(colorPresets[0])
const textContent = ref('')
const textColor = ref(colorPresets[3])
const noteToLink = ref('')
const examToLink = ref('')

const dayItems = computed(() => itemsByDate.value[props.date] || [])
const stickers = computed(() => dayItems.value.filter(i => i.kind === 'sticker'))
const events = computed(() => dayItems.value.filter(i => i.kind === 'event'))
const texts = computed(() => dayItems.value.filter(i => i.kind === 'text'))

const linkedNotes = computed(() => notes.value.filter(n => n.calendarDate === props.date))
const linkableNotes = computed(() => notes.value.filter(n => n.calendarDate !== props.date))

const linkedExams = computed(() => exams.value.filter(e => e.calendarDate === props.date))
const linkableExams = computed(() => exams.value.filter(e => e.calendarDate !== props.date))

const formattedDate = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(y, m - 1, d))
})

function addSticker(emoji) {
  if (stickers.value.length >= MAX_STICKERS) return
  ctx.addCalendarItem({ date: props.date, kind: 'sticker', emoji })
}

function addEvent() {
  if (!eventTitle.value.trim()) return
  ctx.addCalendarItem({
    date: props.date,
    kind: 'event',
    text: eventTitle.value.trim(),
    time: eventTime.value || undefined,
    color: eventColor.value,
  })
  eventTitle.value = ''
  eventTime.value = ''
}

function addText() {
  if (!textContent.value.trim()) return
  ctx.addCalendarItem({
    date: props.date,
    kind: 'text',
    text: textContent.value.trim(),
    color: textColor.value,
  })
  textContent.value = ''
}

function linkNote() {
  const note = notes.value.find(n => n.id === noteToLink.value)
  if (!note) return
  if (note.type === 'Post-it') {
    const existing = linkedNotes.value.find(n => n.type === 'Post-it' && n.id !== note.id)
    if (existing) ctx.setNoteDate(existing, null)
  }
  ctx.setNoteDate(note, props.date)
  noteToLink.value = ''
}

function openNote(note) {
  ctx.selectNote(note)
  emit('close')
}

function linkExam() {
  const exam = exams.value.find(e => e._id === examToLink.value)
  if (exam) ctx.setExamDate(exam, props.date)
  examToLink.value = ''
}

function openExam(exam) {
  router.push(`/examen/${exam._id}`)
  emit('close')
}
</script>

<style scoped>
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
