// src/services/userService.js
import axios from 'axios'
import { userStore } from '@/stores/userStores'
import { API_BASE_URL } from '@/config/api'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/v1/users`,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor para añadir token automáticamente
api.interceptors.request.use(config => {
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

export const registerUser = async (data) => {
  const res = await api.post('/register', data)
  return res.data
}

export const loginUser = async (data) => {
  const res = await api.post('/login', data)
  return res.data
}

export const loginWithGoogle = async (credential) => {
  const res = await api.post('/auth/google', { credential })
  return res.data
}

export const getUsers = async () => {
  const res = await api.get('/')
  return res.data
}


// Nueva función para obtener usuario individual (incluye suscripción)
export const getUser = async (userId) => {
  const res = await api.get(`/user/${userId}`)
  return res.data.data
}

export const updateProfile = async (userId, data) => {
  const formData = new FormData()
  if (data.username) formData.append('username', data.username)
  if (data.email) formData.append('email', data.email)
  if (data.password) formData.append('password', data.password)
  if (data.avatar) formData.append('avatar', data.avatar)

  const res = await api.put(`/update/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const sendPasswordResetEmail = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/v1/users/auth/forgot-password`, payload)
  return response.data
}

// Añade esto al final
export const resetPassword = async (payload) => {
  // payload = { token, newPassword }
  const response = await axios.post(`${API_BASE_URL}/v1/users/auth/reset-password`, payload)
  return response.data
}
