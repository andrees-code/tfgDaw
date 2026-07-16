import { ref } from 'vue'
import {
  loadFolders as apiLoadFolders,
  createFolder as apiCreateFolder,
  updateFolder as apiUpdateFolder,
  deleteFolder as apiDeleteFolder,
} from '@/services/studyService'

// Carpetas compartidas entre Zona de Estudio y Biblioteca: mismo backend,
// misma jerarquía ilimitada (parentId: null = raíz). Cada consumidor decide
// qué "adjuntar" a cada nodo del árbol (notas, exámenes...) vía buildTree().
export function useFolders(reportError = (err) => console.error(err)) {
  const folders = ref([])

  async function loadFolders() {
    const f = await apiLoadFolders()
    folders.value = f.map(x => ({ ...x, id: String(x._id), parentId: x.parentId ? String(x.parentId) : null }))
  }

  // attach(folder) => objeto con props extra a mezclar en cada nodo (p.ej. { notes, exams })
  function buildTree(attach) {
    const byParent = new Map()
    for (const f of folders.value) {
      const key = f.parentId || 'root'
      if (!byParent.has(key)) byParent.set(key, [])
      byParent.get(key).push(f)
    }
    const build = (key) => (byParent.get(key) || []).map(f => ({
      ...f,
      ...(attach ? attach(f) : {}),
      children: build(f.id),
    }))
    return build('root')
  }

  async function addFolder(name, parentId = null) {
    try {
      const f = await apiCreateFolder({ name, parentId })
      folders.value.push({ ...f, id: String(f._id), parentId: f.parentId ? String(f.parentId) : null })
      return folders.value[folders.value.length - 1]
    } catch (e) {
      reportError(e, 'No se pudo crear la carpeta. ¿Está el servidor en marcha?')
    }
  }

  async function renameFolder(folder, name) {
    folder.name = name
    try { await apiUpdateFolder(folder.id, { name }) } catch (e) { reportError(e, 'No se pudo renombrar la carpeta') }
  }

  async function moveFolder(folder, parentId) {
    if (parentId === folder.id) return
    // Evitar ciclos también en cliente
    let cur = parentId
    while (cur) {
      if (cur === folder.id) return
      const p = folders.value.find(f => f.id === cur)
      cur = p ? p.parentId : null
    }
    folder.parentId = parentId
    try { await apiUpdateFolder(folder.id, { parentId }) } catch (e) { reportError(e, 'No se pudo mover la carpeta') }
  }

  // IDs de la carpeta y todas sus descendientes (según el estado local)
  function subtreeIds(rootId) {
    const childrenOf = {}
    for (const f of folders.value) {
      const k = f.parentId || 'root'
      ;(childrenOf[k] = childrenOf[k] || []).push(f.id)
    }
    const ids = []
    const stack = [rootId]
    while (stack.length) {
      const id = stack.pop()
      ids.push(id)
      for (const c of childrenOf[id] || []) stack.push(c)
    }
    return ids
  }

  // Borrado en cascada: el backend elimina la carpeta y su subárbol y envía los
  // documentos/exámenes a la papelera. onSubtreeDeleted(ids) permite al
  // consumidor limpiar sus items locales (notas, exámenes...).
  async function removeFolder(folder, onSubtreeDeleted) {
    let res
    try {
      res = await apiDeleteFolder(folder.id)
    } catch (e) {
      reportError(e, 'No se pudo eliminar la carpeta')
      return
    }
    const ids = res?.folderIds?.length ? res.folderIds : subtreeIds(folder.id)
    const idSet = new Set(ids)
    folders.value = folders.value.filter(f => !idSet.has(f.id))
    onSubtreeDeleted?.(ids)
  }

  return {
    folders,
    loadFolders,
    buildTree,
    addFolder, renameFolder, moveFolder, removeFolder,
  }
}
