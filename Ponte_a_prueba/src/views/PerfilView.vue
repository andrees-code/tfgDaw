<template>
  <div class="min-h-screen flex flex-col bg-[#E8F1FD] font-sans">
    <Header />

    <main class="flex-grow flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-md md:max-w-4xl rounded-2xl shadow-xl p-6 md:p-10">

        <h2 class="text-center text-[#546E7A] font-bold text-lg mb-10">
          Ajustes de perfil
        </h2>

        <!-- FOTO DE PERFIL -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4">
            Foto de perfil
          </h3>

          <div class="flex items-center gap-6">
            <img
              :src="previewFoto || userStore.user?.avatar || fotoPlaceholder"
              class="w-24 h-24 rounded-full border-4 border-[#3978D7]"
            />

            <div>
              <label
                for="foto"
                class="bg-[#3978D7] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#2d62b3] text-sm"
              >
                Cambiar foto
              </label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                class="hidden"
                @change="cambiarFoto"
              />
              <p class="text-xs text-gray-500 mt-2">
                JPG o PNG · Máx. 2MB
              </p>
            </div>
          </div>
        </section>

        <!-- DATOS PERSONALES -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4">
            Datos personales
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              v-model="username"
              type="text"
              placeholder="Nombre completo"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />

            <input
              v-model="email"
              type="email"
              placeholder="Correo electrónico"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
          </div>
        </section>

        <!-- SEGURIDAD -->
        <section class="mb-10">
          <h3 class="font-semibold text-[#546E7A] mb-4">
            Seguridad
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              v-model="password"
              type="password"
              placeholder="Nueva contraseña"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />

            <input
              v-model="passwordConfirm"
              type="password"
              placeholder="Confirmar contraseña"
              class="w-full border border-gray-300 rounded-lg p-3 text-gray-600"
            />
          </div>
        </section>

        <!-- BOTÓN GUARDAR -->
        <button
          @click="guardarCambios"
          :disabled="loading"
          class="w-full bg-[#3978D7] hover:bg-[#2d62b3] text-white py-3 rounded-lg disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>

        <p v-if="mensaje" class="mt-4 text-center text-green-600 text-sm">
          {{ mensaje }}
        </p>

        <p v-if="error" class="mt-4 text-center text-red-500 text-sm">
          {{ error }}
        </p>

      </div>
    </main>

    <footer class="py-6 text-center text-gray-500 text-xs bg-white">
      © 2025 Nombre de la Empresa. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
import Header from '@/components/HeaderCompleto.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { userStore } from '@/stores/userStores'

const fotoPlaceholder = '/img/perro.jpg' // imagen por defecto
const previewFoto = ref(null)
const username = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const mensaje = ref('')
const error = ref('')
const loading = ref(false)

// inicializamos los campos cuando se monta el componente
onMounted(() => {
  if (userStore.user) {
    username.value = userStore.user.username
    email.value = userStore.user.email
  }
})

// cambiar preview de foto
function cambiarFoto(e) {
  const file = e.target.files[0]
  if (!file) return
  previewFoto.value = URL.createObjectURL(file)
}

// guardar cambios
async function guardarCambios() {
  if (!username.value || !email.value) {
    error.value = 'Nombre y correo son obligatorios'
    return
  }

  if (password.value && password.value !== passwordConfirm.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  loading.value = true
  error.value = ''
  mensaje.value = ''

  try {
    const formData = new FormData()
    formData.append('username', username.value)
    formData.append('email', email.value)
    if (password.value) formData.append('password', password.value)
    if (previewFoto.value) {
      formData.append('avatar', previewFoto.value)
    }

    await axios.put(
      `http://localhost:3000/api/v1/users/update/${userStore.user._id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userStore.token}`,
        },
      }
    )

    // actualizar store
    userStore.user.username = username.value
    userStore.user.email = email.value
    if (previewFoto.value) {
      userStore.user.avatar = previewFoto.value
    }

    mensaje.value = 'Cambios guardados correctamente'
    password.value = ''
    passwordConfirm.value = ''
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al guardar los cambios'
  } finally {
    loading.value = false
  }
}
</script>

<style lang="sass">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
@import url("https://fonts.cdnfonts.com/css/jacques-francois")

.font-serif-custom
  font-family: "Jacques Francois", serif
</style>
