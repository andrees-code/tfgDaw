import { reactive } from 'vue'

export const userStore = reactive({
  user: {
    _id: null,
    username: 'Invitado',
    email: '',
    avatar: '/img/perfil.jpg',
    subscription: null
  },
  token: null,
  isAuthenticated: false,

  // Carga sesión desde localStorage
  loadSession() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user)
        this.updateUser(parsedUser)
        this.token = token
        this.isAuthenticated = true
      } catch (err) {
        console.error("Error cargando sesión:", err)
        this.logout()
      }
    }
  },

  // Actualiza usuario propiedad por propiedad
  updateUser(userData) {
    this.user._id = userData._id ?? this.user._id
    this.user.username = userData.username ?? this.user.username
    this.user.email = userData.email ?? this.user.email
    this.user.avatar = userData.avatar ?? this.user.avatar
    this.user.subscription = userData.subscription ?? this.user.subscription
    localStorage.setItem('user', JSON.stringify(this.user))
  },

  // Reemplaza el setUser por updateUser
  setUser(userData) {
    this.updateUser({
      ...userData,
      username: userData.username ?? 'Invitado',
      avatar: userData.avatar ?? '/img/perfil.jpg'
    })
    this.isAuthenticated = true
  },

  setToken(token) {
    this.token = token ?? ''
    localStorage.setItem('token', this.token)
  },

  setSession({ user, token }) {
    this.setUser(user)
    this.setToken(token)
    this.isAuthenticated = true
  },

  logout() {
    this.user = {
      _id: null,
      username: 'Invitado',
      email: '',
      avatar: '/img/perfil.jpg',
      subscription: null
    }
    this.token = null
    this.isAuthenticated = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})
