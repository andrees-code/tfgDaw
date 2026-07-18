<template>
  <div class="flex-1 flex flex-col p-2 md:p-6 overflow-hidden animate-fade-in-up">

    <!-- Cabecera del mes -->
    <div class="flex items-center justify-between mb-4 md:mb-6 bg-slate-800/60 backdrop-blur-xl p-3 md:p-4 rounded-2xl border border-white/10 shadow-lg shrink-0">
      <h2 class="text-lg md:text-2xl font-serif font-bold text-slate-200 capitalize">
        {{ currentMonthName }} <span class="hidden sm:inline text-indigo-400 font-sans">{{ currentYear }}</span>
      </h2>
      <div class="flex items-center gap-2">
        <button type="button" @click="goToday" class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl transition-colors" aria-label="Ir a hoy">Hoy</button>
        <button type="button" @click="changeMonth(-1)" class="p-1.5 md:p-2 hover:bg-white/5 text-slate-400 hover:text-indigo-400 rounded-xl transition-colors" aria-label="Mes anterior"><IconLeft aria-hidden="true" /></button>
        <button type="button" @click="changeMonth(1)" class="p-1.5 md:p-2 hover:bg-white/5 text-slate-400 hover:text-indigo-400 rounded-xl transition-colors" aria-label="Mes siguiente"><IconRight aria-hidden="true" /></button>
      </div>
    </div>

    <!-- Rejilla -->
    <div class="flex-1 grid grid-cols-7 grid-rows-[auto_1fr_1fr_1fr_1fr_1fr_1fr] gap-px bg-slate-700/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-0 ring-1 ring-white/5">
      <div v-for="dayName in weekDays" :key="dayName" class="bg-slate-900/90 p-1 md:p-2 text-center text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-center">{{ dayName }}</div>

      <div
        v-for="(day, index) in calendarDays" :key="index"
        @dragenter.prevent
        @dragover.prevent
        @drop="onDrop($event, day.dateStr)"
        @click="onDayClick(day.dateStr)"
        class="min-h-[60px] md:min-h-[90px] p-1 md:p-1.5 transition-colors relative group flex flex-col overflow-hidden hover:bg-white/5 cursor-pointer"
        :class="[day.isCurrentMonth ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-900/80 text-slate-600', isToday(day.dateStr) ? 'bg-indigo-900/20 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.3)]' : '']"
      >
        <!-- Número + stickers (máx. 4) -->
        <div class="flex items-start gap-1 shrink-0 pr-[42%] leading-none">
          <span class="text-[10px] md:text-xs font-mono font-bold pointer-events-none" :class="isToday(day.dateStr) ? 'text-indigo-400' : 'opacity-30'">{{ day.dayNumber }}</span>
          <div class="flex flex-wrap gap-0 leading-none">
            <span v-for="st in stickersFor(day.dateStr)" :key="st.id" class="text-[10px] md:text-[13px]" :title="'Sticker'">{{ st.emoji }}</span>
          </div>
        </div>

        <!-- Post-it cuadrado en la esquina superior derecha -->
        <div
          v-if="postItsFor(day.dateStr).length"
          class="absolute top-1 right-1 z-20 w-[42%] max-w-[60px]"
          draggable="true"
          @dragstart.stop="onDragStartNote($event, postItsFor(day.dateStr)[0])"
          @click.stop="ctx.selectNote(postItsFor(day.dateStr)[0])"
        >
          <div
            class="aspect-square w-full rotate-2 shadow-md border border-black/20 p-0.5 md:p-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing hover:rotate-0 hover:scale-110 hover:z-30 transition-transform rounded-[2px]"
            :class="postItsFor(day.dateStr)[0].color || 'bg-[#fef08a]'"
            :title="postItsFor(day.dateStr)[0].title || 'Post-it'"
          >
            <p class="font-handwriting font-bold text-slate-900/90 text-[8px] md:text-[11px] leading-tight text-center break-words line-clamp-3 pointer-events-none">
              {{ postItsFor(day.dateStr)[0].content || postItsFor(day.dateStr)[0].title || 'Nota' }}
            </p>
          </div>
          <span
            v-if="postItsFor(day.dateStr).length > 1"
            class="absolute -bottom-1 -left-1 bg-slate-900 text-white text-[8px] md:text-[9px] font-bold px-1 rounded-full border border-white/20 shadow"
            :title="postItsFor(day.dateStr).length + ' post-its este día'"
          >+{{ postItsFor(day.dateStr).length - 1 }}</span>
        </div>

        <!-- Contenido del día (anclado abajo, con mini scroll si desborda) -->
        <div class="flex-1 min-h-0 flex flex-col mt-0.5 overflow-y-auto cal-cell-scroll">
          <div class="mt-auto flex flex-col gap-0.5 pointer-events-auto">
          <!-- Eventos (con hora) -->
          <div
            v-for="ev in eventsFor(day.dateStr)" :key="ev.id"
            class="text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded truncate font-medium text-white/95 shadow-sm shrink-0"
            :style="{ backgroundColor: ev.color || '#6366f1' }"
            :title="(ev.time ? ev.time + ' · ' : '') + ev.text"
          >
            <span v-if="ev.time" class="font-mono font-bold">{{ ev.time }}</span> {{ ev.text }}
          </div>

          <!-- Mini-notas de texto -->
          <div
            v-for="tx in textsFor(day.dateStr)" :key="tx.id"
            class="text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded truncate border font-medium shrink-0"
            :style="{ borderColor: (tx.color || '#94a3b8') + '66', color: tx.color || '#cbd5e1', backgroundColor: (tx.color || '#94a3b8') + '1a' }"
            :title="tx.text"
          >
            {{ tx.text }}
          </div>

          <!-- Documentos enlazados -->
          <div
            v-for="note in docsFor(day.dateStr)" :key="note.id"
            draggable="true"
            @dragstart.stop="onDragStartNote($event, note)"
            @click.stop="ctx.selectNote(note)"
            class="cursor-grab active:cursor-grabbing text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded truncate shadow-sm border bg-slate-700 border-white/10 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all shrink-0"
            :title="note.title || 'Documento'"
          >
            📄 {{ note.title || 'Doc' }}
          </div>

          <!-- Exámenes enlazados -->
          <div
            v-for="exam in examsFor(day.dateStr)" :key="exam._id"
            draggable="true"
            @dragstart.stop="onDragStartExam($event, exam)"
            @click.stop="router.push(`/examen/${exam._id}`)"
            class="cursor-grab active:cursor-grabbing text-[8px] md:text-[10px] px-1 md:px-1.5 py-0.5 rounded truncate shadow-sm border bg-purple-900/60 border-purple-500/20 text-purple-200 hover:bg-purple-600 hover:text-white transition-all shrink-0"
            :title="exam.title || 'Examen'"
          >
            📘 {{ exam.title || 'Examen' }}
          </div>
          </div>
        </div>

        <!-- Botón añadir: siempre abre el menú normal -->
        <button
          type="button"
          class="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg z-30"
          aria-label="Añadir al día"
          @click.stop="ctx.openDay(day.dateStr)"
        >
          <IconPlus class="w-3 h-3" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft as IconLeft, ChevronRight as IconRight, Plus as IconPlus } from 'lucide-vue-next'

const ctx = inject('studyCtx')
const { itemsByDate, notes, exams, calendarViewDate } = ctx
const router = useRouter()

// Compartido con el sidebar (filtro de exámenes favoritos por mes)
const viewDate = calendarViewDate
const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const currentMonthName = computed(() => viewDate.value.toLocaleString('es-ES', { month: 'long' }))
const currentYear = computed(() => viewDate.value.getFullYear())

const calendarDays = computed(() => {
  const year = viewDate.value.getFullYear(); const month = viewDate.value.getMonth()
  const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0)
  let startDay = firstDay.getDay() - 1; if (startDay === -1) startDay = 6
  const days = []; const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = startDay; i > 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i + 1)
    days.push({ dayNumber: d.getDate(), dateStr: toDateStr(d), isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    days.push({ dayNumber: i, dateStr: toDateStr(d), isCurrentMonth: true })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    days.push({ dayNumber: i, dateStr: toDateStr(d), isCurrentMonth: false })
  }
  return days
})

// Fecha local YYYY-MM-DD (evita el desfase de toISOString con zonas horarias)
function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const changeMonth = (offset) => { viewDate.value = new Date(viewDate.value.getFullYear(), viewDate.value.getMonth() + offset, 1) }
const goToday = () => { viewDate.value = new Date() }
const isToday = (dateStr) => dateStr === toDateStr(new Date())

// Helpers por día
const stickersFor = (dateStr) => (itemsByDate.value[dateStr] || []).filter(i => i.kind === 'sticker').slice(0, 4)
const eventsFor = (dateStr) => (itemsByDate.value[dateStr] || []).filter(i => i.kind === 'event')
const textsFor = (dateStr) => (itemsByDate.value[dateStr] || []).filter(i => i.kind === 'text')
const docsFor = (dateStr) => notes.value.filter(n => n.calendarDate === dateStr && n.type === 'Documento')
const postItsFor = (dateStr) => notes.value.filter(n => n.calendarDate === dateStr && n.type === 'Post-it')
const examsFor = (dateStr) => exams.value.filter(e => e.calendarDate === dateStr)

// ¿El día tiene contenido? (los stickers son decorativos, no cuentan)
const hasItems = (dateStr) =>
  eventsFor(dateStr).length || textsFor(dateStr).length ||
  docsFor(dateStr).length || postItsFor(dateStr).length || examsFor(dateStr).length

// Día con elementos: abre el modal de detalle. Día vacío: abre el menú normal.
function onDayClick(dateStr) {
  if (hasItems(dateStr)) ctx.openDayDetail(dateStr)
  else ctx.openDay(dateStr)
}

// Drag & drop de notas y exámenes al calendario (text/plain: máxima compatibilidad)
function onDragStartNote(e, note) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'note', id: note.id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDragStartExam(e, exam) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'exam', id: exam._id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDrop(e, dateStr) {
  let payload
  try {
    payload = JSON.parse(e.dataTransfer.getData('text/plain'))
  } catch {
    return
  }
  if (payload?.kind === 'note') {
    const note = notes.value.find(n => n.id === payload.id)
    if (note) ctx.setNoteDate(note, dateStr)
  } else if (payload?.kind === 'exam') {
    const exam = exams.value.find(e => e._id === payload.id)
    if (exam) ctx.setExamDate(exam, dateStr)
  }
}
</script>

<style scoped>
/* La fuente Caveat ya la carga la vista (import de Google Fonts) */
.font-handwriting { font-family: 'Caveat', cursive; }

/* Mini scroll dentro de cada celda del día */
.cal-cell-scroll { scrollbar-width: thin; scrollbar-color: #475569 transparent; }
.cal-cell-scroll::-webkit-scrollbar { width: 3px; }
.cal-cell-scroll::-webkit-scrollbar-track { background: transparent; }
.cal-cell-scroll::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 3px; }

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
