import axios from 'axios'
import { userStore } from "@/stores/userStores"
import { API_BASE_URL } from '@/config/api'
import { attachAuthInterceptor } from './authInterceptor'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (!userStore.token) userStore.loadSession()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

attachAuthInterceptor(api)

// ===============================
// CREAR / ACTUALIZAR NOTA
// ===============================
export async function saveNote(note) {
  if (note.idBackend) {
    // Actualización parcial (Patch)

    // Titulo
    if (note.title !== undefined) {
      await api.patch(`/notes/${note.idBackend}/title`, {
        title: note.title,
      })
    }

    // Contenido
    if (note.content !== undefined) {
      await api.patch(`/notes/${note.idBackend}/content`, {
        content: note.content,
      })
    }

    // Color (Solo Post-its)
    if (note.type === 'Post-it' && note.color) {
      await api.patch(`/notes/${note.idBackend}/color`, {
        color: note.color,
      })
    }

    // NUEVO: Fecha del calendario
    // Verificamos undefined para permitir borrar fecha enviando null si fuera necesario
    if (note.calendarDate !== undefined) {
      await api.patch(`/notes/${note.idBackend}/date`, {
        date: note.calendarDate,
      })
    }

    // Carpeta contenedora (null = raíz)
    if (note.folderId !== undefined) {
      await api.patch(`/notes/${note.idBackend}/folder`, {
        folderId: note.folderId,
      })
    }

    return note
  } else {
    // Creación
    const res = await api.post('/notes', {
      title: note.title || 'Sin título',
      type: note.type,
      content: note.content || '',
      color:
        note.type === 'Post-it'
          ? note.color || 'bg-yellow-200'
          : undefined,
      calendarDate: note.calendarDate || null, // Enviamos la fecha al crear
      folderId: note.folderId || undefined,
    })

    note.idBackend = res.data._id
    return note
  }
}

// ===============================
// MOVER NOTA DE CARPETA (null = raíz)
// ===============================
export async function updateNoteFolder(idBackend, folderId) {
  const res = await api.patch(`/notes/${idBackend}/folder`, { folderId })
  return res.data
}

// ===============================
// BORRAR NOTA (envía a la papelera)
// ===============================
export async function deleteNote(idBackend) {
  if (!idBackend) return
  await api.delete(`/notes/${idBackend}`)
}

// ===============================
// PAPELERA DE NOTAS
// ===============================
export async function loadTrashNotes() {
  const res = await api.get('/notes/trash')
  return res.data
}

export async function restoreNote(idBackend) {
  const res = await api.post(`/notes/${idBackend}/restore`)
  return res.data
}

export async function purgeNote(idBackend) {
  await api.delete(`/notes/${idBackend}/permanent`)
}

// ===============================
// CARGAR NOTAS
// ===============================
export async function loadNotes() {
  const res = await api.get('/notes')
  return res.data.map(n => ({
    ...n,
    idBackend: n._id,
    id: n._id, // Mapeamos id para que el frontend lo use cómodamente
    calendarDate: n.calendarDate || null, // Aseguramos que exista el campo
  }))
}
