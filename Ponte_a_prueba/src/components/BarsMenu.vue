<template>
  <ul
    class="absolute top-full right-0 mt-2 w-56 p-2 rounded-xl z-50
           bg-white/90 backdrop-blur-xl border border-white/40
           shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]
           transition-all duration-300 ease-in-out"
  >
    <li
      v-for="item in menu"
      :key="item.id"
      class="relative group"
    >
      <router-link
        :to="item.route"
        @click="emit('cerrar')"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium
               transition-all duration-200 ease-out
               hover:bg-gray-50 hover:shadow-sm"
      >
        <div class="w-6 text-center transition-transform group-hover:scale-110">
          <i :class="['fa-solid', `fa-${item.icon}`,
          'transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-violet-500 group-hover:to-pink-500']"></i>
        </div>

        <span class="tracking-wide transition-all duration-200 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-violet-500 group-hover:to-pink-500">
            {{ item.label }}
        </span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(['cerrar']);

const menu = ref([
  {
    id: 1,
    label: "Exámenes",
    route: "/home",
    icon: "file-alt",
  },
  {
    id: 2,
    label: 'Modo Tinder',
    route: '/modotinder',
    icon: 'fire',
  },
  {
    id: 3,
    label: 'Biblioteca',
    route: '/biblioteca',
    icon: 'book',
  },
  {
    id: 4,
    label: 'Estudio',
    route: '/estudio',
    icon: 'graduation-cap',
  },
  {
    id: 5,
    label: 'Contacto',
    route: '/contacto',
    icon: 'envelope',
  },
]);
</script>

<style lang="scss">
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
</style>
