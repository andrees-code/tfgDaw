<template>
  <ul
    class="absolute top-full right-0 mt-2 w-56 p-2 rounded-xl z-50
           bg-slate-900/90 backdrop-blur-xl border border-white/10
           shadow-2xl shadow-indigo-500/10
           transition-all duration-300 ease-in-out origin-top-right"
    role="menu"
  >
    <li
      v-for="item in menu"
      :key="item.id"
      class="relative group"
      role="none"
    >
      <router-link
        :to="item.route"
        @click="emit('cerrar')"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 font-medium
               transition-all duration-200 ease-out
               hover:bg-white/5 hover:text-white hover:shadow-lg hover:shadow-indigo-500/5 focus:outline-none focus:bg-white/5"
        role="menuitem"
      >
        <div class="w-6 text-center transition-transform group-hover:scale-110">
          <i 
            :class="['fa-solid', `fa-${item.icon}`, 'text-slate-400 transition-all duration-200 group-hover:text-indigo-400']"
            aria-hidden="true"
          ></i>
        </div>

        <span class="tracking-wide transition-all duration-200 group-hover:text-indigo-300">
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
    label: 'Modo Reto',
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

<style scoped>
/* ✅ OPTIMIZACIÓN: 
   Eliminado el @import de FontAwesome.
   Ya se carga globalmente en index.html de forma asíncrona.
   Esto reduce el tiempo de bloqueo del menú.
*/
</style>