import { userStore } from '@/stores/userStores'

// Cierra la sesión y redirige a /login cuando el backend responde 401
// (token expirado o inválido). Solo actúa si había sesión activa, para
// no interferir con los 401 de credenciales incorrectas en el login.
export function attachAuthInterceptor(api) {
  api.interceptors.response.use(
    res => res,
    async err => {
      if (err.response?.status === 401 && userStore.isAuthenticated) {
        userStore.logout()
        // Import dinámico para evitar dependencias circulares con el router
        const { default: router } = await import('@/router')
        router.push({ name: 'login' })
      }
      return Promise.reject(err)
    }
  )
}
