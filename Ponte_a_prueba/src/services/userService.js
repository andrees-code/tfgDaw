// src/services/userService.js
import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/v1/users',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const registerUser = async (data) => {
  const res = await api.post('/register', data)
  return res.data
}

export const loginUser = async (data) => {
  const res = await api.post('/login', data)
  return res.data
}

export const getUsers = async (token) => {
  const res = await api.get('/', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
