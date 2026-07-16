<template>
  <div
    ref="rootEl"
    tabindex="0"
    class="fixed z-[70] flex flex-col bg-white text-slate-800 rounded-xl shadow-2xl ring-1 ring-black/20 overflow-hidden select-none outline-none"
    :style="maximized
      ? { top: '8px', left: '8px', right: '8px', bottom: '8px', width: 'auto', height: 'auto' }
      : { top: pos.y + 'px', left: pos.x + 'px', width: size.w + 'px', height: size.h + 'px' }"
    role="dialog"
    aria-label="Explorador de archivos"
    @click="closeContextMenu"
    @keydown="onKey"
    @mousedown="onRootMouseDown"
  >
    <!-- Barra de título -->
    <div
      class="flex items-center gap-2 px-3 h-9 bg-slate-100 border-b border-slate-200 cursor-move shrink-0"
      @mousedown="startDrag"
      @dblclick="maximized = !maximized"
    >
      <IconFolder class="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
      <span class="text-xs font-semibold text-slate-600 truncate flex-1">Explorador — {{ currentTitle }}</span>
      <button type="button" class="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-200 text-slate-500" aria-label="Maximizar" @click.stop="maximized = !maximized">
        <component :is="maximized ? IconMinimize : IconMaximize" class="w-3.5 h-3.5" aria-hidden="true" />
      </button>
      <button type="button" class="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500 hover:text-white text-slate-500 transition-colors" aria-label="Cerrar" @click.stop="$emit('close')">
        <IconX class="w-4 h-4" aria-hidden="true" />
      </button>
    </div>

    <!-- Barra de herramientas -->
    <div class="flex items-center gap-1 px-2 h-10 bg-white border-b border-slate-200 shrink-0 overflow-x-auto">
      <button type="button" class="tb-btn" :disabled="currentFolderId === null" aria-label="Atrás" @click="goUp">
        <IconUp class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn" aria-label="Inicio" @click="goHome">
        <IconHome class="w-4 h-4" aria-hidden="true" />
      </button>
      <span class="w-px h-5 bg-slate-200 mx-1"></span>
      <button type="button" class="tb-btn" :disabled="inFav" title="Nueva carpeta" aria-label="Nueva carpeta" @click="createFolderHere">
        <IconFolderPlus class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn" :disabled="inFav" title="Nuevo documento" aria-label="Nuevo documento" @click="createNoteHere('Documento')">
        <IconFilePlus class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn" :disabled="inFav" title="Nuevo post-it" aria-label="Nuevo post-it" @click="createNoteHere('Post-it')">
        <IconSticky class="w-4 h-4 text-amber-500" aria-hidden="true" />
      </button>
      <span class="w-px h-5 bg-slate-200 mx-1"></span>
      <button type="button" class="tb-btn" :disabled="!selectionCount" title="Cortar" aria-label="Cortar" @click="clip('cut')">
        <IconCut class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn" :disabled="!selectionCount" title="Copiar" aria-label="Copiar" @click="clip('copy')">
        <IconCopy class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn" :disabled="!clipboard || inFav" title="Pegar" aria-label="Pegar" @click="paste">
        <IconPaste class="w-4 h-4" aria-hidden="true" />
      </button>
      <span class="w-px h-5 bg-slate-200 mx-1"></span>
      <button type="button" class="tb-btn" :disabled="!canRename" title="Renombrar (F2)" aria-label="Renombrar" @click="renameSingle">
        <IconPencil class="w-4 h-4" aria-hidden="true" />
      </button>
      <button type="button" class="tb-btn hover:!bg-red-50 hover:!text-red-600" :disabled="!selectionCount" title="Eliminar (Supr)" aria-label="Eliminar" @click="deleteSelected">
        <IconTrash class="w-4 h-4" aria-hidden="true" />
      </button>
      <span class="w-px h-5 bg-slate-200 mx-1"></span>
      <button type="button" class="tb-btn relative" title="Papelera" aria-label="Abrir papelera" @click="showBin = true">
        <IconTrash class="w-4 h-4" aria-hidden="true" />
        <span v-if="trashCount" class="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{{ trashCount }}</span>
      </button>
    </div>

    <!-- Ruta (breadcrumb) -->
    <div class="flex items-center gap-1 px-3 h-8 bg-slate-50 border-b border-slate-200 shrink-0 text-xs overflow-x-auto">
      <button type="button" class="crumb" @click="goHome" @dragover.prevent @drop.prevent="dropOnFolder(null)">Inicio</button>
      <template v-for="c in crumbs" :key="c.id">
        <IconChevron class="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
        <button type="button" class="crumb" @click="openFolder(c.id)" @dragover.prevent @drop.prevent="dropOnFolder(c.id === FAV ? null : c.id)">{{ c.name }}</button>
      </template>
    </div>

    <!-- Cuerpo: nav lateral + contenido -->
    <div class="flex-1 flex min-h-0">

      <!-- Navegación lateral -->
      <div class="w-44 shrink-0 bg-slate-50 border-r border-slate-200 overflow-y-auto py-1 text-sm">
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200/60 transition-colors"
          :class="currentFolderId === null ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600'"
          @click="goHome"
          @dragover.prevent
          @drop.prevent="dropOnFolder(null)"
        >
          <IconHome class="w-4 h-4 shrink-0" aria-hidden="true" /> Inicio
        </button>
        <button
          v-if="favoriteExams.length"
          type="button"
          class="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200/60 transition-colors"
          :class="inFav ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600'"
          @click="openFolder(FAV)"
        >
          <IconStar class="w-4 h-4 shrink-0 text-amber-400 fill-amber-300" aria-hidden="true" /> Favoritos
        </button>
        <button
          type="button"
          class="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-200/60 transition-colors text-slate-600"
          aria-label="Abrir papelera"
          @click="showBin = true"
        >
          <IconTrash class="w-4 h-4 shrink-0" aria-hidden="true" /> Papelera
          <span v-if="trashCount" class="ml-auto text-[10px] font-mono text-slate-400">{{ trashCount }}</span>
        </button>

        <div class="my-1 border-t border-slate-200"></div>

        <!-- Carpetas del árbol (arrastrables, editables, con menú) -->
        <div
          v-for="nav in navList" :key="nav.id"
          class="group w-full flex items-center gap-1 pr-2 py-1.5 hover:bg-slate-200/60 transition-colors cursor-pointer"
          :class="[
            currentFolderId === nav.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-600',
            navDragOverId === nav.id ? 'ring-1 ring-inset ring-blue-400 bg-blue-50' : '',
          ]"
          :style="{ paddingLeft: nav.depth * 12 + 8 + 'px' }"
          :draggable="renaming?.id !== nav.id"
          @click="openFolder(nav.id)"
          @dragstart.stop="onDragStart($event, 'folder', nav.id)"
          @dragenter.prevent
          @dragover.prevent="navDragOverId = nav.id"
          @dragleave="navDragOverId = null"
          @drop.prevent.stop="navDrop(nav.id)"
          @contextmenu.prevent.stop="openItemMenu($event, 'folder', nav.id)"
        >
          <component
            :is="nav.expanded ? IconChevronDown : IconChevron"
            class="w-3 h-3 shrink-0 text-slate-400"
            :class="nav.hasChildren ? '' : 'invisible'"
            @click.stop="toggleNav(nav.id)"
            aria-hidden="true"
          />
          <IconFolder class="w-4 h-4 shrink-0 text-amber-500" aria-hidden="true" />
          <input
            v-if="renaming?.kind === 'folder' && renaming.id === nav.id"
            ref="renameInput" v-model="renameText"
            class="flex-1 min-w-0 text-xs bg-white border border-blue-400 rounded px-1 py-0.5 focus:outline-none text-slate-800"
            @click.stop @keydown.stop.enter.prevent="confirmRename" @keydown.esc="renaming = null" @blur="confirmRename"
            aria-label="Renombrar carpeta"
          />
          <span v-else class="truncate">{{ nav.name }}</span>
        </div>
      </div>

      <!-- Contenido de la carpeta actual -->
      <div
        ref="contentEl"
        class="relative flex-1 min-h-0 overflow-y-auto p-3 bg-white"
        @contextmenu.prevent="openBgMenu($event)"
        @dragover.prevent
        @drop.prevent="dropOnFolder(currentFolderId === FAV ? null : currentFolderId)"
        @mousedown="onContentMouseDown"
      >
        <div v-if="isEmpty" class="h-full flex flex-col items-center justify-center text-slate-400 gap-2 pointer-events-none">
          <IconFolder class="w-12 h-12 opacity-40" aria-hidden="true" />
          <p class="text-sm">Esta carpeta está vacía</p>
          <p v-if="currentFolderId === null" class="text-xs">Aquí aparece todo lo que no está en ninguna carpeta</p>
        </div>

        <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-1">
          <!-- Subcarpetas (incluye la carpeta virtual Favoritos en Inicio) -->
          <div
            v-for="f in displayFolders" :key="'f' + f.id"
            :data-key="f.virtual ? null : 'folder:' + f.id"
            class="explorer-item"
            :class="isSelected('folder', f.id) ? 'bg-blue-100 ring-1 ring-blue-300' : 'hover:bg-slate-100'"
            :draggable="!f.virtual && renaming?.id !== f.id"
            @click.stop="f.virtual ? select('folder', f.id) : onItemClick($event, 'folder', f.id)"
            @dblclick="openFolder(f.id)"
            @dragstart="!f.virtual && onDragStart($event, 'folder', f.id)"
            @dragover.prevent
            @drop.stop.prevent="dropOnFolder(f.virtual ? null : f.id)"
            @contextmenu.prevent.stop="f.virtual ? openFolder(f.id) : openItemMenu($event, 'folder', f.id)"
          >
            <IconStar v-if="f.virtual" class="w-11 h-11 text-amber-400 fill-amber-300" aria-hidden="true" />
            <IconFolder v-else class="w-11 h-11" :class="clipHas('folder', f.id) ? 'text-amber-300' : 'text-amber-400'" aria-hidden="true" />
            <input
              v-if="!f.virtual && renaming?.kind === 'folder' && renaming.id === f.id"
              ref="renameInput" v-model="renameText"
              class="rename-input"
              @click.stop @keydown.stop.enter.prevent="confirmRename" @keydown.esc="renaming = null" @blur="confirmRename"
              aria-label="Renombrar carpeta"
            />
            <span v-else class="item-label">{{ f.name }}</span>
          </div>

          <!-- Notas / post-its -->
          <div
            v-for="n in childNotes" :key="'n' + n.id"
            :data-key="'note:' + n.id"
            class="explorer-item"
            :class="[isSelected('note', n.id) ? 'bg-blue-100 ring-1 ring-blue-300' : 'hover:bg-slate-100', clipHas('note', n.id) ? 'opacity-50' : '']"
            :draggable="renaming?.id !== n.id"
            @click.stop="onItemClick($event, 'note', n.id)"
            @dblclick="openNote(n)"
            @dragstart="onDragStart($event, 'note', n.id)"
            @contextmenu.prevent.stop="openItemMenu($event, 'note', n.id)"
          >
            <component :is="n.type === 'Documento' ? IconFile : IconSticky" class="w-11 h-11" :class="n.type === 'Documento' ? 'text-blue-500' : 'text-amber-400'" aria-hidden="true" />
            <input
              v-if="renaming?.kind === 'note' && renaming.id === n.id"
              ref="renameInput" v-model="renameText"
              class="rename-input"
              @click.stop @keydown.stop.enter.prevent="confirmRename" @keydown.esc="renaming = null" @blur="confirmRename"
              aria-label="Renombrar nota"
            />
            <span v-else class="item-label">{{ n.title || 'Sin título' }}</span>
          </div>

          <!-- Exámenes -->
          <div
            v-for="e in childExams" :key="'e' + e._id"
            :data-key="'exam:' + e._id"
            class="explorer-item"
            :class="[isSelected('exam', e._id) ? 'bg-blue-100 ring-1 ring-blue-300' : 'hover:bg-slate-100', clipHas('exam', e._id) ? 'opacity-50' : '']"
            draggable="true"
            @click.stop="onItemClick($event, 'exam', e._id)"
            @dblclick="openExam(e)"
            @dragstart="onDragStart($event, 'exam', e._id)"
            @contextmenu.prevent.stop="openItemMenu($event, 'exam', e._id)"
          >
            <IconBook class="w-11 h-11 text-purple-500" aria-hidden="true" />
            <span class="item-label">{{ e.title || 'Examen' }}</span>
          </div>
        </div>

        <!-- Rectángulo de selección (marquesina) -->
        <div v-if="marquee.active" class="fixed z-[75] border border-blue-400 bg-blue-400/20 pointer-events-none" :style="marqueeStyle" aria-hidden="true"></div>
      </div>
    </div>

    <!-- Barra de estado -->
    <div class="h-6 px-3 flex items-center gap-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-500 shrink-0">
      <span>{{ displayFolders.length + childNotes.length + childExams.length }} elementos</span>
      <span v-if="selectionCount">{{ selectionCount }} seleccionado{{ selectionCount > 1 ? 's' : '' }}</span>
      <span v-if="clipboard" class="text-blue-600 ml-auto">{{ clipboard.mode === 'cut' ? '✂ Cortado' : '⧉ Copiado' }} {{ clipboard.items.length }}</span>
    </div>

    <!-- Menú contextual -->
    <div
      v-if="menu.show"
      class="fixed z-[80] min-w-[128px] bg-white rounded-lg shadow-2xl ring-1 ring-black/10 py-1 text-[13px] text-slate-700"
      :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
      @click.stop
    >
      <template v-if="menu.target">
        <button type="button" class="menu-item" @click="menuOpen">Abrir</button>
        <button v-if="menu.target.kind === 'folder'" type="button" class="menu-item" @click="menuAct(() => createFolderIn(menu.target.id))">Nueva subcarpeta</button>
        <div class="menu-sep"></div>
        <button type="button" class="menu-item" @click="menuAct(() => clip('cut'))">Cortar</button>
        <button type="button" class="menu-item" @click="menuAct(() => clip('copy'))">Copiar</button>
        <button type="button" class="menu-item" :disabled="!canRename" @click="menuAct(renameSingle)">Renombrar</button>
        <div class="menu-sep"></div>
        <button type="button" class="menu-item text-red-600" @click="menuAct(deleteSelected)">Eliminar</button>
      </template>
      <template v-else>
        <button type="button" class="menu-item" :disabled="inFav" @click="menuAct(createFolderHere)">Nueva carpeta</button>
        <button type="button" class="menu-item" :disabled="inFav" @click="menuAct(() => createNoteHere('Documento'))">Nuevo documento</button>
        <button type="button" class="menu-item" :disabled="inFav" @click="menuAct(() => createNoteHere('Post-it'))">Nuevo post-it</button>
        <div class="menu-sep"></div>
        <button type="button" class="menu-item" @click="menuAct(selectAll)">Seleccionar todo</button>
        <button type="button" class="menu-item" :disabled="!clipboard || inFav" @click="menuAct(paste)">Pegar</button>
      </template>
    </div>

    <!-- Tirador de redimensión -->
    <div
      v-if="!maximized"
      class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
      @mousedown.stop.prevent="startResize"
      aria-hidden="true"
    >
      <div class="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-slate-400"></div>
    </div>
  </div>

  <RecycleBinWindow v-if="showBin" @close="showBin = false" />
</template>

<script setup>
import { ref, reactive, computed, inject, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import RecycleBinWindow from '@/components/estudio/RecycleBinWindow.vue'
import {
  Folder as IconFolder, FolderPlus as IconFolderPlus, FileText as IconFile,
  FilePlus as IconFilePlus, StickyNote as IconSticky, GraduationCap as IconBook,
  X as IconX, ChevronRight as IconChevron, ChevronDown as IconChevronDown,
  ArrowUp as IconUp, Home as IconHome, Pencil as IconPencil, Trash2 as IconTrash,
  Scissors as IconCut, Copy as IconCopy, ClipboardPaste as IconPaste,
  Maximize2 as IconMaximize, Minimize2 as IconMinimize, Star as IconStar,
} from 'lucide-vue-next'

const emit = defineEmits(['close'])
const ctx = inject('studyCtx')
const { folders, notes, exams, trash, folderTree } = ctx
const router = useRouter()

const rootEl = ref(null)
const contentEl = ref(null)
const showBin = ref(false)
const trashCount = computed(() => trash.value.length)

// Carpeta virtual de exámenes favoritos (no existe en backend)
const FAV = '__fav__'
const favoriteExams = computed(() => exams.value.filter(e => e.favorito))

// ----- Estado de la ventana -----
const pos = reactive({ x: Math.max(40, window.innerWidth / 2 - 420), y: 90 })
const size = reactive({ w: 840, h: 560 })
const maximized = ref(false)

// ----- Navegación / selección -----
const currentFolderId = ref(null)         // null = Inicio (sin asignar + carpetas raíz)
const selection = reactive(new Set())     // claves "kind:id"
const anchorKey = ref(null)               // ancla para selección con Shift
const clipboard = ref(null)               // { mode, items: [{kind,id}] }
const renaming = ref(null)                // { kind, id }
const renameText = ref('')
const renameInput = ref(null)
const expandedNav = reactive({})
const navDragOverId = ref(null)

const key = (kind, id) => `${kind}:${id}`
function parseKey(k) { const i = k.indexOf(':'); return { kind: k.slice(0, i), id: k.slice(i + 1) } }
function isSelected(kind, id) { return selection.has(key(kind, id)) }

const inFav = computed(() => currentFolderId.value === FAV)
const currentFolder = computed(() => folders.value.find(f => f.id === currentFolderId.value) || null)
const currentTitle = computed(() => inFav.value ? 'Favoritos' : (currentFolder.value ? currentFolder.value.name : 'Inicio'))

const realFolders = computed(() =>
  folders.value.filter(f => (f.parentId || null) === currentFolderId.value)
    .sort((a, b) => a.name.localeCompare(b.name)))

// Carpetas visibles: en Inicio se antepone la carpeta virtual "Favoritos"
const displayFolders = computed(() => {
  if (inFav.value) return []
  const list = realFolders.value.map(f => ({ id: f.id, name: f.name, virtual: false }))
  if (currentFolderId.value === null && favoriteExams.value.length) {
    list.unshift({ id: FAV, name: 'Favoritos', virtual: true })
  }
  return list
})

const childNotes = computed(() => inFav.value ? [] :
  notes.value.filter(n => (n.folderId || null) === currentFolderId.value)
    .sort((a, b) => (a.title || '').localeCompare(b.title || '')))
const childExams = computed(() => {
  if (inFav.value) return favoriteExams.value.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  return exams.value.filter(e => (e.folderId || null) === currentFolderId.value)
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
})

const isEmpty = computed(() => !displayFolders.value.length && !childNotes.value.length && !childExams.value.length)

// Elementos en orden visual (para Shift-selección, marquesina y "seleccionar todo")
const orderedItems = computed(() => [
  ...displayFolders.value.filter(f => !f.virtual).map(f => ({ kind: 'folder', id: f.id })),
  ...childNotes.value.map(n => ({ kind: 'note', id: n.id })),
  ...childExams.value.map(e => ({ kind: 'exam', id: e._id })),
])

// Selección resuelta a operaciones (excluye la carpeta virtual)
const selectedList = computed(() => [...selection].map(parseKey))
const opItems = computed(() => selectedList.value.filter(s => !(s.kind === 'folder' && s.id === FAV)))
const selectionCount = computed(() => opItems.value.length)
const singleSel = computed(() => opItems.value.length === 1 ? opItems.value[0] : null)
const canRename = computed(() => !!singleSel.value && singleSel.value.kind !== 'exam')

const crumbs = computed(() => {
  if (inFav.value) return [{ id: FAV, name: 'Favoritos' }]
  const chain = []
  let cur = currentFolder.value
  while (cur) { chain.unshift({ id: cur.id, name: cur.name }); cur = folders.value.find(f => f.id === cur.parentId) }
  return chain
})

// Árbol plano para la navegación lateral (respeta expandir/colapsar)
const navList = computed(() => {
  const acc = []
  const walk = (nodes, depth) => {
    for (const n of nodes) {
      acc.push({ id: n.id, name: n.name, depth, hasChildren: n.children.length > 0, expanded: !!expandedNav[n.id] })
      if (expandedNav[n.id]) walk(n.children, depth + 1)
    }
  }
  walk(folderTree.value, 0)
  return acc
})

function toggleNav(id) { expandedNav[id] = !expandedNav[id] }

function clearSel() { selection.clear(); anchorKey.value = null }
function openFolder(id) { currentFolderId.value = id; clearSel(); expandChain(id) }
function goHome() { currentFolderId.value = null; clearSel() }
function goUp() { currentFolderId.value = currentFolder.value?.parentId || null; clearSel() }

function expandChain(id) {
  let cur = folders.value.find(f => f.id === id)
  while (cur) { expandedNav[cur.id] = true; cur = folders.value.find(f => f.id === cur.parentId) }
}

// ----- Selección de elementos -----
function select(kind, id) { selection.clear(); selection.add(key(kind, id)); anchorKey.value = key(kind, id) }
function onItemClick(e, kind, id) {
  const k = key(kind, id)
  if (e.ctrlKey || e.metaKey) {
    if (selection.has(k)) selection.delete(k); else selection.add(k)
    anchorKey.value = k
  } else if (e.shiftKey && anchorKey.value) {
    selectRange(k)
  } else {
    selection.clear(); selection.add(k); anchorKey.value = k
  }
}
function selectRange(toKey) {
  const keys = orderedItems.value.map(o => key(o.kind, o.id))
  const a = keys.indexOf(anchorKey.value); const b = keys.indexOf(toKey)
  selection.clear()
  if (a < 0 || b < 0) { selection.add(toKey); return }
  const [lo, hi] = a < b ? [a, b] : [b, a]
  for (let i = lo; i <= hi; i++) selection.add(keys[i])
}
function selectAll() {
  selection.clear()
  for (const o of orderedItems.value) selection.add(key(o.kind, o.id))
}

function openNote(n) { ctx.selectNote(n); emit('close') }
function openExam(e) { router.push(`/examen/${e._id}`); emit('close') }
function openSingle() {
  const s = singleSel.value; if (!s) return
  if (s.kind === 'folder') openFolder(s.id)
  else if (s.kind === 'note') openNote(notes.value.find(n => n.id === s.id))
  else openExam(exams.value.find(x => x._id === s.id))
}

// ----- Nombres únicos (estilo Windows) -----
function uniqueName(base, taken) {
  if (!taken.includes(base)) return base
  let i = 2
  while (taken.includes(`${base} (${i})`)) i++
  return `${base} (${i})`
}
const folderSiblings = (parentId, exceptId) => folders.value.filter(f => (f.parentId || null) === (parentId ?? null) && f.id !== exceptId).map(f => f.name)
const noteSiblings = (folderId, exceptId) => notes.value.filter(n => (n.folderId || null) === (folderId ?? null) && n.id !== exceptId).map(n => n.title || '')

// ----- Crear ----- (no permitido dentro de la carpeta virtual Favoritos)
async function createFolderHere() {
  if (inFav.value) return
  const name = uniqueName('Nueva carpeta', folderSiblings(currentFolderId.value))
  const f = await ctx.addFolder(name, currentFolderId.value)
  if (f) { select('folder', f.id); startRename('folder', f.id) }
}
function createNoteHere(type) {
  if (inFav.value) return
  const base = type === 'Documento' ? 'Nuevo documento' : 'Nuevo post-it'
  const title = uniqueName(base, noteSiblings(currentFolderId.value))
  const n = ctx.createNote(type, currentFolderId.value)
  n.title = title
  ctx.scheduleNoteSave(n)
  select('note', n.id)
  startRename('note', n.id)
}
async function createFolderIn(parentId) {
  const name = uniqueName('Nueva carpeta', folderSiblings(parentId))
  const f = await ctx.addFolder(name, parentId)
  if (!f) return
  expandChain(parentId); expandedNav[parentId] = true
  if (parentId === currentFolderId.value) { select('folder', f.id); startRename('folder', f.id) }
}

// ----- Renombrar -----
function startRename(kind, id) {
  renaming.value = { kind, id }
  if (kind === 'folder') renameText.value = folders.value.find(f => f.id === id)?.name || ''
  else if (kind === 'note') renameText.value = notes.value.find(n => n.id === id)?.title || ''
  nextTick(() => {
    const el = Array.isArray(renameInput.value) ? renameInput.value[0] : renameInput.value
    el?.focus(); el?.select()
  })
}
function renameSingle() {
  const s = singleSel.value
  if (s && s.kind !== 'exam') startRename(s.kind, s.id)
}
function confirmRename() {
  if (!renaming.value) return
  const { kind, id } = renaming.value
  const name = renameText.value.trim()
  renaming.value = null
  if (!name) return
  if (kind === 'folder') {
    const f = folders.value.find(x => x.id === id)
    if (f && f.name !== name) ctx.renameFolder(f, uniqueName(name, folderSiblings(f.parentId, f.id)))
  } else if (kind === 'note') {
    const n = notes.value.find(x => x.id === id)
    if (n && n.title !== name) { n.title = uniqueName(name, noteSiblings(n.folderId, n.id)); ctx.scheduleNoteSave(n) }
  }
}

// ----- Eliminar (soporta selección múltiple) -----
function deleteSelected() {
  const items = opItems.value
  if (!items.length) return
  const msg = items.length === 1
    ? '¿Enviar el elemento seleccionado a la papelera?'
    : `¿Eliminar ${items.length} elementos? Se enviarán a la papelera (las carpetas también su contenido).`
  if (!confirm(msg)) return
  for (const s of items) {
    if (s.kind === 'folder') {
      const f = folders.value.find(x => x.id === s.id); if (f) ctx.removeFolder(f)
    } else if (s.kind === 'note') {
      const n = notes.value.find(x => x.id === s.id); if (n) ctx.removeNote(n)
    } else if (s.kind === 'exam') {
      const e = exams.value.find(x => x._id === s.id); if (e) ctx.removeExam(e)
    }
  }
  clearSel()
}

// ----- Cortar / Copiar / Pegar -----
function clip(mode) {
  const items = opItems.value
  if (!items.length) return
  clipboard.value = { mode, items: items.slice() }
}
function clipHas(kind, id) {
  return clipboard.value?.mode === 'cut' && clipboard.value.items.some(i => i.kind === kind && i.id === id)
}
async function paste() {
  const cb = clipboard.value
  if (!cb || inFav.value) return
  const target = currentFolderId.value
  let examBlocked = false
  for (const it of cb.items) {
    if (cb.mode === 'cut') {
      moveItem(it.kind, it.id, target)
    } else if (it.kind === 'note') {
      const n = notes.value.find(x => x.id === it.id); if (n) await ctx.duplicateNote(n, target)
    } else if (it.kind === 'folder') {
      const f = folders.value.find(x => x.id === it.id); if (f) await ctx.copyFolder(f, target)
    } else if (it.kind === 'exam') {
      examBlocked = true
    }
  }
  if (cb.mode === 'cut') clipboard.value = null
  if (examBlocked) alert('Los exámenes no se pueden copiar, solo mover.')
}

function moveItem(kind, id, targetFolderId) {
  if (kind === 'note') {
    const n = notes.value.find(x => x.id === id)
    if (n && (n.folderId || null) !== targetFolderId) ctx.moveNoteToFolder(n, targetFolderId)
  } else if (kind === 'exam') {
    const e = exams.value.find(x => x._id === id)
    if (e && (e.folderId || null) !== targetFolderId) ctx.moveExamToFolder(e, targetFolderId)
  } else if (kind === 'folder') {
    const f = folders.value.find(x => x.id === id)
    if (f && f.id !== targetFolderId && (f.parentId || null) !== targetFolderId) ctx.moveFolder(f, targetFolderId)
  }
}

// ----- Drag & drop (arrastra toda la selección) -----
const dragItems = ref([])
function onDragStart(e, kind, id) {
  const k = key(kind, id)
  if (!selection.has(k)) { selection.clear(); selection.add(k); anchorKey.value = k }
  dragItems.value = opItems.value.slice()
  e.dataTransfer?.setData('text/plain', 'items')
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}
function dropOnFolder(folderId) {
  if (!dragItems.value.length || folderId === FAV) return
  for (const it of dragItems.value) moveItem(it.kind, it.id, folderId)
  dragItems.value = []
}
function navDrop(folderId) {
  navDragOverId.value = null
  dropOnFolder(folderId)
}

// ----- Marquesina (selección por área con el ratón) -----
const marquee = reactive({ active: false, x0: 0, y0: 0, x1: 0, y1: 0 })
const marqueeStyle = computed(() => ({
  left: Math.min(marquee.x0, marquee.x1) + 'px',
  top: Math.min(marquee.y0, marquee.y1) + 'px',
  width: Math.abs(marquee.x1 - marquee.x0) + 'px',
  height: Math.abs(marquee.y1 - marquee.y0) + 'px',
}))
function onContentMouseDown(e) {
  if (e.button !== 0) return
  if (e.target.closest('[data-key]')) return // clic sobre un elemento: lo maneja el propio item
  const additive = e.ctrlKey || e.metaKey
  const base = additive ? [...selection] : []
  if (!additive) clearSel()
  let moved = false
  Object.assign(marquee, { active: false, x0: e.clientX, y0: e.clientY, x1: e.clientX, y1: e.clientY })
  const onMove = (ev) => {
    marquee.x1 = ev.clientX; marquee.y1 = ev.clientY
    if (!moved && (Math.abs(ev.clientX - marquee.x0) > 4 || Math.abs(ev.clientY - marquee.y0) > 4)) { moved = true; marquee.active = true }
    if (!moved) return
    const r = { left: Math.min(marquee.x0, marquee.x1), right: Math.max(marquee.x0, marquee.x1), top: Math.min(marquee.y0, marquee.y1), bottom: Math.max(marquee.y0, marquee.y1) }
    selection.clear()
    for (const k of base) selection.add(k)
    for (const el of contentEl.value.querySelectorAll('[data-key]')) {
      const b = el.getBoundingClientRect()
      if (!(b.right < r.left || b.left > r.right || b.bottom < r.top || b.top > r.bottom)) selection.add(el.dataset.key)
    }
  }
  const onUp = () => {
    marquee.active = false
    document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// ----- Menú contextual -----
const menu = reactive({ show: false, x: 0, y: 0, target: null })
function openItemMenu(e, kind, id) {
  const k = key(kind, id)
  if (!selection.has(k)) { selection.clear(); selection.add(k); anchorKey.value = k }
  Object.assign(menu, { show: true, x: e.clientX, y: e.clientY, target: { kind, id } })
}
function openBgMenu(e) {
  if (e.target.closest('[data-key]')) return
  clearSel()
  Object.assign(menu, { show: true, x: e.clientX, y: e.clientY, target: null })
}
function closeContextMenu() { menu.show = false }
function menuAct(fn) { menu.show = false; fn() }
function menuOpen() {
  menu.show = false
  const t = menu.target
  if (!t) return
  if (t.kind === 'folder') openFolder(t.id)
  else if (t.kind === 'note') openNote(notes.value.find(n => n.id === t.id))
  else if (t.kind === 'exam') openExam(exams.value.find(x => x._id === t.id))
}

// ----- Teclado (atajos tipo Windows, solo con la ventana enfocada) -----
function onKey(e) {
  if (renaming.value) return
  const tag = e.target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return
  if (e.key === 'Delete') { deleteSelected() }
  else if (e.key === 'F2') { renameSingle() }
  else if (e.key === 'Enter') { openSingle() }
  else if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) { e.preventDefault(); selectAll() }
  else if (e.key === 'Escape') { if (menu.show) closeContextMenu(); else clearSel() }
}
function onRootMouseDown(e) {
  if (!e.target.closest('input')) rootEl.value?.focus()
}

// ----- Arrastre y redimensión de la ventana -----
function startDrag(e) {
  if (maximized.value) return
  const sx = e.clientX, sy = e.clientY
  const ox = pos.x, oy = pos.y
  const onMove = (ev) => {
    pos.x = Math.max(0, Math.min(window.innerWidth - 120, ox + ev.clientX - sx))
    pos.y = Math.max(0, Math.min(window.innerHeight - 40, oy + ev.clientY - sy))
  }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

function startResize(e) {
  const sx = e.clientX, sy = e.clientY
  const ow = size.w, oh = size.h
  const onMove = (ev) => {
    size.w = Math.max(420, ow + ev.clientX - sx)
    size.h = Math.max(320, oh + ev.clientY - sy)
  }
  const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

// ----- Atrapar el botón "Atrás" (navegador / ratón) para navegar dentro del
// explorador en lugar de salir de la página. -----
let trapArmed = false
function onPopState() {
  if (currentFolderId.value !== null) {
    goUp()
    history.pushState({ explorer: true }, '')
  } else {
    trapArmed = false
    emit('close')
  }
}
onMounted(() => {
  history.pushState({ explorer: true }, '')
  trapArmed = true
  window.addEventListener('popstate', onPopState)
  nextTick(() => rootEl.value?.focus())
})
onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState)
  if (trapArmed) { trapArmed = false; history.back() }
})
</script>

<style scoped>
.tb-btn { @apply w-8 h-8 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 transition-colors shrink-0; }
.tb-btn:disabled { @apply opacity-30 cursor-not-allowed hover:bg-transparent; }

.crumb { @apply px-2 py-0.5 rounded hover:bg-slate-200 text-slate-600 whitespace-nowrap shrink-0; }

.explorer-item {
  @apply flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors;
}
.item-label {
  @apply text-[11px] text-center leading-tight text-slate-700 line-clamp-2 break-words w-full;
}
.rename-input {
  @apply w-full text-[11px] text-center bg-white border border-blue-400 rounded px-1 py-0.5 focus:outline-none text-slate-800;
}

.menu-item { @apply w-full text-left px-3 py-1 hover:bg-blue-50 transition-colors; }
.menu-item:disabled { @apply opacity-40 cursor-not-allowed hover:bg-transparent; }
.menu-sep { @apply my-1 border-t border-slate-100; }
</style>
