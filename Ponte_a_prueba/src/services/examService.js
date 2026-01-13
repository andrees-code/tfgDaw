import axios from 'axios'
import { userStore } from "@/stores/userStores"

const api = axios.create({
  baseURL: 'https://bakend-murex.vercel.app/api/api',
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







