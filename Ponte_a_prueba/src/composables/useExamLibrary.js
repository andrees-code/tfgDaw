import { ref, computed } from 'vue'
import { getExams, updateExamFolder, migrateAsignaturas } from '@/services/examService'
import { loadNotes } from '@/services/notesService'
import { useFolders } from '@/composables/useFolders'

// Biblioteca: mismas carpetas compartidas con la Zona de Estudio. El árbol
// adjunta tanto exámenes como notas/documentos, para ver todo desde ambos lados.
export function useExamLibrary() {
  const exams = ref([])
  const notes = ref([])
  const opError = ref(null)

  function reportError(err, fallback) {
    console.error(err)
    const msg = err?.response?.data?.message
    opError.value = Array.isArray(msg) ? msg.join(', ') : (msg || fallback)
  }

  const { folders, loadFolders, buildTree, addFolder, renameFolder, moveFolder, removeFolder: removeFolderBase } = useFolders(reportError)

  async function loadAll() {
    // Migración única e idempotente: asignatura (texto libre) -> carpeta real
    await migrateAsignaturas()
    const [ex, n] = await Promise.all([getExams(), loadNotes(), loadFolders()])
    exams.value = ex.map(x => ({ ...x, folderId: x.folderId ? String(x.folderId) : null }))
    notes.value = n.map(x => ({ ...x, folderId: x.folderId ? String(x.folderId) : null }))
  }

  const folderTree = computed(() => buildTree(f => ({
    exams: exams.value.filter(e => e.folderId === f.id),
    notes: notes.value.filter(n => n.folderId === f.id),
  })))

  const rootExams = computed(() => exams.value.filter(e => !e.folderId))

  // Lista plana del árbol para el desplegable de "guardar en carpeta"
  const folderOptions = computed(() => {
    const out = []
    const walk = (nodes, depth) => {
      for (const node of nodes) {
        const prefix = depth ? '— '.repeat(depth) : ''
        out.push({ id: node.id, label: prefix + node.name })
        if (node.children && node.children.length) walk(node.children, depth + 1)
      }
    }
    walk(folderTree.value, 0)
    return out
  })

  // Borrado en cascada: la carpeta y su subárbol; los exámenes/notas que
  // contienen pasan a la papelera (se quitan del listado local).
  async function removeFolder(folder) {
    await removeFolderBase(folder, (ids) => {
      const idSet = new Set(ids)
      exams.value = exams.value.filter(e => !idSet.has(e.folderId))
      notes.value = notes.value.filter(n => !idSet.has(n.folderId))
    })
  }

  async function moveExamToFolder(exam, folderId) {
    exam.folderId = folderId
    try { await updateExamFolder(exam._id, folderId) } catch (e) { reportError(e, 'No se pudo mover el examen') }
  }

  return {
    folders, exams, notes, opError,
    folderTree, rootExams, folderOptions,
    loadAll,
    addFolder, renameFolder, moveFolder, removeFolder,
    moveExamToFolder,
  }
}
