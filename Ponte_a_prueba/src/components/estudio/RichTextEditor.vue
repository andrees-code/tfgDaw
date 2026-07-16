<template>
  <div class="flex flex-col h-full min-h-0">
    <!-- Barra de herramientas -->
    <div v-if="editor" class="flex flex-wrap items-center gap-0.5 p-2 border-b border-white/10 bg-slate-900/60 rounded-t-lg sticky top-0 z-20 backdrop-blur">

      <button type="button" :class="btnClass(false)" :disabled="!editor.can().undo()" @click="editor.chain().focus().undo().run()" title="Deshacer" aria-label="Deshacer">
        <IconUndo class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(false)" :disabled="!editor.can().redo()" @click="editor.chain().focus().redo().run()" title="Rehacer" aria-label="Rehacer">
        <IconRedo class="w-4 h-4" aria-hidden="true" />
      </button>

      <span class="w-px h-5 bg-white/10 mx-1" aria-hidden="true"></span>

      <button type="button" :class="btnClass(editor.isActive('heading', { level: 1 }))" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" title="Título 1" aria-label="Título 1">
        <IconH1 class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('heading', { level: 2 }))" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="Título 2" aria-label="Título 2">
        <IconH2 class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('heading', { level: 3 }))" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="Título 3" aria-label="Título 3">
        <IconH3 class="w-4 h-4" aria-hidden="true" />
      </button>

      <span class="w-px h-5 bg-white/10 mx-1" aria-hidden="true"></span>

      <button type="button" :class="btnClass(editor.isActive('bold'))" @click="editor.chain().focus().toggleBold().run()" title="Negrita" aria-label="Negrita">
        <IconBold class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('italic'))" @click="editor.chain().focus().toggleItalic().run()" title="Cursiva" aria-label="Cursiva">
        <IconItalic class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('underline'))" @click="editor.chain().focus().toggleUnderline().run()" title="Subrayado" aria-label="Subrayado">
        <IconUnderline class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('strike'))" @click="editor.chain().focus().toggleStrike().run()" title="Tachado" aria-label="Tachado">
        <IconStrike class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('highlight'))" @click="editor.chain().focus().toggleHighlight().run()" title="Resaltar" aria-label="Resaltar">
        <IconHighlight class="w-4 h-4" aria-hidden="true" />
      </button>

      <!-- Color de texto -->
      <div class="relative">
        <button type="button" :class="btnClass(showColors)" @click="showColors = !showColors" title="Color de texto" aria-label="Color de texto">
          <IconPalette class="w-4 h-4" aria-hidden="true" />
        </button>
        <div v-if="showColors" class="absolute top-full left-0 mt-1 p-2 bg-slate-800 border border-white/10 rounded-xl shadow-2xl z-30 flex flex-wrap gap-1.5 w-44">
          <button
            v-for="c in textColors" :key="c" type="button"
            class="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
            :style="{ backgroundColor: c }"
            :aria-label="'Color ' + c"
            @click="setColor(c)"
          ></button>
          <button type="button" class="w-full mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white py-1 rounded-lg hover:bg-white/5 transition-colors" @click="setColor(null)">
            Quitar color
          </button>
        </div>
      </div>

      <span class="w-px h-5 bg-white/10 mx-1" aria-hidden="true"></span>

      <button type="button" :class="btnClass(editor.isActive('bulletList'))" @click="editor.chain().focus().toggleBulletList().run()" title="Lista" aria-label="Lista con viñetas">
        <IconList class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('orderedList'))" @click="editor.chain().focus().toggleOrderedList().run()" title="Lista numerada" aria-label="Lista numerada">
        <IconListOrdered class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('taskList'))" @click="editor.chain().focus().toggleTaskList().run()" title="Checklist" aria-label="Lista de tareas">
        <IconListChecks class="w-4 h-4" aria-hidden="true" />
      </button>

      <span class="w-px h-5 bg-white/10 mx-1" aria-hidden="true"></span>

      <button type="button" :class="btnClass(editor.isActive('blockquote'))" @click="editor.chain().focus().toggleBlockquote().run()" title="Cita" aria-label="Cita">
        <IconQuote class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('code'))" @click="editor.chain().focus().toggleCode().run()" title="Código en línea" aria-label="Código en línea">
        <IconCode class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('codeBlock'))" @click="editor.chain().focus().toggleCodeBlock().run()" title="Bloque de código" aria-label="Bloque de código">
        <IconCodeBlock class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(editor.isActive('link'))" @click="toggleLink" title="Enlace" aria-label="Enlace">
        <IconLink class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(false)" @click="editor.chain().focus().setHorizontalRule().run()" title="Separador" aria-label="Separador horizontal">
        <IconMinus class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" :class="btnClass(false)" @click="editor.chain().focus().unsetAllMarks().clearNodes().run()" title="Limpiar formato" aria-label="Limpiar formato">
        <IconClearFormat class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>

    <!-- Contenido -->
    <EditorContent :editor="editor" class="rte-content flex-1 min-h-0" @click="showColors = false" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle, Color } from '@tiptap/extension-text-style'
import {
  Undo2 as IconUndo, Redo2 as IconRedo,
  Heading1 as IconH1, Heading2 as IconH2, Heading3 as IconH3,
  Bold as IconBold, Italic as IconItalic, Underline as IconUnderline, Strikethrough as IconStrike,
  Highlighter as IconHighlight, Palette as IconPalette,
  List as IconList, ListOrdered as IconListOrdered, ListChecks as IconListChecks,
  Quote as IconQuote, Code as IconCode, Code2 as IconCodeBlock,
  Link2 as IconLink, Minus as IconMinus, RemoveFormatting as IconClearFormat,
} from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Empieza a escribir...' },
})
const emit = defineEmits(['update:modelValue'])

const showColors = ref(false)
const textColors = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#818cf8', '#e879f9', '#f472b6', '#e2e8f0', '#94a3b8']

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    // StarterKit v3 ya incluye negrita, cursiva, subrayado, tachado, encabezados,
    // listas, cita, código, enlace, separador y deshacer/rehacer.
    StarterKit.configure({
      link: { openOnClick: false, autolink: true },
    }),
    Highlight,
    TaskList,
    TaskItem.configure({ nested: true }),
    TextStyle,
    Color,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  onUpdate: ({ editor: ed }) => {
    emit('update:modelValue', ed.getHTML())
  },
})

// Si el valor cambia desde fuera (p. ej. al cambiar de nota), sincronizar.
watch(() => props.modelValue, (value) => {
  if (!editor.value) return
  if ((value || '') !== editor.value.getHTML()) {
    editor.value.commands.setContent(value || '', { emitUpdate: false })
  }
})

function setColor(color) {
  if (!editor.value) return
  if (color) editor.value.chain().focus().setColor(color).run()
  else editor.value.chain().focus().unsetColor().run()
  showColors.value = false
}

function toggleLink() {
  if (!editor.value) return
  if (editor.value.isActive('link')) {
    editor.value.chain().focus().unsetLink().run()
    return
  }
  const url = window.prompt('URL del enlace:', 'https://')
  if (!url || url === 'https://') return
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function btnClass(active) {
  return [
    'p-2 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed',
    active ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
  ]
}
</script>

<style scoped>
/* Estilos del contenido del editor (ProseMirror) */
.rte-content :deep(.ProseMirror) {
  outline: none;
  min-height: 400px;
  padding: 1rem 0;
  color: #cbd5e1;
  font-size: 1.05rem;
  line-height: 1.8;
}

.rte-content :deep(.ProseMirror h1) { font-size: 1.9rem; font-weight: 800; color: #f1f5f9; margin: 1.2rem 0 0.6rem; }
.rte-content :deep(.ProseMirror h2) { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 1rem 0 0.5rem; }
.rte-content :deep(.ProseMirror h3) { font-size: 1.2rem; font-weight: 700; color: #e2e8f0; margin: 0.8rem 0 0.4rem; }

.rte-content :deep(.ProseMirror ul:not([data-type='taskList'])) { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
.rte-content :deep(.ProseMirror ol) { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }

.rte-content :deep(.ProseMirror ul[data-type='taskList']) { list-style: none; padding-left: 0.25rem; margin: 0.5rem 0; }
.rte-content :deep(.ProseMirror ul[data-type='taskList'] li) { display: flex; align-items: flex-start; gap: 0.5rem; }
.rte-content :deep(.ProseMirror ul[data-type='taskList'] li > label) { margin-top: 0.4rem; }
.rte-content :deep(.ProseMirror ul[data-type='taskList'] li > label input) { accent-color: #6366f1; width: 1rem; height: 1rem; cursor: pointer; }
.rte-content :deep(.ProseMirror ul[data-type='taskList'] li[data-checked='true'] > div) { text-decoration: line-through; opacity: 0.55; }

.rte-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid #6366f1;
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: #94a3b8;
  font-style: italic;
}

.rte-content :deep(.ProseMirror code) {
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  padding: 0.15rem 0.4rem;
  border-radius: 0.35rem;
  font-size: 0.9em;
}

.rte-content :deep(.ProseMirror pre) {
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 0.9rem 1.1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
}
.rte-content :deep(.ProseMirror pre code) { background: transparent; color: #e2e8f0; padding: 0; }

.rte-content :deep(.ProseMirror a) { color: #818cf8; text-decoration: underline; cursor: pointer; }
.rte-content :deep(.ProseMirror mark) { background: #fde047; color: #1e293b; padding: 0 0.15rem; border-radius: 0.2rem; }
.rte-content :deep(.ProseMirror hr) { border: none; border-top: 1px solid rgba(255, 255, 255, 0.15); margin: 1.25rem 0; }

/* Placeholder */
.rte-content :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #475569;
  pointer-events: none;
  height: 0;
}
</style>
