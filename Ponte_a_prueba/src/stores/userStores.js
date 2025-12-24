import { reactive } from 'vue'

export const userStore = reactive({
  user: null,
  token: null,
  isAuthenticated: false,

  loadSession() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        this.user = JSON.parse(user)
        this.token = token
        this.isAuthenticated = true
      } catch (err) {
        console.error("Error cargando sesión:", err)
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
  },

  setUser(userData) {
    this.user = {
      username: userData?.username ?? 'Invitado',
      avatar: userData?.avatar ?? '/img/perro.jpg',
      ...userData
    }
    this.isAuthenticated = true
    localStorage.setItem('user', JSON.stringify(this.user))
  },

  setToken(token) {
    this.token = token ?? ''
    localStorage.setItem('token', this.token)
  },

  setSession({ user, token }) {
    this.setUser(user)
    this.setToken(token)
  },

  logout() {
    this.user = null
    this.token = null
    this.isAuthenticated = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})
