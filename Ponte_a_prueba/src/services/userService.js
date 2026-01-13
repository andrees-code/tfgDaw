// src/services/userService.js
import axios from 'axios'
import { userStore } from '@/stores/userStores'

export const api = axios.create({
  baseURL: 'https://bakend-murex.vercel.app/api/v1/users',
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
