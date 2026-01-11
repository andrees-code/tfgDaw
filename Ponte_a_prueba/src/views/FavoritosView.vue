<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">⭐ Favoritos</h1>

    <div
      v-for="exam in favorites"
      :key="exam._id"
      class="border rounded p-4 mb-4"
    >
      <h3 class="font-semibold">{{ exam.title }}</h3>

      <RouterLink
        :to="`/examen/${exam._id}`"
        class="text-blue-600"
      >
        Abrir
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFavoriteExams } from '@/services/examService'

const favorites = ref([])

onMounted(async () => {
  favorites.value = await getFavoriteExams()
})
</script>
