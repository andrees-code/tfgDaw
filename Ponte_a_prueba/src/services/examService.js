import axios from 'axios'
import { userStore } from "@/stores/userStores"
import { API_BASE_URL } from '@/config/api'
import { attachAuthInterceptor } from './authInterceptor'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})


// ✅ Interceptor: Inyecta el token en CUALQUIER petición automáticamente
api.interceptors.request.use((config) => {
  // Aseguramos que la sesión esté cargada
  if (!userStore.token) userStore.loadSession();

  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`;
  }
  return config;
});

attachAuthInterceptor(api);

export async function saveExam(exam) {
  const res = await api.post("/exams", exam);
  return res.data;
}

export async function getExams() {
  const res = await api.get("/exams");
  return res.data;
}

export async function getExamById(id) {
  const res = await api.get(`/exams/${id}`);
  return res.data;
}

export async function deleteExam(id) {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
}

// 🗑 Papelera de exámenes
export async function loadTrashExams() {
  const res = await api.get('/exams/trash');
  return res.data;
}

export async function restoreExam(id) {
  const res = await api.post(`/exams/${id}/restore`);
  return res.data;
}

export async function purgeExam(id) {
  await api.delete(`/exams/${id}/permanent`);
}

export async function toggleFavorite(id) {
  const res = await api.patch(`/exams/${id}/favorite`)
  return res.data
}

export async function getFavoriteExams() {
  const res = await api.get('/exams/favorites/me')
  return res.data
}

// 🏷 Asignar / actualizar asignatura de un examen
export async function updateExamAsignatura(id, asignatura) {
  const res = await api.patch(`/exams/${id}/asignatura`, {
    asignatura
  })
  return res.data
}

export async function updateExamTitle(id, title) {
  const res = await api.patch(`/exams/${id}/title`, { title });
  return res.data;
}

export async function updateExamFolder(id, folderId) {
  const res = await api.patch(`/exams/${id}/folder`, { folderId });
  return res.data;
}

export async function updateExamDate(id, date) {
  const res = await api.patch(`/exams/${id}/date`, { date });
  return res.data;
}

export async function migrateAsignaturas() {
  const res = await api.patch('/exams/migrate-asignaturas');
  return res.data;
}

// 🧠 Generar examen con IA (pasa por backend y aplica límite FREE)
export async function generateExam(dto) {
  const res = await api.post("/exams/generate", dto);
  return res.data;
}








