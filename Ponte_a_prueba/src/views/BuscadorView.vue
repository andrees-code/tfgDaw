<template>
  <div class="overflow-hidden h-screen"> <!-- Bloquea scroll global -->

    <!-- Header fijo -->
    <Header />

    <div :class="{ 'dark': isDark }" class="flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-full">

      <!-- Sidebar -->
      <aside
        :class="[
          'flex flex-col justify-between w-56 p-6 fixed h-full transition-transform bg-gray-900 z-20',
          { '-translate-x-64': !sidebarVisible }
        ]"
      >
        <div>
          <!-- Navegación -->
          <nav class="flex flex-col gap-3">
            <router-link to="" class="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">Inicio</router-link>
            <router-link to="/home" class="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">Zona de Examenes</router-link>
            <router-link to="" class="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">Historial</router-link>
            <router-link to="" class="px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">Ajustes</router-link>
          </nav>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">© 2026 tuZona</div>
      </aside>

      <!-- Contenido principal -->
      <div class="flex-1 ml-56 md:ml-0 flex flex-col p-6 relative h-full">

        <!-- Página de resultados -->
        <div v-if="hasSearched" class="flex flex-col items-center w-full h-full">



          <div class="relative w-full max-w-xl mb-6">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Buscar..."
              class="w-full rounded-full py-2 px-4 shadow-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
            <span class="absolute right-3 top-2.5 text-gray-400 dark:text-gray-300 cursor-pointer">🎤</span>
          </div>

          <!-- Contenedor de resultados con scroll -->
          <div class="w-full max-w-3xl space-y-6 overflow-y-auto flex-1">
            <div v-if="searchResults.length === 0" class="text-gray-600 dark:text-gray-300">
              No se encontraron resultados para "{{ searchQuery }}"
            </div>
            <div v-for="(item, index) in searchResults" :key="index" class="text-left">
              <a :href="item.url" target="_blank" rel="noopener noreferrer"
                 class="block hover:bg-gray-100 dark:hover:bg-gray-800 p-4 rounded transition">
                <h2 class="text-blue-500 text-xl mb-1">{{ item.title }}</h2>
                <p class="text-gray-700 dark:text-gray-300 line-clamp-2">{{ item.snippet }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ getDomain(item.url) }}</p>
              </a>
            </div>
          </div>

        </div>

        <!-- Página de inicio -->
        <div v-else class="flex flex-col items-center justify-center w-full h-full overflow-hidden mb-[10%]">
          <img src="../assets/logo/prueba2.png" alt="tuZona Logo" class="w-80 max-w-full h-auto object-contain mb-7" />

          <div class="relative w-full max-w-xl mb-6">
            <input
              v-model="searchQuery"
              @keyup.enter="performSearch"
              type="text"
              placeholder="Buscar..."
              class="w-full rounded-full py-2 px-4 shadow-md border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            />
            <span class="absolute right-3 top-2.5 text-gray-400 dark:text-gray-300 cursor-pointer">🎤</span>
          </div>

          <div class="flex gap-4 mt-4 flex-wrap justify-center">
            <button @click="performSearch" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">Buscar</button>
            <button @click="luckySearch" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition">Me siento con suerte</button>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Header from '@/components/HeaderCompleto.vue';

const BRAVE_API_KEY = 'BSADq9O-6hkYHZBRxrvx71-khXKGY-Q';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const isDark = ref(prefersDark.matches);

watchEffect(() => {
  if (isDark.value) document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');
});

const sidebarVisible = ref(true);

const searchQuery = ref('');
const hasSearched = ref(false);
const searchResults = ref([]);

const performSearch = async () => {
  if (!searchQuery.value) return;
  hasSearched.value = true;
  searchResults.value = [];
  const query = encodeURIComponent(searchQuery.value);
  const url = `/api-brave/res/v1/web/search?q=${query}&country=es`;
  try {
    const response = await fetch(url, {
      headers: {
        'X-Subscription-Token': BRAVE_API_KEY,
        'Accept': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    if (data.web?.results?.length) {
      searchResults.value = data.web.results.map(item => ({
        url: item.url,
        title: item.title,
        snippet: item.snippet,
      }));
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda con Brave:', error);
  }
};

const luckySearch = async () => {
  if (!searchQuery.value) {
    window.open('https://www.google.com/doodles', '_blank');
    return;
  }
  await performSearch();
  if (searchResults.value.length > 0) {
    window.open(searchResults.value[0].url, '_blank');
  }
};

const getDomain = url => {
  try {
    return new URL(url).hostname;
  } catch {
    return (url.split('/')[2] || url);
  }
};


</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
