import axios from 'axios'
import { userStore } from "@/stores/userStores"

const api = axios.create({
  baseURL: 'https://bakend-murex.vercel.app/api/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (!userStore.token) userStore.loadSession()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// ===============================
// CREAR / ACTUALIZAR NOTA
// ===============================
export async function saveNote(note) {
  if (note.idBackend) {
    if (note.title !== undefined) {
      await api.patch(`/notes/${note.idBackend}/title`, {
        title: note.title,
      })
    }

    if (note.content !== undefined) {
      await api.patch(`/notes/${note.idBackend}/content`, {
        content: note.content,
      })
    }

    if (note.type === 'Post-it' && note.color) {
      await api.patch(`/notes/${note.idBackend}/color`, {
        color: note.color,
      })
    }

    return note
  } else {
    const res = await api.post('/notes', {
      title: note.title || 'Sin título',
      type: note.type,
      content: note.content || '',
      color:
        note.type === 'Post-it'
          ? note.color || 'bg-yellow-200'
          : undefined,
    })

    note.idBackend = res.data._id
    return note
  }
}

// ===============================
// BORRAR NOTA
// ===============================
export async function deleteNote(idBackend) {
  if (!idBackend) return
  await api.delete(`/notes/${idBackend}`)
}

// ===============================
// CARGAR NOTAS
// ===============================
export async function loadNotes() {
  const res = await api.get('/notes')
  return res.data.map(n => ({
    ...n,
    idBackend: n._id,
  }))
}
