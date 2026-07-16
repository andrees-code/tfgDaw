<template>
  <div>
    <div v-for="node in nodes" :key="node.id">

      <!-- Fila de carpeta -->
      <div
        class="group flex items-center gap-1.5 pr-2 py-1.5 rounded-lg cursor-pointer transition-all border"
        :class="dragOverId === node.id ? 'bg-indigo-500/15 border-indigo-500/40' : 'border-transparent hover:bg-white/5'"
        :style="{ paddingLeft: depth * 14 + 8 + 'px' }"
        :draggable="renamingId !== node.id"
        @dragstart.stop="onDragStartFolder($event, node)"
        @dragenter.prevent
        @dragover.prevent="dragOverId = node.id"
        @dragleave="dragOverId = null"
        @drop.stop.prevent="onDrop($event, node)"
        @click="toggle(node)"
      >
        <component :is="expandedMap[node.id] ? IconChevronDown : IconChevronRight" class="w-3.5 h-3.5 shrink-0 text-slate-500" aria-hidden="true" />
        <IconFolder class="w-4 h-4 shrink-0" :style="node.color ? { color: node.color } : {}" :class="!node.color ? 'text-indigo-400' : ''" aria-hidden="true" />

        <input
          v-if="renamingId === node.id"
          ref="renameInput"
          v-model="renameText"
          class="flex-1 min-w-0 bg-slate-950/70 border border-indigo-500/40 rounded-md px-1.5 py-0.5 text-xs text-slate-200 focus:outline-none"
          @click.stop
          @keydown.enter.prevent="confirmRename(node)"
          @keydown.esc="renamingId = null"
          @blur="confirmRename(node)"
          aria-label="Renombrar carpeta"
        />
        <span v-else class="flex-1 min-w-0 text-sm font-medium truncate text-slate-300 group-hover:text-slate-200">{{ node.name }}</span>

        <span v-if="node.notes.length + node.exams.length + node.children.length > 0" class="text-[9px] font-mono text-slate-600 group-hover:hidden">{{ node.notes.length + node.exams.length + node.children.length }}</span>

        <!-- Acciones (hover) -->
        <div class="hidden group-hover:flex items-center gap-0.5 shrink-0">
          <button type="button" class="p-1 text-slate-500 hover:text-indigo-400 transition-colors" title="Nuevo documento" aria-label="Nuevo documento en esta carpeta" @click.stop="ctx.newNote('Documento', node.id)">
            <IconFilePlus class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button type="button" class="p-1 text-slate-500 hover:text-amber-400 transition-colors" title="Nuevo post-it" aria-label="Nuevo post-it en esta carpeta" @click.stop="ctx.newNote('Post-it', node.id)">
            <IconSticky class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button type="button" class="p-1 text-slate-500 hover:text-indigo-400 transition-colors" title="Nueva subcarpeta" aria-label="Nueva subcarpeta" @click.stop="ctx.newFolder(node.id)">
            <IconFolderPlus class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button type="button" class="p-1 text-slate-500 hover:text-indigo-400 transition-colors" title="Renombrar" aria-label="Renombrar carpeta" @click.stop="startRename(node)">
            <IconPencil class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button type="button" class="p-1 text-slate-500 hover:text-red-400 transition-colors" title="Eliminar" aria-label="Eliminar carpeta" @click.stop="confirmDelete(node)">
            <IconTrash class="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <!-- Input inline para crear subcarpeta -->
      <div v-if="ctx.creatingIn.value === node.id" class="flex items-center gap-1.5 pr-2 py-1" :style="{ paddingLeft: (depth + 1) * 14 + 8 + 'px' }">
        <IconFolder class="w-4 h-4 shrink-0 text-indigo-400/60" aria-hidden="true" />
        <input
          :ref="el => el && el.focus()"
          v-model="newFolderName"
          type="text"
          placeholder="Nombre de la carpeta..."
          class="flex-1 min-w-0 bg-slate-950/70 border border-indigo-500/40 rounded-md px-1.5 py-1 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
          @keydown.enter.prevent="submitNewFolder"
          @keydown.esc="cancelNewFolder"
          @blur="submitNewFolder"
          aria-label="Nombre de la nueva subcarpeta"
        />
      </div>

      <!-- Contenido expandido: notas + subcarpetas (recursión) -->
      <div v-if="expandedMap[node.id]">
        <div
          v-for="note in node.notes"
          :key="note.id"
          class="group flex items-center gap-2 pr-2 py-1.5 rounded-lg cursor-pointer transition-all border"
          :class="ctx.selectedItem.value?.id === note.id ? 'bg-indigo-500/10 border-indigo-500/40' : 'border-transparent hover:bg-white/5'"
          :style="{ paddingLeft: (depth + 1) * 14 + 22 + 'px' }"
          draggable="true"
          @dragstart.stop="onDragStartNote($event, note)"
          @click="ctx.selectNote(note)"
        >
          <component :is="note.type === 'Documento' ? IconFile : IconSticky" class="w-3.5 h-3.5 shrink-0" :class="note.type === 'Documento' ? 'text-indigo-400' : 'text-amber-400'" aria-hidden="true" />
          <span class="flex-1 min-w-0 text-sm truncate" :class="ctx.selectedItem.value?.id === note.id ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-300'">{{ note.title || 'Sin título' }}</span>
          <button type="button" class="hidden group-hover:block p-1 text-slate-600 hover:text-red-400 transition-colors shrink-0" aria-label="Eliminar nota" @click.stop="ctx.handleRemoveNote(note)">
            <IconTrash class="w-3 h-3" aria-hidden="true" />
          </button>
        </div>

        <RouterLink
          v-for="exam in node.exams"
          :key="exam._id"
          :to="`/examen/${exam._id}`"
          class="group flex items-center gap-2 pr-2 py-1.5 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-white/5"
          :style="{ paddingLeft: (depth + 1) * 14 + 22 + 'px' }"
          draggable="true"
          @dragstart.stop="onDragStartExam($event, exam)"
        >
          <IconBook class="w-3.5 h-3.5 shrink-0 text-purple-400" aria-hidden="true" />
          <span class="flex-1 min-w-0 text-sm truncate text-slate-400 group-hover:text-slate-300">{{ exam.title || 'Sin título' }}</span>
        </RouterLink>

        <FolderTree :nodes="node.children" :depth="depth + 1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import {
  ChevronDown as IconChevronDown, ChevronRight as IconChevronRight,
  Folder as IconFolder, FolderPlus as IconFolderPlus,
  FileText as IconFile, FilePlus as IconFilePlus, StickyNote as IconSticky,
  Pencil as IconPencil, Trash2 as IconTrash, GraduationCap as IconBook,
} from 'lucide-vue-next'

defineProps({
  nodes: { type: Array, required: true },
  depth: { type: Number, default: 0 },
})

const ctx = inject('studyCtx')
const { expandedMap } = ctx

const renamingId = ref(null)
const renameText = ref('')
const renameInput = ref(null)
const dragOverId = ref(null)
const newFolderName = ref('')

function toggle(node) {
  expandedMap[node.id] = !expandedMap[node.id]
}

function submitNewFolder() {
  const name = newFolderName.value
  newFolderName.value = ''
  ctx.confirmCreateFolder(name)
}

function cancelNewFolder() {
  newFolderName.value = ''
  ctx.creatingIn.value = null
}

function startRename(node) {
  renamingId.value = node.id
  renameText.value = node.name
  nextTick(() => {
    const el = Array.isArray(renameInput.value) ? renameInput.value[0] : renameInput.value
    el?.focus()
    el?.select()
  })
}

function confirmRename(node) {
  if (renamingId.value !== node.id) return
  const name = renameText.value.trim()
  renamingId.value = null
  if (name && name !== node.name) {
    const folder = ctx.folders.value.find(f => f.id === node.id)
    if (folder) ctx.renameFolder(folder, name)
  }
}

function confirmDelete(node) {
  if (!confirm(`¿Eliminar la carpeta "${node.name}"? Su contenido se enviará a la papelera.`)) return
  const folder = ctx.folders.value.find(f => f.id === node.id)
  if (folder) ctx.removeFolder(folder)
}

// ----- Drag & drop -----
// Usamos text/plain (máxima compatibilidad entre navegadores)
function onDragStartNote(e, note) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'note', id: note.id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDragStartFolder(e, node) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'folder', id: node.id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDragStartExam(e, exam) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ kind: 'exam', id: exam._id }))
  e.dataTransfer.effectAllowed = 'move'
}

function onDrop(e, node) {
  dragOverId.value = null
  let payload
  try {
    payload = JSON.parse(e.dataTransfer.getData('text/plain'))
  } catch {
    return
  }
  if (!payload) return

  if (payload.kind === 'note') {
    const note = ctx.notes.value.find(n => n.id === payload.id)
    if (note && note.folderId !== node.id) {
      ctx.moveNoteToFolder(note, node.id)
      expandedMap[node.id] = true
    }
  } else if (payload.kind === 'exam') {
    const exam = ctx.exams.value.find(e => e._id === payload.id)
    if (exam && exam.folderId !== node.id) {
      ctx.moveExamToFolder(exam, node.id)
      expandedMap[node.id] = true
    }
  } else if (payload.kind === 'folder' && payload.id !== node.id) {
    const folder = ctx.folders.value.find(f => f.id === payload.id)
    if (folder && folder.parentId !== node.id) {
      ctx.moveFolder(folder, node.id)
      expandedMap[node.id] = true
    }
  }
}
</script>
