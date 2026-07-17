<template>
  <div class="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Papelera">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="$emit('close')" aria-hidden="true"></div>

    <div class="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden animate-pop-in">

      <!-- Cabecera -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div class="flex items-center gap-3">
          <IconTrash class="w-6 h-6 text-slate-400" aria-hidden="true" />
          <div>
            <h2 class="text-lg font-bold text-slate-100">Papelera</h2>
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">{{ items.length }} elemento{{ items.length === 1 ? '' : 's' }} · se borran a los 30 días</p>
          </div>
        </div>
        <button type="button" class="p-2 text-slate-500 hover:text-slate-200 rounded-xl hover:bg-white/5 transition-colors" aria-label="Cerrar" @click="$emit('close')">
          <IconX class="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <!-- Acciones globales -->
      <div v-if="items.length" class="flex items-center justify-end px-6 py-2 border-b border-white/5 shrink-0">
        <button type="button" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-colors" @click="onEmpty">
          <IconTrash class="w-3.5 h-3.5" aria-hidden="true" /> Vaciar papelera
        </button>
      </div>

      <!-- Lista -->
      <div class="flex-1 overflow-y-auto custom-scrollbar px-4 py-3 space-y-1.5">
        <div v-if="!items.length" class="h-40 flex flex-col items-center justify-center text-slate-500 gap-2">
          <IconTrash class="w-10 h-10 opacity-30" aria-hidden="true" />
          <p class="text-sm">La papelera está vacía</p>
        </div>

        <div
          v-for="item in items" :key="item.kind + item.id"
          class="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-slate-950/50 border border-white/5 group"
        >
          <component :is="iconFor(item)" class="w-5 h-5 shrink-0" :class="colorFor(item)" aria-hidden="true" />
          <div class="flex-1 min-w-0">
            <p class="text-sm text-slate-200 truncate">{{ item.title || 'Sin título' }}</p>
            <p class="text-[11px] text-slate-500">{{ item.type }} · {{ daysLeftLabel(item) }}</p>
          </div>
          <button type="button" class="p-1.5 text-slate-500 hover:text-emerald-400 rounded-lg hover:bg-white/5 transition-colors" title="Restaurar" aria-label="Restaurar" @click="restore(item)">
            <IconRestore class="w-4 h-4" aria-hidden="true" />
          </button>
          <button type="button" class="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors" title="Eliminar definitivamente" aria-label="Eliminar definitivamente" @click="destroy(item)">
            <IconTrash class="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue'
import { useBackCloseOnMount } from '@/composables/useBackClose'
import {
  Trash2 as IconTrash, X as IconX, RotateCcw as IconRestore,
  FileText as IconFile, StickyNote as IconSticky, GraduationCap as IconBook,
} from 'lucide-vue-next'

const emit = defineEmits(['close'])
useBackCloseOnMount(() => emit('close'))
const ctx = inject('studyCtx')
const items = computed(() => ctx.trash.value)

onMounted(() => { ctx.loadTrash() })

function iconFor(item) {
  if (item.kind === 'exam') return IconBook
  return item.type === 'Post-it' ? IconSticky : IconFile
}
function colorFor(item) {
  if (item.kind === 'exam') return 'text-purple-400'
  return item.type === 'Post-it' ? 'text-amber-400' : 'text-indigo-400'
}

function daysLeft(item) {
  const elapsed = (Date.now() - new Date(item.deletedAt).getTime()) / 86400000
  return Math.max(0, Math.ceil(30 - elapsed))
}
function daysLeftLabel(item) {
  const d = daysLeft(item)
  return d <= 1 ? 'se elimina pronto' : `se elimina en ${d} días`
}

function restore(item) { ctx.restoreTrashItem(item) }
function destroy(item) {
  if (confirm(`¿Eliminar "${item.title || 'Sin título'}" definitivamente? Esta acción no se puede deshacer.`)) ctx.purgeTrashItem(item)
}
function onEmpty() {
  if (confirm('¿Vaciar la papelera? Se eliminarán definitivamente todos los elementos.')) ctx.emptyTrash()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 4px; }

.animate-pop-in { animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes popIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
