import axios from 'axios'
import { userStore } from '@/stores/userStores'
import { API_BASE_URL } from '@/config/api'

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

// ===============================
// CARPETAS
// ===============================
export async function loadFolders() {
  const res = await api.get('/folders')
  return res.data
}

export async function createFolder({ name, parentId = null, color = null }) {
  const res = await api.post('/folders', { name, parentId, color })
  return res.data
}

// patch admite { name?, parentId?, color?, order? } — parentId: null mueve a raíz
export async function updateFolder(id, patch) {
  const res = await api.patch(`/folders/${id}`, patch)
  return res.data
}

export async function deleteFolder(id) {
  const res = await api.delete(`/folders/${id}`)
  return res.data
}

// ===============================
// CALENDARIO (stickers, textos, eventos)
// ===============================
export async function loadCalendarItems() {
  const res = await api.get('/calendar')
  return res.data
}

export async function createCalendarItem(item) {
  const res = await api.post('/calendar', item)
  return res.data
}

export async function updateCalendarItem(id, patch) {
  const res = await api.patch(`/calendar/${id}`, patch)
  return res.data
}

export async function deleteCalendarItem(id) {
  const res = await api.delete(`/calendar/${id}`)
  return res.data
}
