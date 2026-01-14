<script setup>
import { RouterView } from "vue-router"
import { onMounted } from 'vue'
import { userStore } from '@/stores/userStores'
import { SpeedInsights } from "@vercel/speed-insights/vue"
import { getUser } from '@/services/userService'

onMounted(async () => {
  // Si hay token en el store, cargar los datos del usuario
  if (userStore.token && userStore.user?._id) {
    try {
      const data = await getUser(userStore.user._id, userStore.token)
      // Actualizamos todo el usuario, incluyendo la suscripción
      userStore.user = data
    } catch (e) {
      console.error('Error cargando usuario:', e)
    }
  }
})
</script>

<template>
  <div>
    <SpeedInsights />
    <RouterView />
  </div>
</template>
