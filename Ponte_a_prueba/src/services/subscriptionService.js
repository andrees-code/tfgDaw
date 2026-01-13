import axios from 'axios'
import { userStore } from '@/stores/userStores'

const api = axios.create({ baseURL: 'https://bakend-murex.vercel.app/api/v1' })
api.interceptors.request.use(config => {
  if (userStore.token) config.headers.Authorization = `Bearer ${userStore.token}`
  return config
})

export const SubscriptionService = {
  async updateProfile(userId, data) {
    const formData = new FormData()
    if (data.username) formData.append('username', data.username)
    if (data.email) formData.append('email', data.email)
    if (data.password) formData.append('password', data.password)
    if (data.avatar) formData.append('avatar', data.avatar)
    const res = await api.put(`/users/update/${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return res.data
  },

  async createCheckoutSession(plan) {
    const res = await api.post('/subscriptions/create-checkout-session', { plan })
    return res.data
  },

  async getPremiumContent() {
    const res = await api.get('/subscriptions/premium')
    return res.data
  },
}
