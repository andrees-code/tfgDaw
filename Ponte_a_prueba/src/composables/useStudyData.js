import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import {
  loadNotes, saveNote, deleteNote as apiDeleteNote, updateNoteFolder,
  loadTrashNotes, restoreNote as apiRestoreNote, purgeNote as apiPurgeNote,
} from '@/services/notesService'
import {
  loadCalendarItems, createCalendarItem, updateCalendarItem, deleteCalendarItem,
} from '@/services/studyService'
import {
  getExams, deleteExam as apiDeleteExam, updateExamFolder, updateExamDate,
  loadTrashExams, restoreExam as apiRestoreExam, purgeExam as apiPurgeExam,
} from '@/services/examService'
import { useFolders } from '@/composables/useFolders'

// Estado y acciones de la Zona de Estudio: carpetas (árbol ilimitado, compartido
// con la Biblioteca de exámenes), notas/documentos, exámenes y elementos del
// calendario (stickers, textos, eventos).
export function useStudyData() {
  const notes = ref([])
  const exams = ref([])
  const calendarItems = ref([])
  const trash = ref([]) // documentos y exámenes en la papelera
  const loading = ref(false)
  const isSaving = ref(false)
  // Último error de operación, para que la vista lo muestre (toast)
  const opError = ref(null)
  let saveTimeout = null

  function reportError(err, fallback) {
    console.error(err)
    const msg = err?.response?.data?.message
    opError.value = Array.isArray(msg) ? msg.join(', ') : (msg || fallback)
  }

  const { folders, loadFolders, buildTree, addFolder, renameFolder, moveFolder, removeFolder: removeFolderBase } = useFolders(reportError)

  async function reloadNotes() {
    const n = await loadNotes()
    notes.value = n.map(x => ({ ...x, folderId: x.folderId ? String(x.folderId) : null }))
  }
  async function reloadExams() {
    exams.value = (await getExams()).map(x => ({ ...x, id: String(x._id), folderId: x.folderId ? String(x.folderId) : null, calendarDate: x.calendarDate || null }))
  }

  async function loadAll() {
    loading.value = true
    try {
      const [n, c] = await Promise.all([loadNotes(), loadCalendarItems(), loadFolders()])
      notes.value = n.map(x => ({ ...x, folderId: x.folderId ? String(x.folderId) : null }))
      calendarItems.value = c.map(x => ({ ...x, id: String(x._id) }))
      await reloadExams()
      await loadTrash()
    } finally {
      loading.value = false
    }
  }

  // ----- Papelera (documentos + exámenes, máx. 30 días) -----
  async function loadTrash() {
    try {
      const [tn, te] = await Promise.all([loadTrashNotes(), loadTrashExams()])
      trash.value = [
        ...tn.map(n => ({ kind: 'note', id: String(n._id), title: n.title, type: n.type, deletedAt: n.deletedAt })),
        ...te.map(e => ({ kind: 'exam', id: String(e._id), title: e.title, type: 'Examen', deletedAt: e.deletedAt })),
      ].sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
    } catch (e) {
      reportError(e, 'No se pudo cargar la papelera')
    }
  }

  async function restoreTrashItem(item) {
    try {
      if (item.kind === 'note') { await apiRestoreNote(item.id); await reloadNotes() }
      else { await apiRestoreExam(item.id); await reloadExams() }
      trash.value = trash.value.filter(t => !(t.kind === item.kind && t.id === item.id))
    } catch (e) {
      reportError(e, 'No se pudo restaurar el elemento')
    }
  }

  async function purgeTrashItem(item) {
    try {
      if (item.kind === 'note') await apiPurgeNote(item.id)
      else await apiPurgeExam(item.id)
      trash.value = trash.value.filter(t => !(t.kind === item.kind && t.id === item.id))
    } catch (e) {
      reportError(e, 'No se pudo eliminar definitivamente')
    }
  }

  async function emptyTrash() {
    const items = trash.value.slice()
    for (const it of items) await purgeTrashItem(it)
  }

  // ----- Árbol de carpetas (notas + exámenes) -----
  const folderTree = computed(() => buildTree(f => ({
    notes: notes.value.filter(n => n.folderId === f.id),
    exams: exams.value.filter(e => e.folderId === f.id),
  })))

  const rootNotes = computed(() => notes.value.filter(n => !n.folderId))
  const rootExams = computed(() => exams.value.filter(e => !e.folderId))

  // Borra la carpeta y su subárbol; sus documentos/exámenes van a la papelera.
  async function removeFolder(folder) {
    await removeFolderBase(folder, (ids) => {
      const idSet = new Set(ids)
      notes.value = notes.value.filter(n => !idSet.has(n.folderId))
      exams.value = exams.value.filter(e => !idSet.has(e.folderId))
    })
    await loadTrash()
  }

  // ----- Notas -----
  function scheduleNoteSave(note) {
    if (!note) return
    isSaving.value = true
    note.updatedAt = new Date().toISOString()
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      try {
        const saved = await saveNote(note)
        if (!note.idBackend && saved.idBackend) note.idBackend = saved.idBackend
      } catch (e) {
        console.error(e)
      } finally {
        isSaving.value = false
      }
    }, 700)
  }

  function createNote(type, folderId = null) {
    const newNote = {
      id: uuidv4(),
      idBackend: null,
      type,
      title: '',
      content: '',
      color: type === 'Post-it' ? 'bg-[#fef08a]' : null,
      calendarDate: null,
      folderId,
      updatedAt: new Date().toISOString(),
    }
    notes.value.unshift(newNote)
    scheduleNoteSave(newNote)
    return newNote
  }

  // Guarda una nota de inmediato (sin debounce). Útil para operaciones en lote
  // (duplicar carpeta), donde el saveTimeout compartido cancelaría los previos.
  async function persistNoteNow(note) {
    try {
      const saved = await saveNote(note)
      if (!note.idBackend && saved.idBackend) note.idBackend = saved.idBackend
    } catch (e) {
      reportError(e, 'No se pudo guardar la nota')
    }
    return note
  }

  // Nombre único estilo Windows: "base", "base (2)", "base (3)"...
  function uniqueName(base, taken) {
    if (!taken.includes(base)) return base
    let i = 2
    while (taken.includes(`${base} (${i})`)) i++
    return `${base} (${i})`
  }

  // Duplica una nota/post-it en la carpeta indicada (evita títulos repetidos).
  async function duplicateNote(note, folderId = note.folderId, { suffix = ' (copia)' } = {}) {
    let title = note.title ? note.title + suffix : ''
    if (title) {
      const taken = notes.value.filter(n => (n.folderId || null) === (folderId ?? null)).map(n => n.title || '')
      title = uniqueName(title, taken)
    }
    const copy = {
      id: uuidv4(),
      idBackend: null,
      type: note.type,
      title,
      content: note.content || '',
      color: note.color || null,
      calendarDate: null,
      folderId: folderId ?? null,
      updatedAt: new Date().toISOString(),
    }
    notes.value.unshift(copy)
    await persistNoteNow(copy)
    return copy
  }

  // Clona una carpeta con todo su contenido (subcarpetas + notas) de forma
  // recursiva. Los exámenes no se duplican (son generados). suffix solo aplica
  // al nombre de la carpeta raíz de la copia.
  async function copyFolder(folder, targetParentId = folder.parentId, suffix = ' (copia)') {
    const taken = folders.value.filter(f => (f.parentId || null) === (targetParentId ?? null)).map(f => f.name)
    const name = uniqueName(folder.name + suffix, taken)
    const newF = await addFolder(name, targetParentId)
    if (!newF) return null
    // Notas directas
    for (const n of notes.value.filter(x => x.folderId === folder.id)) {
      await duplicateNote(n, newF.id, { suffix: '' })
    }
    // Subcarpetas (snapshot previo para no clonar las copias recién creadas)
    const subs = folders.value.filter(f => f.parentId === folder.id && f.id !== newF.id)
    for (const sub of subs) {
      await copyFolder(sub, newF.id, '')
    }
    return newF
  }

  async function removeNote(note) {
    let trashed = false
    try {
      if (note.idBackend) { await apiDeleteNote(note.idBackend); trashed = true }
    } catch (e) {
      console.error(e)
    }
    notes.value = notes.value.filter(n => n.id !== note.id)
    if (trashed) await loadTrash()
  }

  async function moveNoteToFolder(note, folderId) {
    note.folderId = folderId
    if (note.idBackend) {
      try { await updateNoteFolder(note.idBackend, folderId) } catch (e) { reportError(e, 'No se pudo mover la nota') }
    }
  }

  function setNoteDate(note, dateStr) {
    note.calendarDate = dateStr
    scheduleNoteSave(note)
  }

  // ----- Exámenes -----
  async function moveExamToFolder(exam, folderId) {
    exam.folderId = folderId
    try { await updateExamFolder(exam._id, folderId) } catch (e) { reportError(e, 'No se pudo mover el examen') }
  }

  async function setExamDate(exam, dateStr) {
    exam.calendarDate = dateStr
    try { await updateExamDate(exam._id, dateStr) } catch (e) { reportError(e, 'No se pudo actualizar el calendario') }
  }

  async function removeExam(exam) {
    try { await apiDeleteExam(exam._id) } catch (e) { reportError(e, 'No se pudo eliminar el examen'); return }
    exams.value = exams.value.filter(e => e._id !== exam._id)
    await loadTrash()
  }

  // ----- Calendario (stickers, textos, eventos) -----
  const itemsByDate = computed(() => {
    const map = {}
    for (const it of calendarItems.value) {
      if (!map[it.date]) map[it.date] = []
      map[it.date].push(it)
    }
    for (const key in map) {
      map[key].sort((a, b) => ((a.time || '') < (b.time || '') ? -1 : 1))
    }
    return map
  })

  async function addCalendarItem(payload) {
    try {
      const it = await createCalendarItem(payload)
      calendarItems.value.push({ ...it, id: String(it._id) })
    } catch (e) {
      reportError(e, 'No se pudo añadir al calendario')
    }
  }

  async function editCalendarItem(item, patch) {
    Object.assign(item, patch)
    try { await updateCalendarItem(item.id, patch) } catch (e) { reportError(e, 'No se pudo actualizar el calendario') }
  }

  async function removeCalendarItem(item) {
    try { await deleteCalendarItem(item.id) } catch (e) { reportError(e, 'No se pudo eliminar el elemento') }
    calendarItems.value = calendarItems.value.filter(i => i.id !== item.id)
  }

  return {
    folders, notes, exams, calendarItems, trash, loading, isSaving, opError,
    folderTree, rootNotes, rootExams, itemsByDate,
    loadAll, loadTrash, restoreTrashItem, purgeTrashItem, emptyTrash,
    createNote, scheduleNoteSave, removeNote, moveNoteToFolder, setNoteDate,
    duplicateNote, copyFolder, persistNoteNow,
    addFolder, renameFolder, moveFolder, removeFolder,
    moveExamToFolder, setExamDate, removeExam,
    addCalendarItem, editCalendarItem, removeCalendarItem,
  }
}
